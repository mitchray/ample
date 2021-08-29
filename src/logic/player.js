import { tick } from "svelte";
import { get } from 'svelte/store';
import WaveSurfer from 'wavesurfer.js';
import { debugHelper, shuffleArray } from './helper';
import {
    NowPlayingQueue,
    NowPlayingIndex,
    IsPlaying,
    IsMuted,
    CurrentSong,
    RepeatEnabled,
    VolumeNormalizationEnabled,
    DynamicsCompressorEnabled
} from '../stores/status';

/**
 * Interface with wavesurfer.js
 */
class Player {
    /**
     * Initialize data
     */
    constructor() {
        this.wavesurfer = null;
        this.defaultTitle = document.title;
        this.id = null;
        this.stopQueued = false;
        this.globalVolume = 0.5;

        // volume normalization
        this.targetVolume = parseInt(-14);
        this.masteredVolume = null;
        this.gainNeeded = null;
        this.gainValue = null;
        this.gainType = null;
        this.gainTagValue = null;

        // filter nodes
        this.activeFilters = [];
        this.filterGain = null;
        this.filterCompressor = null;
        this.filterBiquad = null; //(for testing only)

        NowPlayingQueue.subscribe(value => {
            this.nowPlayingQueue = value;
        });

        NowPlayingIndex.subscribe(value => {
            this.nowPlayingIndex = value;
        });

        IsPlaying.subscribe(value => {
            this.isPlaying = value;
        });

        IsMuted.subscribe(value => {
            this.isMuted = value;
        });

        VolumeNormalizationEnabled.subscribe(value => {
            this.volumeNormalizationEnabled = value;
        });

        DynamicsCompressorEnabled.subscribe(value => {
            this.dynamicsCompressorEnabled = value;
        });

        CurrentSong.subscribe(value => {
            this.currentSong = value;
        });

        RepeatEnabled.subscribe(value => {
            this.repeatEnabled = value;
        });
    }

    async setWaveColors() {
        if (this.wavesurfer) {
            await tick();
            this.wavesurfer.setProgressColor(getComputedStyle(document.body).getPropertyValue('--color-waveform-progress'));
            this.wavesurfer.setWaveColor(getComputedStyle(document.body).getPropertyValue('--color-waveform-wave'));
        }
    }

    initFilters() {
        if (this.wavesurfer) {
            this.filterGain = this.wavesurfer.backend.ac.createGain();

            this.filterCompressor = this.wavesurfer.backend.ac.createDynamicsCompressor();
            this.filterCompressor.threshold.value = -50;
            this.filterCompressor.knee.value = 0.0;
            this.filterCompressor.ratio.value = 20.0;
            this.filterCompressor.attack.value = 0.005; // 5ms
            this.filterCompressor.release.value = 0.050; // 50ms

            this.filterBiquad = this.wavesurfer.backend.ac.createBiquadFilter();
        }
    }

    async updateFilters() {
        if (this.wavesurfer) {
            await tick();
            this.activeFilters = [];

            // 1. gain
            if (this.volumeNormalizationEnabled && this.gainType !== "None") {
                this.activeFilters.push(this.filterGain);
            }

            // 2. dynamics compressor
            if (this.dynamicsCompressorEnabled) {
                this.activeFilters.push(this.filterCompressor);
            }

            // last. biquad (for testing only)
            // this.activeFilters.push(this.filterBiquad);

            debugHelper(this.activeFilters, 'Active filters');

            // finally, apply any filters
            this.wavesurfer.backend.setFilters(this.activeFilters);

            // redraw waveform regardless
            this.wavesurfer.drawBuffer();
        }
    }

    /**
     * Clear the queue
     */
    clearQueue() {
        this.stopQueued = true;
        this.stop();
        CurrentSong.set(null);
        NowPlayingQueue.set([]);
        NowPlayingIndex.set(0);
        IsPlaying.set(false);
    }

    /**
     * Restart the queue
     */
    restartQueue() {
        if (this.repeatEnabled) {
            debugHelper('queue restarted');
            NowPlayingIndex.set(0);
            this.start(this.nowPlayingQueue[0]);
        } else {
            this.clearQueue();
        }
    }

    /**
     * Create wavesurfer and begin playing
     */
    async start(song) {
        let self = this;

        debugHelper('start!');

        // Load from queue if no song is directly passed
        if (!song) {
            song = this.nowPlayingQueue[this.nowPlayingIndex];
        }

        if (song) {
            CurrentSong.set(song);
            document.title = song.title + " - " + song.artist.name;
        } else {
            debugHelper('No song IDs could be found');
            document.title = this.defaultTitle;
            this.clearQueue();
            return false;
        }

        try {
            this.wavesurfer = WaveSurfer.create({
                backend: 'MediaElementWebAudio',
                container: '#waveform',
                height: document.querySelector(".site-player__waveform").offsetHeight,
                barMinHeight: 1,
                cursorWidth: 0,
                normalize: true,
                responsive: true,
                hideScrollbar: true,
            });

            this.initFilters();
            this.filterGain.gain.value = this.calculateGain();
            this.wavesurfer.setVolume(this.globalVolume);
            this.wavesurfer.load(this.currentSong.url);

            await this.updateFilters();

            this.wavesurfer.on('play', function () {
                debugHelper('Wavesurfer playing');
                IsPlaying.set(true);
                self.recordLastPlayed();
            });

            this.wavesurfer.on('pause', function () {
                debugHelper('Wavesurfer paused');
                IsPlaying.set(false);
            });

            this.wavesurfer.on('finish', function () {
                debugHelper('Wavesurfer finished');
                self.next();
            });

            this.wavesurfer.on('ready', function () {
                debugHelper('Wavesurfer ready');

                self.setWaveColors();

                if (self.stopQueued) {
                    self.stop();
                }
            });

            this.wavesurfer.on('volume', function (e) {
                debugHelper('Wavesurfer volume updated');
                self.globalVolume = e;
            });

            this.wavesurfer.on('error', function (e) {
                debugHelper('Wavesurfer play error', e);

                // TODO clarify these errors
                // IsPlaying.set(false);

                if (e !== null) {
                    debugHelper('Wavesurfer load error?', e);
                    // self.next();
                }
            });

            this.wavesurfer.play();
        } catch (e) {
            console.warn('Something went wrong during start', e);
            self.next();
        }
    }

    recordLastPlayed() {
        let self = this;

        if (this.wavesurfer && this.wavesurfer.getCurrentTime() > 3) {
            // add/update lastPlayed property
            this.nowPlayingQueue[this.nowPlayingIndex].lastPlayed = Date.now();

            // update the store with our modified object
            NowPlayingQueue.set(this.nowPlayingQueue);
        } else {
            window.setTimeout(function() {
                self.recordLastPlayed();
            }, 500);
        }
    }

    /**
     * Stop playback and destroy wavesurfer
     */
    stop() {
        if (this.wavesurfer) {
            this.wavesurfer.cancelAjax();
            delete this.wavesurfer.backend.buffer;
            this.wavesurfer.destroy();
            this.wavesurfer = null;
        }

        this.stopQueued = false;
    }

    /**
     * Play/pause Howl
     */
    playPause() {
        debugHelper('play/pause!');

        if (this.wavesurfer) {
            if (this.wavesurfer.isPlaying()) {
                this.wavesurfer.pause();
            } else {
                this.wavesurfer.play();
            }
        } else {
            this.start();
        }
    }

    /**
     * Play previous song
     */
    previous() {
        debugHelper('previous!');

        if (this.nowPlayingIndex > -1) {

            // If playback has passed a certain point, restart song instead
            if (this.wavesurfer.getCurrentTime() < 3) {
                NowPlayingIndex.update(n => n - 1);
            }
        }

        this.stop();
        this.start(this.nowPlayingQueue[this.nowPlayingIndex]);
    }

    /**
     * Play next song
     */
    next() {
        debugHelper('next!');

        this.stop();

        // Increment index and play next
        if (this.nowPlayingIndex + 1 < this.nowPlayingQueue.length) {
            NowPlayingIndex.update(n => n + 1);
            this.start(this.nowPlayingQueue[this.nowPlayingIndex]);
        } else {
            this.restartQueue();
        }
    }

    /**
     * Shuffle all existing songs in queue
     */
    shuffle() {
        let tempArray = get(NowPlayingQueue);

        this.clearQueue();

        tempArray = shuffleArray(tempArray);

        NowPlayingQueue.set(tempArray);
        NowPlayingIndex.set(0);
        this.start();
    }

    /**
     * Toggle repeat of queue
     */
    repeat() {
        let inverted = !this.repeatEnabled;
        localStorage.setItem('RepeatEnabled', JSON.stringify(inverted));
        RepeatEnabled.set(inverted);
        debugHelper('repeat: ' + this.repeatEnabled);
    }

    /**
     * Replace queue with selected songs
     * @param {object} songs
     */
    playNow(songs) {
        this.clearQueue();
        NowPlayingQueue.set(songs);
        this.start();
    }

    /**
     * Insert songs after currently playing song
     * @param {object} songs
     */
    playNext(songs) {
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.splice(this.nowPlayingIndex + 1, 0, ...songs);
        NowPlayingQueue.set(tempArray);

        // Start playing if queue was empty
        if (queueLength === 0) {
            this.start();
        }
    }

    /**
     * Add songs to the end of the queue
     * @param {object} songs
     */
    playLast(songs) {
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.push(...songs);
        NowPlayingQueue.set(tempArray);

        // Start playing if queue was empty
        if (queueLength === 0) {
            this.start();
        }
    }

    /**
     * Play song at this index
     * @param {number} index
     */
    playSelected(index) {
        if (this.wavesurfer) {
            this.wavesurfer.destroy();
        }

        NowPlayingIndex.set(index);

        this.start();
    }

    /**
     * Calculate gain (R128 & ReplayGain)
     * @returns {number} gainLevel
     */
    calculateGain() {
        // defaults
        let gainLevel = 0;
        let replayGain = 0;

        this.masteredVolume = 0;
        this.gainNeeded = 0;

        let r128_track_gain = this.currentSong.r128_track_gain;
        let rg_track_gain = this.currentSong.replaygain_track_gain;

        if (r128_track_gain !== null) { // R128 PREFERRED
            this.gainType = 'EBU R128';

            replayGain = parseInt(r128_track_gain / 256); // LU/dB away from baseline of -23 LUFS/dB, stored as Q7.8 (2 ^ 8) https://datatracker.ietf.org/doc/html/rfc7845.html#section-5.2.1
            const referenceLevel = parseInt(-23); // LUFS https://en.wikipedia.org/wiki/EBU_R_128#Specification
            let masteredVolume = referenceLevel - replayGain;
            let difference = this.targetVolume - masteredVolume;

            gainLevel = difference;

            this.masteredVolume = masteredVolume;
            this.gainNeeded = gainLevel.toFixed(2);

            gainLevel = Math.pow(10, (gainLevel / 20));
        } else if (rg_track_gain !== null) { // Replay Gain fallback
            this.gainType = 'ReplayGain';

            replayGain = parseFloat(rg_track_gain);
            this.gainTagValue = replayGain;

            gainLevel = replayGain;

            this.gainNeeded = gainLevel.toFixed(2);

            gainLevel = Math.pow(10, (gainLevel / 20));
        } else {
            this.gainType = 'None';
        }

        return gainLevel;
    }
}

export default Player;