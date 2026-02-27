import { tick } from "svelte";
import { get } from "svelte/store";
import { showQueueItemAtIndex, updateQueue } from "~/logic/ui.js";
import {
    debugHelper,
    prepareForQueue,
    shuffleArray,
} from "~/logic/helper";
import { Settings } from "~/stores/settings";
import {
    CurrentMedia,
    IsPlaying,
    JukeboxQueue,
    NowPlayingIndex,
    NowPlayingQueue,
    PlaybackSpeed,
    ShowVisualizer,
} from "~/stores/state.js";
import { MediaPlayer } from "~/stores/elements.js";
import * as queue from "./queue.js";
import * as cache from "./cache.js";
import * as gain from "./gain.js";
import { createCore } from "./core.js";
import { installCrossfade } from "./crossfade.js";
import { installVisualizer } from "./visualizer.js";
import { installMediaKeys } from "./mediaKeys.js";
import {
    installTrackChecks,
    notifyRatingMissing,
} from "./trackChecks.js";

const PRELOAD_AHEAD_COUNT = 5;

/**
 * Coordinator: composes core + queue + cache + gain + plugins, exposes full player API.
 */
class Player {
    constructor() {
        this._core = createCore(
            "#waveformA",
            "#waveformB",
            () => ({
                crossfadeEnabled: this.crossfadeEnabled,
                gaplessEnabled: this.gaplessEnabled,
                crossfadeDuration: this.crossfadeDuration,
                skipCrossfade: this._skipCrossfadeForCurrentTrack,
                approachingEnd: this.approachingEnd,
            }),
            () => this.setWaveColors(),
        );
        this.players = this._core.players;
        this.playerA = this._core.players.playerA;
        this.playerB = this._core.players.playerB;
        this._emitter = this._core.emitter;
        Object.defineProperty(this, "currentPlayer", {
            get() {
                return this._core.currentPlayer;
            },
        });
        Object.defineProperty(this, "currentPlayerID", {
            get() {
                return this._core.currentPlayerID;
            },
        });

        // volume
        this.targetVolume = parseInt(-14);
        this.masteredVolume = null;
        this.gainFactor = null;
        this.gainType = null;

        // other
        this.approachingEnd = false;
        this._skipCrossfadeForCurrentTrack = false;

        // initial AbortController
        this.abortController = new AbortController();

        Settings.subscribe((s) => {
            // PlayerVolume
            this.globalVolume = this.#logVolume(s.PlayerVolume); // volume here takes the linear 0-100 value and converts into a logarithmic float from 0.0 to 1.0
            gain.setMasterVolume(this.players, this.globalVolume);

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

            // When switching away from crossfade, immediately clean up any active
            // EnvelopePlugin and restore audio element volume to avoid silent playback
            if (!this.crossfadeEnabled && this.players) {
                Object.values(this.players).forEach((p) => {
                    p.wavesurfer.envelopePlugin?.setPoints([]);
                    p.wavesurfer.envelopePlugin?.destroy();
                    p.wavesurfer.envelopePlugin = null;
                    p.wavesurfer.setVolume(1.0);
                });
            }
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

        installCrossfade(this);
        this._visualizerPlugin = installVisualizer(this);
        installTrackChecks(this);
        this.#init();
    }

    /*
     PUBLIC METHODS
     */

    /**
     * Subscribe to player events (trackLoaded, trackReady, play, pause, timeUpdate, approachingEnd, finish, playerSwitch, start, stop).
     */
    on(event, fn) {
        this._emitter.on(event, fn);
    }

    /**
     * Unsubscribe from player events.
     */
    off(event, fn) {
        this._emitter.off(event, fn);
    }

    /**
     * Begin playing
     */
    async start({ forcePlay = false, skipCrossfade = false } = {}) {
        // Abort the previous loading request
        this.abortController.abort();

        // Create a new AbortController for the current request
        this.abortController = new AbortController();
        const abortSignal = this.abortController.signal;

        let self = this;

        debugHelper("start!");

        this._emitter.emit("start");

        let item = queue.getCurrentItem();

        if (forcePlay || queue.isEligibleToPlay(item)) {
            CurrentMedia.set(item);
        } else if (!queue.isEligibleToPlay(item)) {
            self.next();
            return;
        } else {
            debugHelper("No items could be found");
            this.#restartQueue();
            return;
        }

        this._skipCrossfadeForCurrentTrack =
            this.nowPlayingIndex === 0 || skipCrossfade;

        await this.#switchPlayers();

        // Pre-apply gain before any audio loads so the gain node is already at
        // the correct value when audio first flows through it
        const tagGainValue = gain.calculateGain(item, this.targetVolume);
        this.currentPlayer.filters.tagGain.gain.value =
            this.volumeNormalizationEnabled ? tagGainValue : 1;

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
                const url = this.currentMedia?.url;
                this._core.loadUrl(url);
            } else {
                let blob = await cache.getBlob(item, "stream");
                this._core.loadBlob(blob);
            }

            this.updateFilters();

            this._emitter.emit("trackLoaded", {
                item,
                playerId: this.currentPlayerID,
                wavesurfer: this.currentPlayer.wavesurfer,
            });

            this._core
                .play()
                .then(async () => {
                    this._emitter.emit("trackReady", {
                        item,
                        duration: this.currentPlayer.duration,
                        playerId: this.currentPlayerID,
                        wavesurfer: this.currentPlayer.wavesurfer,
                        skipCrossfade: this._skipCrossfadeForCurrentTrack,
                    });

                    // Crossfade plugin attaches envelope via trackReady; no inline envelope here

                    // start preloading up to PRELOAD_AHEAD_COUNT items ahead (rolling)
                    void cache.preloadAhead(PRELOAD_AHEAD_COUNT);

                    // TrackChecks plugin runs on trackLoaded
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
        this._emitter.emit("stop");
        IsPlaying.set(false);
        this.approachingEnd = false;
        this._core.setApproachingEnd(false);
        this._core.stop();
    }

    /**
     * Teardown: stop playback and destroy both WaveSurfer instances. Call from component onDestroy.
     */
    destroy() {
        this.stop();
        Object.keys(this.players).forEach((key) => {
            const ws = this.players[key].wavesurfer;
            if (ws) {
                ws.unAll?.();
                ws.destroy?.();
            }
        });
    }

    empty(player) {
        this._core.empty(player);
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
            this._core.pause();
            IsPlaying.set(false);
        } else {
            Object.keys(this.players).forEach((key) => {
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

        let viableItem = queue.findViableItem("previous");

        if (viableItem) {
            queue.setIndexToItem(viableItem);
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

        let viableItem = queue.findViableItem("next");

        // only increment if we have something to increment from,
        // otherwise first queue item would be skipped
        if (viableItem) {
            // Increment index and play next
            queue.setIndexToItem(viableItem);
        } else if (!queue.hasEligibleItems()) {
            // Avoid recursive loop edge case
            this.stop();
            return;
        } else {
            this.#restartQueue();
            return;
        }

        // if item has no rating by the end of play, notify
        notifyRatingMissing(this.currentMedia);

        this.start();
    }

    /**
     * Determine if there are any eligible items in the queue
     * @returns {boolean} True if there's at least one eligible item, false otherwise
     */
    hasEligibleItems() {
        return queue.hasEligibleItems();
    }

    /**
     * @param {'previous' | 'next'} direction
     */
    findViableItem(direction) {
        return queue.findViableItem(direction);
    }

    /**
     * Return up to count viable items ahead of current index (for preloading).
     * @param {number} count
     * @returns {Array}
     */
    findViableItemsAhead(count) {
        return queue.findViableItemsAhead(count);
    }

    isEligibleToPlay(item) {
        return queue.isEligibleToPlay(item);
    }

    setIndexToItem(media) {
        queue.setIndexToItem(media);
    }

    /**
     * Shuffle all existing items in queue
     */
    shuffle() {
        let tempArray = get(NowPlayingQueue);
        tempArray = shuffleArray(tempArray);
        this.clearAll();
        queue.setQueueItems(tempArray).then(() => {
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
        items = prepareForQueue(items);
        this.clearAll();
        queue.setQueueItems(items).then(() => {
            this.start();
        });
    }

    /**
     * Replace queue with selected items, shuffled
     * @param {object} items
     */
    shuffleNow(items) {
        items = prepareForQueue(items);
        items = shuffleArray(items);
        this.clearAll();
        queue.setQueueItems(items).then(() => {
            this.start();
        });
    }

    /**
     * Insert items after currently playing item
     * @param {object} items
     */
    playNext(items) {
        items = prepareForQueue(items);
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.splice(this.nowPlayingIndex + 1, 0, ...items);
        queue.setQueueItems(tempArray).then(() => {
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
        items = prepareForQueue(items);
        let tempArray = get(NowPlayingQueue);
        let queueLength = tempArray.length;
        tempArray.push(...items);
        queue.setQueueItems(tempArray).then(() => {
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
        items = prepareForQueue(items);
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

        this.start({ forcePlay: true, skipCrossfade: true });
    }

    getDuration() {
        return this._core.getDuration();
    }

    getCurrentTime() {
        return this._core.getCurrentTime();
    }

    goForward(seconds) {
        this._core.skip(seconds);
    }

    goBackward(seconds) {
        this._core.skip(-seconds);
    }

    seekTo(percentage) {
        this._core.seekTo(percentage);
    }

    setMuted(bool) {
        this._core.setMuted(bool);
    }

    /**
     * Clear the queue
     */
    clearQueue() {
        // clear all tracks EXCEPT currently playing, unless it is the only item in queue
        if (this.nowPlayingQueue.length > 1) {
            queue.clearAllExceptCurrent();
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
        queue.setQueueItems([]);
    }

    updateFilters() {
        const tagGainValue = gain.calculateGain(
            this.currentMedia,
            this.targetVolume,
        );
        gain.updateFilters(this.players, this.currentPlayerID, {
            tagGainValue: this.volumeNormalizationEnabled ? tagGainValue : 1,
            volumeNormalizationEnabled: this.volumeNormalizationEnabled,
            dynamicsCompressorEnabled: this.dynamicsCompressorEnabled,
            audioContext: this.currentPlayer.audioContext,
        });
    }

    setMasterVolume(vol) {
        gain.setMasterVolume(this.players, vol);
    }

    setPlaybackRate(val) {
        this._core.setPlaybackRate(val);
    }

    loadVisualizerPreset(presetData, blendTime) {
        this._visualizerPlugin?.loadPreset(presetData, blendTime);
    }

    /** Stable API for UI: avoid reaching into internal playerA/playerB/filters */
    getCurrentPlayerId() {
        return this.currentPlayerID;
    }

    getCurrentWavesurfer() {
        return this.currentPlayer?.wavesurfer ?? null;
    }

    getMasterCompressor() {
        return this.currentPlayer?.filters?.compressor ?? null;
    }

    /** For lyrics: attach timeupdate to a specific player by id */
    getWavesurferForPlayer(playerId) {
        return this.players[playerId]?.wavesurfer ?? null;
    }

    /*
     #PRIVATE METHODS
     */

    async #switchPlayers() {
        this._core.switchPlayers();
        MediaPlayer.set(this);
    }

    /**
     * More setup which doesn't belong in constructor
     */
    #init() {
        this._core.setOnRequestNext(() => this.next());
        this._core.init(this.globalVolume);
        this._emitter.on("play", () => this.setPlaybackRate(get(PlaybackSpeed)));
        this._emitter.on("approachingEnd", () => {
            this.approachingEnd = true;
        });
        this._emitter.on("finish", () => {
            this.approachingEnd = false;
        });
        installMediaKeys(this);
    }

    #logVolume(val) {
        return Math.pow(val / 100, 2);
    }

    /**
     * Restart the queue
     */
    #restartQueue() {
        NowPlayingIndex.set(0);

        // unload any currently loaded items (avoid src = null → browser requests ".../null")
        for (const key of ["playerA", "playerB"]) {
            const el = this[key].audioElement;
            el.src = "";
            el.removeAttribute("src");
            el.load();
        }
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
    async #setJukeboxQueueItems(arr) {
        JukeboxQueue.set(arr);
    }
}

export default Player;
