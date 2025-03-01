import { tick } from "svelte";
import { get } from "svelte/store";
import butterchurn from "butterchurn";
import WaveSurfer from "wavesurfer.js";
import EnvelopePlugin from "wavesurfer.js/dist/plugins/envelope.js";
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
    IsPlaying,
    JukeboxQueue,
    NowPlayingIndex,
    NowPlayingQueue,
    PlaybackSpeed,
} from "~/stores/state.js";
import { getCuratedVisualizerPresets } from "~/logic/visualizer.js";
import { MediaPlayer } from "~/stores/elements.js";

let wavesurferCommonOptions = {
    autoplay: true,
    backend: "MediaElement",
    barAlign: "bottom",
    barGap: 1,
    barWidth: 2,
    cursorWidth: 0,
    fillParent: true,
    height: "auto",
    hideScrollbar: true,
    normalize: true,
};

function createWavesurferInstance(containerSelector) {
    // wavesurfer doesn't support streaming directly, but it can use an <Audio> element which does
    const audioElement = new Audio();
    audioElement.crossOrigin = "anonymous";
    audioElement.preload = "auto";

    const audioContext = new AudioContext();

    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = 0;
    compressor.knee.value = 10.0;
    compressor.ratio.value = 2.0;
    compressor.attack.value = 0.1; // 100ms
    compressor.release.value = 0.3; // 300ms

    const filters = {
        tagGain: audioContext.createGain(),
        compressor,
        masterVolume: audioContext.createGain(),
    };

    const wavesurfer = new WaveSurfer({
        ...wavesurferCommonOptions,
        container: containerSelector,
        media: audioElement,
    });

    const mediaNode = audioContext.createMediaElementSource(
        wavesurfer.getMediaElement(),
    );

    return {
        audioElement,
        filters,
        wavesurfer,
        mediaNode,
        audioContext,
    };
}

/**
 * Interface with wavesurfer.js
 */
class Player {
    /**
     * Initialize data
     */
    constructor() {
        // wavesurfer instances and accessors
        this.playerA = createWavesurferInstance("#waveformA");
        this.playerB = createWavesurferInstance("#waveformB");
        this.players = {
            playerA: this.playerA,
            playerB: this.playerB,
        };
        // init with playerB to really start with playerA
        this.currentPlayer = this.playerB;
        this.currentPlayerID = "playerB";

        // volume
        this.targetVolume = parseInt(-14);
        this.masteredVolume = null;
        this.gainFactor = null;
        this.gainType = null;

        // other
        this.approachingEnd = false;

        // initial AbortController
        this.abortController = new AbortController();

        // visualizer
        this.visualizer = null;
        this.visualizerAudioContextProxy = new AudioContext();

        Settings.subscribe((s) => {
            // PlayerVolume
            this.globalVolume = this.#logVolume(s.PlayerVolume); // volume here takes the linear 0-100 value and converts into a logarithmic float from 0.0 to 1.0

            // RepeatState
            this.repeatState = s.RepeatState;

            // VolumeNormalizationEnabled
            this.volumeNormalizationEnabled = s.VolumeNormalizationEnabled;

            // DynamicsCompressorEnabled
            this.dynamicsCompressorEnabled = s.DynamicsCompressorEnabled;

            // Crossfade
            this.crossfadeDuration = s.Crossfade.duration;
            this.crossfadeEnabled = s.Crossfade.mode === "crossfade";

            // Gapless
            this.gaplessEnabled = s.Crossfade.mode === "gapless";
        });

        NowPlayingQueue.subscribe((value) => {
            this.nowPlayingQueue = value;
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

        await this.#switchPlayers();

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
                this.currentPlayer.audioElement.src = this.currentMedia.url;
                this.currentPlayer.wavesurfer.setMediaElement(
                    this.currentPlayer.audioElement,
                );
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
                this.currentPlayer.wavesurfer.loadBlob(blob);
            }

            // set gain of this item
            this.currentPlayer.filters.tagGain.gain.value =
                this.#calculateGain();
            this.updateFilters();

            // update visualiser with this media
            this.#visualizerConnectAudio();

            this.currentPlayer.wavesurfer
                .play()
                .then(async () => {
                    this.currentPlayer.duration =
                        this.currentPlayer.wavesurfer.getDuration();

                    // remove previous envelope
                    this.currentPlayer.wavesurfer.envelopePlugin?.setPoints([]);
                    this.currentPlayer.wavesurfer.envelopePlugin?.destroy();

                    // attach Envelope plugin if crossfade enabled & enough time
                    if (
                        this.crossfadeEnabled &&
                        this.crossfadeDuration * 2 < this.currentPlayer.duration
                    ) {
                        // attach Envelope plugin to Wavesurfers
                        let envelope =
                            this.currentPlayer.wavesurfer.registerPlugin(
                                EnvelopePlugin.create({
                                    volume: 1.0,
                                    lineColor: "rgba(255, 0, 0, 0.5)",
                                    lineWidth: 4,
                                    dragPointSize: 12,
                                    dragLine: true,
                                    dragPointFill: "rgba(0, 255, 255, 0.8)",
                                    dragPointStroke: "rgba(0, 0, 0, 0.5)",
                                    points: [
                                        {
                                            time: 0,
                                            volume: 0.0,
                                        },
                                        {
                                            time:
                                                (this.crossfadeDuration / 2) *
                                                0.66,
                                            volume: 0.3,
                                        },
                                        {
                                            time: this.crossfadeDuration / 2,
                                            volume: 1.0,
                                        },
                                        //
                                        {
                                            time:
                                                this.currentPlayer.duration -
                                                this.crossfadeDuration,
                                            volume: 1.0,
                                        },
                                        {
                                            time:
                                                this.currentPlayer.duration -
                                                this.crossfadeDuration * 0.66,
                                            volume: 0.3,
                                        },
                                        {
                                            time:
                                                this.currentPlayer.duration -
                                                0.1,
                                            volume: 0.0,
                                        },
                                    ],
                                }),
                            );

                        this.currentPlayer.wavesurfer.envelopePlugin = envelope;

                        envelope.on("points-change", (points) => {
                            // console.log("Envelope points changed", points);
                        });
                        envelope.on("volume-change", (vol) => {
                            // console.log("Envelope volume changed", vol);
                        });
                    }

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
        IsPlaying.set(false);
        this.approachingEnd = false;

        this.empty(this.players["playerA"]);
        this.empty(this.players["playerB"]);
    }

    empty(player) {
        player.wavesurfer.pause();
        // workaround for this.wavesurfer.empty() firefox console repeating
        player.wavesurfer
            .load("./audio/silence.mp3", [[0]], 0.001)
            .then((r) => player.wavesurfer.stop());
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

        // apply to all players
        if (this.currentPlayer.wavesurfer.isPlaying()) {
            Object.keys(this.players).forEach((key) => {
                this.players[key].wavesurfer.pause();
            });
            IsPlaying.set(false);
        } else {
            Object.keys(this.players).forEach((key) => {
                // only resume players with in progress items
                if (this.players[key].wavesurfer.getCurrentTime() > 0) {
                    this.players[key].wavesurfer.play();
                }
            });
            IsPlaying.set(true);
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
    next(clearAll = false) {
        debugHelper("next!");

        if (this.repeatState === "repeat_one") {
            this.start();
            return;
        }

        // Abort any in-progress loading
        this.abortController.abort();

        if (clearAll) {
            // stop all players
            this.stop();
        }

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
        let result = this.currentPlayer.wavesurfer?.getDuration();
        return Number.isFinite(result) ? result : 0;
    }

    getCurrentTime() {
        let result = this.currentPlayer.wavesurfer.getCurrentTime();
        return Number.isFinite(result) ? result : 0;
    }

    goForward(seconds) {
        this.currentPlayer.wavesurfer?.skip(seconds);
    }

    goBackward(seconds) {
        this.currentPlayer.wavesurfer?.skip(-seconds);
    }

    seekTo(percentage) {
        this.currentPlayer.wavesurfer.seekTo(percentage);
    }

    setMuted(bool) {
        Object.keys(this.players).forEach((key) => {
            this.players[key].wavesurfer.setMuted(bool);
        });
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
        let playerElement = document.querySelector(".site-player");

        tick().then(() => {
            Object.keys(this.players).forEach((key) => {
                this.players[key].wavesurfer.setOptions({
                    // get from the player
                    waveColor: getComputedStyle(playerElement).getPropertyValue(
                        "--color-outline-variant",
                    ),
                    progressColor:
                        getComputedStyle(playerElement).getPropertyValue(
                            "--color-waveform",
                        ),
                });
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
        // 1. tag gain on individual players
        if (this.volumeNormalizationEnabled && this.gainType !== "None") {
            this.currentPlayer.filters.tagGain.gain.value =
                this.#calculateGain();
        } else {
            // neutral value
            this.currentPlayer.filters.tagGain.gain.value = 1;
        }

        // every player
        Object.keys(this.players).forEach((key) => {
            // 2. dynamics compressor
            if (this.dynamicsCompressorEnabled) {
                this.players[key].filters.compressor.threshold.value = -30;
            } else {
                // neutral value
                this.players[key].filters.compressor.threshold.value = 0;
            }

            // 3. master volume, every player
            this.players[key].filters.masterVolume.gain.value =
                this.globalVolume;
        });

        debugHelper(this.currentPlayer.filters, "Active filters");

        // TODO: still needed?
        this.currentPlayer.audioContext.resume(); // Chrome isn't happy without this
    }

    #setupFilters() {
        // Connect each filter in turn
        Object.keys(this.players).forEach((key) => {
            const player = this.players[key];

            Object.values(player.filters)
                .reduce((prev, curr) => {
                    prev.connect(curr);
                    return curr;
                }, player.mediaNode)
                .connect(player.audioContext.destination);
        });
    }

    setPlaybackRate(val) {
        Object.keys(this.players).forEach((key) => {
            this.players[key].wavesurfer.setPlaybackRate(val);
        });
    }

    loadVisualizerPreset(presetData, blendTime) {
        this.visualizer?.loadPreset(presetData, blendTime);
    }

    /*
     #PRIVATE METHODS
     */

    async #switchPlayers() {
        this.currentPlayerID =
            this.currentPlayerID === "playerA" ? "playerB" : "playerA";

        this.currentPlayer = this.players[this.currentPlayerID];

        MediaPlayer.set(this);

        debugHelper("PLAYERS SWITCHED");
    }

    /**
     * More setup which doesn't belong in constructor
     */
    #init() {
        const presets = getCuratedVisualizerPresets();
        const preset = presets["$$$ Royal - Mashup (197)"];

        Object.keys(this.players).forEach((key) => {
            // set global volume
            this.players[key].wavesurfer.setVolume(this.globalVolume);
        });

        this.#setupFilters();

        // respond to wavesurfer emitted events
        this.#initWavesurferEvents();

        // set up keyboard media buttons
        this.#initKeyboardMediaKeys();

        try {
            // set up visualizer
            this.visualizer = butterchurn.createVisualizer(
                this.visualizerAudioContextProxy,
                document.querySelector("#visualizer"),
                {
                    width: 1600,
                    height: 900,
                    pixelRatio: window.devicePixelRatio || 1,
                    textureRatio: 1,
                },
            );

            this.#visualizerConnectAudio();
            this.visualizer?.loadPreset(preset, 5); // 2nd argument is the number of seconds to blend presets
            this.#startRenderer();
        } catch (e) {
            errorHandler("initializing visualizer", e);
        }
    }

    #visualizerConnectAudio() {
        let proxyMediaNode =
            this.visualizerAudioContextProxy.createMediaElementSource(
                this.currentPlayer.wavesurfer.getMediaElement(),
            );
        this.visualizer?.connectAudio(proxyMediaNode);
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

    #initWavesurferEvents() {
        let self = this;

        Object.keys(this.players).forEach((key) => {
            this.players[key].wavesurfer.on("error", function (e) {
                debugHelper(e, "Wavesurfer play error");
                IsPlaying.set(false);
                self.next();
            });

            this.players[key].wavesurfer.on("play", function () {
                debugHelper("Wavesurfer playing");
                IsPlaying.set(true);
                self.setPlaybackRate(get(PlaybackSpeed));
            });

            this.players[key].wavesurfer.on("pause", function () {
                debugHelper("Wavesurfer paused");
                // IsPlaying.set(false);
            });

            this.players[key].wavesurfer.on("finish", function () {
                debugHelper(key, "Wavesurfer finished");

                // reset once the song ends on its own
                self.approachingEnd = false;
                self.empty(self.players[key]);

                // TODO what did this achieve?
                if (self.players[key] !== self.currentPlayer) {
                    return;
                }

                self.next();
            });

            this.players[key].wavesurfer.on("ready", function () {
                debugHelper("Wavesurfer ready");

                self.setWaveColors();
            });

            this.players[key].wavesurfer.on(
                "audioprocess",
                function (currentTime) {
                    // debugHelper("Wavesurfer audioprocess", currentTime);

                    if (self.approachingEnd) {
                        return;
                    }

                    let duration =
                        self.currentPlayer.duration ||
                        self.currentPlayer.wavesurfer.getDuration();

                    let thresholdDuration = self.crossfadeEnabled
                        ? self.crossfadeDuration
                        : 0.25;

                    if (
                        (self.crossfadeEnabled || self.gaplessEnabled) &&
                        duration > 0 &&
                        currentTime > duration - thresholdDuration &&
                        currentTime < duration - 0.1
                    ) {
                        debugHelper("approaching end of song");
                        self.approachingEnd = true;
                        self.next();
                    }

                    // fall through to changing next song at end
                    if (
                        duration > 0 &&
                        currentTime > 0 &&
                        currentTime === duration
                    ) {
                        debugHelper("falling through to next item");
                        self.next();
                    }
                },
            );

            // debug events
            // ["ready", "interaction", "redraw", "redrawcomplete"].forEach((e) =>
            //     this.players[key].wavesurfer.on(e, () => console.log(Date.now(), e)),
            // );
        });
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
        this.playerA.audioElement.src = null;
        this.playerB.audioElement.src = null;
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
