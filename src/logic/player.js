import { tick } from "svelte";
import { get } from "svelte/store";
import butterchurn from "butterchurn";
import WaveSurfer from "wavesurfer.js";
import { getSongVersions } from "~/logic/song";
import { showQueueItemAtIndex, updateQueue } from "~/logic/ui.js";
import {
    addAlternateVersionsNotification,
    addGainTagsMissingNotification,
    addRatingMissingNotification,
} from "~/logic/notification";
import {
    debugHelper,
    errorHandler,
    shuffleArray,
    truncateDecimals,
} from "~/logic/helper";
import { Settings } from "~/stores/settings";
import {
    CurrentMedia,
    CurrentMediaGainInfo,
    IsMobile,
    IsPlaying,
    JukeboxQueue,
    NowPlayingIndex,
    NowPlayingQueue,
    PlaybackSpeed,
} from "~/stores/state.js";
import { getCuratedVisualizerPresets } from "~/logic/visualizer.js";

/**
 * Interface with wavesurfer.js
 */
class Player {
    /**
     * Initialize data
     */
    constructor() {
        // wavesurfer doesn't support streaming directly, but it can use an <Audio> element which does
        this.audioElement = new Audio();
        this.audioElement.crossOrigin = "anonymous";
        this.audioElement.preload = "auto";
        this.audioContext = new AudioContext();
        this.mediaNode = null;

        // volume normalization
        this.targetVolume = parseInt(-14);
        this.masteredVolume = null;
        this.gainFactor = null;
        this.gainType = null;

        // filter nodes
        this.filters = [];
        this.filterGain = null;
        this.filterCompressor = null;
        this.filterBiquad = null; //(for testing only)

        // initial AbortController
        this.abortController = new AbortController();

        // visualizer
        this.visualizer = null;

        this.wavesurfer = new WaveSurfer({
            autoplay: true,
            backend: "MediaElement",
            barAlign: "bottom",
            barGap: 1,
            barWidth: 2,
            container: "#waveform",
            cursorWidth: 0,
            fillParent: true,
            height: "auto",
            hideScrollbar: true,
            media: this.audioElement,
            normalize: true,
        });

        Settings.subscribe((s) => {
            // PlayerVolume
            this.globalVolume = this.#logVolume(s.PlayerVolume); // volume here takes the linear 0-100 value and converts into a logarithmic float from 0.0 to 1.0
            this.wavesurfer.setVolume(this.globalVolume);

            // RepeatState
            this.repeatState = s.RepeatState;

            // VolumeNormalizationEnabled
            this.volumeNormalizationEnabled = s.VolumeNormalizationEnabled;

            // DynamicsCompressorEnabled
            this.dynamicsCompressorEnabled = s.DynamicsCompressorEnabled;
        });

        NowPlayingQueue.subscribe((value) => {
            this.nowPlayingQueue = value;
        });

        // Set current wavesurfer volume to max if mobile
        IsMobile.subscribe((value) => {
            this.globalVolume = value
                ? 1.0
                : this.#logVolume(get(Settings).PlayerVolume);
            this.wavesurfer.setVolume(this.globalVolume);
        });

        NowPlayingIndex.subscribe((value) => {
            this.nowPlayingIndex = value;
        });

        PlaybackSpeed.subscribe((value) => {
            this.setPlaybackRate(value);
        });

        IsPlaying.subscribe((value) => {
            this.isPlaying = value;
        });

        CurrentMedia.subscribe((value) => {
            this.currentMedia = value;
        });

        this.#init();
    }

    /*
     PUBLIC METHODS
     */

    /**
     * Begin playing
     */
    async start(forcePlay = false) {
        // Abort the previous loading request
        this.abortController.abort();

        // Create a new AbortController for the current request
        this.abortController = new AbortController();
        const abortSignal = this.abortController.signal;

        let self = this;

        debugHelper("start!");

        let item = this.#getCurrentQueueItem();

        if (forcePlay || this.isEligibleToPlay(item)) {
            CurrentMedia.set(item);
        } else if (!this.isEligibleToPlay(item)) {
            self.next();
            return;
        } else {
            debugHelper("No items could be found");
            this.#restartQueue();
            return;
        }

        try {
            // Load new item into media session
            if ("mediaSession" in navigator) {
                let details = {};

                if (item.object_type === "song") {
                    details.artist = item.artist?.name;
                    details.album = item.album?.name;
                }

                if (item.object_type === "podcast_episode") {
                    details.artist = item.podcast?.name;
                }

                navigator.mediaSession.metadata = new MediaMetadata({
                    title: item.name,
                    artwork: [{ src: `${item.art}&thumb=22` }],
                    ...details,
                });
            }

            // special handling for live_stream which has to go through <audio> element
            if (item.object_type === "live_stream") {
                this.audioElement.src = this.currentMedia.url;
                this.wavesurfer.setMediaElement(this.audioElement);
            } else {
                // Use cache first
                const cache = await caches.open("audio-cache");
                let response = await cache.match(item.url);

                if (!response) {
                    debugHelper("song was not in cache, do new fetch");
                    // If not in cache, fetch the audio file with abort signal
                    response = await fetch(item.url, { signal: abortSignal });
                    if (response.ok) {
                        await cache.put(item.url, response.clone()); // Clone response before caching
                    }
                } else {
                    debugHelper("song was in cache!");
                }

                const blob = await response.blob();

                // Load the audio into WaveSurfer
                this.wavesurfer.loadBlob(blob);
            }

            // set gain of this item
            this.filterGain.gain.value = this.#calculateGain();
            this.updateFilters();

            // update visualiser with this media
            this.visualizer?.connectAudio(this.mediaNode);

            this.wavesurfer
                .play()
                .then(async () => {
                    // start preloading next item
                    let nextItem = await this.findViableItem("next");

                    if (nextItem?.id) {
                        debugHelper("loading next song into cache");
                        const cache = await caches.open("audio-cache");
                        const response = await fetch(nextItem.url);
                        if (response.ok) {
                            await cache.put(nextItem.url, response);
                            debugHelper("cache successful");
                        }
                    }

                    this.#runChecks(item);
                })
                .catch((e) => {
                    // probably a race condition between quick succession load/play, ignore
                    debugHelper(e, "Wavesurfer race condition?");
                });
        } catch (e) {
            if (e.name === "AbortError") {
                debugHelper("Loading aborted");
            } else {
                console.warn("Something went wrong during start", e);
                self.next();
            }
        }
    }

    /**
     * Stop playback and destroy wavesurfer
     */
    stop() {
        this.wavesurfer.pause();
        IsPlaying.set(false);

        // workaround for this.wavesurfer.empty() firefox console repeating
        this.wavesurfer.load("./audio/silence.mp3", [[0]], 0.001);
        this.wavesurfer.stop();
    }

    /**
     * Play/pause
     */
    playPause() {
        debugHelper("play/pause!");

        // no media is actually loaded yet...
        if (this.nowPlayingQueue.length > 0 && !this.currentMedia) {
            this.start();
            return;
        }

        if (this.wavesurfer.isPlaying()) {
            this.wavesurfer.pause();
        } else {
            this.wavesurfer.play();
        }
    }

    /**
     * Play previous item
     */
    previous() {
        debugHelper("previous!");

        let viableItem = this.findViableItem("previous");

        if (viableItem) {
            this.setIndexToItem(viableItem);
        } else {
            this.#restartQueue();
            return;
        }

        this.stop();
        this.start();
    }

    /**
     * Play next item
     */
    next() {
        debugHelper("next!");

        // Abort any in-progress loading
        this.abortController.abort();

        this.stop();

        let viableItem = this.findViableItem("next");

        // only increment if we have something to increment from,
        // otherwise first queue item would be skipped
        if (viableItem) {
            // Increment index and play next
            this.setIndexToItem(viableItem);
        } else if (!this.hasEligibleItems()) {
            // Avoid recursive loop edge case
            this.stop();
            return;
        } else {
            this.#restartQueue();
            return;
        }

        // if item has no rating by the end of play, notify
        addRatingMissingNotification(this.currentMedia);

        this.start();
    }

    /**
     * Determine if there are any eligible items in the queue
     * @returns {boolean} True if there's at least one eligible item, false otherwise
     */
    hasEligibleItems() {
        return this.nowPlayingQueue.some((item) => this.isEligibleToPlay(item));
    }

    /**
     * @param {'previous' | 'next'} direction
     */
    findViableItem(direction) {
        let closestItem = null;
        let i =
            direction === "previous"
                ? this.nowPlayingIndex - 1
                : this.nowPlayingIndex + 1;

        while (
            direction === "previous" ? i >= 0 : i < this.nowPlayingQueue.length
        ) {
            if (this.isEligibleToPlay(this.nowPlayingQueue[i])) {
                closestItem = this.nowPlayingQueue[i];
                break;
            }
            direction === "previous" ? i-- : i++;
        }

        return closestItem;
    }

    isEligibleToPlay(item) {
        if (!item) return false;

        return (
            // SkipBelow is not enabled
            !get(Settings).SkipBelow.enabled ||
            // Item does not have a rating property
            !item.hasOwnProperty("rating") ||
            // Item is unrated but SkipBelow.allowZero is true
            (get(Settings).SkipBelow.enabled &&
                get(Settings).SkipBelow.allowZero &&
                !item.rating) ||
            // Item rating is above the threshold
            item.rating >= get(Settings).SkipBelow.rating
        );
    }

    setIndexToItem(media) {
        if (!media) return;

        let foundIndex = this.nowPlayingQueue.findIndex(
            (item) => item._id === media._id,
        );

        NowPlayingIndex.set(foundIndex);
    }

    /**
     * Shuffle all existing items in queue
     */
    shuffle() {
        this.clearAll();

        let tempArray = get(NowPlayingQueue);
        tempArray = shuffleArray(tempArray);
        this.#setQueueItems(tempArray).then(() => {
            NowPlayingIndex.set(0);
            this.start();
            tick().then((r) => showQueueItemAtIndex(0));
        });
    }

    /**
     * Toggle repeat states of queue
     */
    repeat() {
        let newState;
        if (this.repeatState === "disabled") {
            newState = "enabled";
        } else if (this.repeatState === "enabled") {
            newState = "repeat_one";
        } else {
            newState = "disabled";
        }
        Settings.update((x) => ({
            ...x,
            RepeatState: newState,
        }));
        debugHelper("repeat: " + newState);
    }

    /**
     * Replace queue with selected items
     * @param {object} items
     */
    playNow(items) {
        this.clearAll();
        this.#setQueueItems(items).then(() => {
            this.start();
        });
    }

    /**
     * Insert items after currently playing item
     * @param {object} items
     */
    playNext(items) {
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.splice(this.nowPlayingIndex + 1, 0, ...items);
        this.#setQueueItems(tempArray).then(() => {
            // Start playing if queue was empty
            if (queueLength === 0) {
                this.start();
            }
        });
    }

    /**
     * Add items to the end of the user queue
     * @param {object} items
     */
    playLast(items) {
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.push(...items);
        this.#setQueueItems(tempArray).then(() => {
            // Start playing if queue was empty
            if (queueLength === 0) {
                this.start();
            }
        });
    }

    /**
     * Add items to the end of the jukebox queue
     * @param {object} items
     */
    jukeboxPlayLast(items) {
        let tempArray = get(JukeboxQueue);
        tempArray.push(...items);
        this.#setJukeboxQueueItems(tempArray);
    }

    /**
     * Play item at this index, ignoring any auto-skips
     * @param {number} index
     */
    playSelected(index) {
        this.stop();

        NowPlayingIndex.set(index);

        this.start(true);
    }

    getDuration() {
        let result = this.wavesurfer?.getDuration();
        return Number.isFinite(result) ? result : 0;
    }

    getCurrentTime() {
        let result = this.wavesurfer?.getCurrentTime();
        return Number.isFinite(result) ? result : 0;
    }

    goForward(seconds) {
        this.wavesurfer?.skip(seconds);
    }

    goBackward(seconds) {
        this.wavesurfer?.skip(-seconds);
    }

    seekTo(percentage) {
        this.wavesurfer.seekTo(percentage);
    }

    setMuted(bool) {
        this.wavesurfer?.setMuted(bool);
    }

    /**
     * Clear the queue
     */
    clearQueue() {
        // clear all tracks EXCEPT currently playing, unless it is the only item in queue
        if (this.nowPlayingQueue.length > 1) {
            this.#clearAllExceptCurrent();
        } else {
            this.clearAll();
        }
    }

    setWaveColors() {
        let player = document.querySelector(".site-player");

        tick().then(() => {
            this.wavesurfer.setOptions({
                // get from the player
                waveColor: getComputedStyle(player).getPropertyValue(
                    "--color-outline-variant",
                ),
                progressColor:
                    getComputedStyle(player).getPropertyValue(
                        "--color-waveform",
                    ),
            });
        });
    }

    /**
     * Clear all items in queue
     */
    clearAll() {
        this.stop();
        CurrentMedia.set(null);
        NowPlayingIndex.set(0);
        this.#setQueueItems([]);
    }

    updateFilters() {
        // reset active filters list
        this.filters = [];

        // 1. gain
        if (this.volumeNormalizationEnabled && this.gainType !== "None") {
            this.filters.push(this.filterGain);
        }

        // 2. dynamics compressor
        if (this.dynamicsCompressorEnabled) {
            this.filters.push(this.filterCompressor);
        }

        // last. biquad (for testing only)
        // this.filters.push(this.filterBiquad);

        debugHelper(this.filters, "Active filters");

        this.#setFilters();
        this.audioContext.resume(); // Chrome isn't happy without this
    }

    setPlaybackRate(val) {
        this.wavesurfer.setPlaybackRate(val);
    }

    loadVisualizerPreset(presetData, blendTime) {
        this.visualizer?.loadPreset(presetData, blendTime);
    }

    /*
     #PRIVATE METHODS
     */

    #disconnectFilters() {
        if (this.filters) {
            this.filters.forEach((filter) => {
                filter && filter.disconnect();
            });
            this.filters = null;

            // Critical, otherwise filters don't reconnect in series
            this.mediaNode.disconnect();

            // Reconnect direct path
            this.mediaNode.connect(this.audioContext.destination);
        }
    }

    #setFilters() {
        let filters = this.filters;
        // Remove existing filters
        this.#disconnectFilters();

        // Insert filters if filter array not empty
        if (filters && filters.length) {
            this.filters = filters;

            // Disconnect direct path before inserting filters
            this.mediaNode.disconnect();

            // Connect each filter in turn
            filters
                .reduce((prev, curr) => {
                    prev.connect(curr);
                    return curr;
                }, this.mediaNode)
                .connect(this.audioContext.destination);
        }
    }

    /**
     * More setup which doesn't belong in constructor
     */
    #init() {
        const presets = getCuratedVisualizerPresets();
        const preset = presets["$$$ Royal - Mashup (197)"];

        this.wavesurfer.setVolume(this.globalVolume);

        // initialise filters
        this.#initFilters();

        // respond to wavesurfer emitted events
        this.#initWavesurferEvents();

        // set up keyboard media buttons
        this.#initKeyboardMediaKeys();

        try {
            // set up visualizer
            this.visualizer = butterchurn.createVisualizer(
                this.audioContext,
                document.querySelector("#visualizer"),
                {
                    width: 1600,
                    height: 900,
                    pixelRatio: window.devicePixelRatio || 1,
                    textureRatio: 1,
                },
            );

            this.visualizer?.connectAudio(this.mediaNode);
            this.visualizer?.loadPreset(preset, 5); // 2nd argument is the number of seconds to blend presets
            this.#startRenderer();
        } catch (e) {
            errorHandler("initializing visualizer", e);
        }
    }

    #startRenderer() {
        requestAnimationFrame(() => {
            if (this.isPlaying) {
                // Check if media is playing
                this.visualizer?.render();
            }
            this.#startRenderer();
        });
    }

    #initFilters() {
        this.filterGain = this.audioContext.createGain();
        this.filterCompressor = this.audioContext.createDynamicsCompressor();
        this.filterCompressor.threshold.value = -30;
        this.filterCompressor.knee.value = 10.0;
        this.filterCompressor.ratio.value = 2.0;
        this.filterCompressor.attack.value = 0.1; // 100ms
        this.filterCompressor.release.value = 0.3; // 300ms
        this.filterBiquad = this.audioContext.createBiquadFilter();

        // create a starting node with our current media
        this.mediaNode = this.audioContext.createMediaElementSource(
            this.wavesurfer.getMediaElement(),
        );

        this.updateFilters();
    }

    #initWavesurferEvents() {
        let self = this;

        this.wavesurfer.on("error", function (e) {
            debugHelper(e, "Wavesurfer play error");
            IsPlaying.set(false);
            self.next();
        });

        this.wavesurfer.on("play", function () {
            debugHelper("Wavesurfer playing");
            IsPlaying.set(true);
            self.setPlaybackRate(get(PlaybackSpeed));
        });

        this.wavesurfer.on("pause", function () {
            debugHelper("Wavesurfer paused");
            IsPlaying.set(false);
        });

        this.wavesurfer.on("finish", function () {
            debugHelper("Wavesurfer finished");

            if (self.repeatState === "repeat_one") {
                self.start();
            } else {
                self.next();
            }
        });

        this.wavesurfer.on("ready", function () {
            debugHelper("Wavesurfer ready");

            self.setWaveColors();
        });

        // debug events
        // ["ready", "interaction", "redraw", "redrawcomplete"].forEach((e) =>
        //     this.wavesurfer.on(e, () => console.log(Date.now(), e)),
        // );
    }

    #initKeyboardMediaKeys() {
        let self = this;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", function () {
                self.playPause();
            });
            navigator.mediaSession.setActionHandler("pause", function () {
                self.playPause();
            });
            navigator.mediaSession.setActionHandler("stop", function () {
                self.stop();
            });
            navigator.mediaSession.setActionHandler("nexttrack", function () {
                self.next();
            });
            navigator.mediaSession.setActionHandler(
                "previoustrack",
                function () {
                    self.previous();
                },
            );
        }
    }

    #logVolume(val) {
        return Math.pow(val / 100, 2);
    }

    /**
     * Clear all tracks EXCEPT currently playing
     */
    #clearAllExceptCurrent() {
        this.#setQueueItems([this.#getCurrentQueueItem()]).then(() => {
            NowPlayingIndex.set(0);
        });
    }

    #getCurrentQueueItem() {
        return this.nowPlayingQueue[this.nowPlayingIndex] || null;
    }

    /**
     * Restart the queue
     */
    #restartQueue() {
        NowPlayingIndex.set(0);

        // unload any currently loaded items
        this.audioElement.src = null;
        CurrentMedia.set(null);

        if (this.repeatState === "enabled") {
            debugHelper("queue restarted");
            this.start();
        } else {
            debugHelper("repeat not enabled, stopping");
            this.stop();
        }
    }

    // keep this as purely a setting method
    async #setQueueItems(arr) {
        NowPlayingQueue.set(arr);
        await updateQueue();
    }

    // keep this as purely a setting method
    async #setJukeboxQueueItems(arr) {
        JukeboxQueue.set(arr);
    }

    #runChecks(item) {
        // notify if missing gain tags
        if (
            item.object_type === "song" &&
            item.r128_track_gain === null &&
            item.replaygain_track_gain === null
        ) {
            addGainTagsMissingNotification(item);
        }

        // Search for song versions if artist is present
        if (item.object_type === "song" && item.artist?.id) {
            getSongVersions(item.title, item.artist.name).then((result) => {
                if (!result.error && result.length > 1) {
                    item.versionsCount = result.length - 1;
                    addAlternateVersionsNotification(item);
                }
            });
        }
    }

    /**
     * Calculate gain (R128 & ReplayGain)
     * @returns {number} finalGainAmount
     */
    #calculateGain() {
        // defaults
        let finalGainAmount = 1;
        let parsedGainLevel = 1;

        CurrentMediaGainInfo.set({
            gainType: "None",
            gainFactor: 1,
            masteredVolume: 0,
        });

        let r128 = this.currentMedia.r128_track_gain;
        let rg = this.currentMedia.replaygain_track_gain;

        let r128_track_gain =
            r128 !== undefined && r128 !== null ? r128.toString() : null;
        let replaygain_track_gain =
            rg !== undefined && rg !== null ? rg.toString() : null;

        if (r128_track_gain !== null) {
            // EBU R128
            const referenceLevel = parseInt(-23); // LUFS https://en.wikipedia.org/wiki/EBU_R_128#Specification
            parsedGainLevel = parseInt(r128_track_gain / 256); // LU/dB away from baseline of -23 LUFS/dB, stored as Q7.8 (2 ^ 8) https://datatracker.ietf.org/doc/html/rfc7845.html#section-5.2.1
            let masteredVolume = referenceLevel - parsedGainLevel;
            let difference = this.targetVolume - masteredVolume;

            finalGainAmount = Math.pow(10, difference / 20);

            CurrentMediaGainInfo.set({
                gainType: "EBU R128",
                gainFactor: truncateDecimals(finalGainAmount),
                masteredVolume: truncateDecimals(masteredVolume),
            });
        } else if (replaygain_track_gain !== null) {
            // ReplayGain
            const referenceLevel = parseInt(-18); // ReplayGain 2.0 reference level is -18 LUFS
            parsedGainLevel = parseFloat(replaygain_track_gain);
            let trackLoudness = referenceLevel - parsedGainLevel;
            let difference = this.targetVolume - trackLoudness;

            finalGainAmount = Math.pow(10, difference / 20);

            CurrentMediaGainInfo.set({
                gainType: "ReplayGain",
                gainFactor: truncateDecimals(finalGainAmount),
                masteredVolume: truncateDecimals(trackLoudness),
            });
        }

        return finalGainAmount;
    }
}

export default Player;
