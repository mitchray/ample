import { get } from "svelte/store";
import WaveSurfer from "wavesurfer.js";
import { debugHelper } from "~/logic/helper.js";
import { IsPlaying, PlaybackSpeed } from "~/stores/state.js";

/**
 * Minimal event emitter for player lifecycle events.
 */
function createEventEmitter() {
    const listeners = {};
    return {
        on(event, fn) {
            (listeners[event] = listeners[event] || []).push(fn);
        },
        off(event, fn) {
            const L = listeners[event];
            if (L) listeners[event] = L.filter((f) => f !== fn);
        },
        emit(event, payload) {
            (listeners[event] || []).slice().forEach((fn) => fn(payload));
        },
    };
}

const wavesurferCommonOptions = {
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
    const audioElement = new Audio();
    audioElement.crossOrigin = "anonymous";
    audioElement.preload = "auto";

    const audioContext = new AudioContext();
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = 0;
    compressor.knee.value = 10.0;
    compressor.ratio.value = 2.0;
    compressor.attack.value = 0.1;
    compressor.release.value = 0.3;

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
 * Core media player: dual wavesurfer, filter chain, events. No queue, cache, gain, or store logic.
 * @param {string} containerA
 * @param {string} containerB
 * @param {() => object} getCrossfadeState - returns { crossfadeEnabled, gaplessEnabled, crossfadeDuration, skipCrossfade, approachingEnd }
 * @param {() => void} setWaveColors - called on ready
 */
export function createCore(containerA, containerB, getCrossfadeState, setWaveColors) {
    const emitter = createEventEmitter();
    const playerA = createWavesurferInstance(containerA);
    const playerB = createWavesurferInstance(containerB);
    const players = { playerA, playerB };
    let currentPlayerID = "playerB";
    let currentPlayer = playerB;
    let onRequestNext = () => {};
    let _approachingEnd = false;

    function switchPlayers() {
        currentPlayerID = currentPlayerID === "playerA" ? "playerB" : "playerA";
        currentPlayer = players[currentPlayerID];
        emitter.emit("playerSwitch", { currentPlayerId: currentPlayerID });
        debugHelper("PLAYERS SWITCHED");
    }

    function setupFilters() {
        Object.keys(players).forEach((key) => {
            const player = players[key];
            Object.values(player.filters)
                .reduce((prev, curr) => {
                    prev.connect(curr);
                    return curr;
                }, player.mediaNode)
                .connect(player.audioContext.destination);
        });
    }

    function initWavesurferEvents() {
        Object.keys(players).forEach((key) => {
            const p = players[key];
            p.wavesurfer.on("error", (e) => {
                debugHelper(e, "Wavesurfer play error");
                IsPlaying.set(false);
                onRequestNext();
            });
            p.wavesurfer.on("play", () => {
                debugHelper("Wavesurfer playing");
                IsPlaying.set(true);
                emitter.emit("play");
            });
            p.wavesurfer.on("pause", () => {
                debugHelper("Wavesurfer paused");
                emitter.emit("pause");
            });
            p.wavesurfer.on("finish", () => {
                debugHelper(key, "Wavesurfer finished");
                emitter.emit("finish", { playerKey: key });
                _approachingEnd = false;
                empty(p);
                if (p === currentPlayer) onRequestNext();
            });
            p.wavesurfer.on("ready", () => {
                debugHelper("Wavesurfer ready");
                setWaveColors();
            });
            p.wavesurfer.on("audioprocess", (currentTime) => {
                if (p !== currentPlayer) return;
                if (_approachingEnd) return;
                const state = getCrossfadeState();
                const duration =
                    currentPlayer.duration ?? currentPlayer.wavesurfer.getDuration();
                const thresholdDuration =
                    state.crossfadeEnabled && !state.skipCrossfade
                        ? state.crossfadeDuration
                        : 0.25;

                if (
                    (state.crossfadeEnabled && !state.skipCrossfade) ||
                    state.gaplessEnabled
                ) {
                    if (
                        duration > 0 &&
                        currentTime > duration - thresholdDuration &&
                        currentTime < duration - 0.1
                    ) {
                        debugHelper("approaching end of song");
                        _approachingEnd = true;
                        emitter.emit("approachingEnd", { currentTime, duration });
                        onRequestNext();
                    }
                }
                if (
                    duration > 0 &&
                    currentTime > 0 &&
                    currentTime === duration
                ) {
                    debugHelper("falling through to next item");
                    _approachingEnd = true;
                    emitter.emit("approachingEnd", { currentTime, duration });
                    onRequestNext();
                }
                emitter.emit("timeUpdate", { currentTime, duration });
            });
        });
    }

    const silenceUrl =
        typeof import.meta !== "undefined" && import.meta.env?.BASE_URL
            ? `${import.meta.env.BASE_URL}audio/silence.mp3`
            : "./audio/silence.mp3";

    function empty(player) {
        player.wavesurfer.pause();
        player.wavesurfer
            .load(silenceUrl, [[0]], 0.001)
            .then(() => player.wavesurfer.stop());
    }

    function init(globalVolume) {
        Object.keys(players).forEach((key) => {
            players[key].filters.masterVolume.gain.value = globalVolume;
        });
        setupFilters();
        initWavesurferEvents();
    }

    return {
        get emitter() {
            return emitter;
        },
        get players() {
            return players;
        },
        get currentPlayer() {
            return currentPlayer;
        },
        get currentPlayerID() {
            return currentPlayerID;
        },
        setApproachingEnd(v) {
            _approachingEnd = v;
        },
        setOnRequestNext(fn) {
            onRequestNext = fn;
        },
        switchPlayers,
        empty,
        init,
        loadBlob(blob) {
            currentPlayer.wavesurfer.loadBlob(blob);
        },
        loadUrl(url) {
            if (url && typeof url === "string" && url.length > 0) {
                currentPlayer.audioElement.src = url;
            } else {
                currentPlayer.audioElement.src = "";
                currentPlayer.audioElement.removeAttribute("src");
                currentPlayer.audioElement.load();
            }
            currentPlayer.wavesurfer.setMediaElement(currentPlayer.audioElement);
        },
        play() {
            return currentPlayer.audioContext.resume().then(() =>
                currentPlayer.wavesurfer.play().then(() => {
                    currentPlayer.duration = currentPlayer.wavesurfer.getDuration();
                }),
            );
        },
        pause() {
            Object.keys(players).forEach((k) => players[k].wavesurfer.pause());
        },
        stop() {
            empty(players.playerA);
            empty(players.playerB);
        },
        getCurrentTime() {
            const t = currentPlayer.wavesurfer.getCurrentTime();
            return Number.isFinite(t) ? t : 0;
        },
        getDuration() {
            const d =
                currentPlayer.duration ?? currentPlayer.wavesurfer?.getDuration();
            return Number.isFinite(d) ? d : 0;
        },
        seekTo(percentage) {
            currentPlayer.wavesurfer.seekTo(percentage);
        },
        skip(seconds) {
            currentPlayer.wavesurfer?.skip(seconds);
        },
        setPlaybackRate(val) {
            Object.keys(players).forEach((k) =>
                players[k].wavesurfer.setPlaybackRate(val),
            );
        },
        setMuted(bool) {
            Object.keys(players).forEach((k) =>
                players[k].wavesurfer.setMuted(bool),
            );
        },
    };
}
