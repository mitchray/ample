import { get } from "svelte/store";
import butterchurn from "butterchurn";
import { ShowVisualizer } from "~/stores/state.js";
import { getCuratedVisualizerPresets } from "~/logic/visualizer.js";
import { errorHandler } from "~/logic/helper.js";

/** Default preset key for initial visualizer load */
const DEFAULT_VISUALIZER_PRESET = "$$$ Royal - Mashup (197)";

/**
 * Visualizer plugin: butterchurn visualizer driven by ShowVisualizer store and trackLoaded/play state.
 * @param {object} player - Player instance with on(), isPlaying, currentPlayer
 * @returns {{ loadPreset: (presetData: object, blendTime: number) => void }}
 */
export function installVisualizer(player) {
    let visualizer = null;
    let audioContextProxy = null;
    let renderLoopActive = false;

    function connectAudio(mediaElement) {
        if (!audioContextProxy || !mediaElement) return;
        const proxyMediaNode =
            audioContextProxy.createMediaElementSource(mediaElement);
        visualizer?.connectAudio(proxyMediaNode);
    }

    function startRenderer() {
        if (!renderLoopActive) return;
        requestAnimationFrame(() => {
            if (!renderLoopActive) return;
            if (player.isPlaying && visualizer) {
                visualizer.render();
            }
            startRenderer();
        });
    }

    function init() {
        if (visualizer) return;
        const presets = getCuratedVisualizerPresets();
        const preset = presets[DEFAULT_VISUALIZER_PRESET];
        try {
            audioContextProxy = new AudioContext();
            visualizer = butterchurn.createVisualizer(
                audioContextProxy,
                document.querySelector("#visualizer"),
                {
                    width: 1600,
                    height: 900,
                    pixelRatio: window.devicePixelRatio || 1,
                    textureRatio: 1,
                },
            );
            visualizer?.loadPreset(preset, 5);
            renderLoopActive = true;
            startRenderer();
            const mediaEl = player.currentPlayer?.wavesurfer?.getMediaElement?.();
            if (mediaEl) connectAudio(mediaEl);
        } catch (e) {
            errorHandler("initializing visualizer", e);
        }
    }

    function destroy() {
        renderLoopActive = false;
        if (visualizer) {
            try {
                visualizer.disconnectAudio?.();
            } catch (_) {}
            visualizer = null;
        }
    }

    player.on("trackLoaded", (payload) => {
        const mediaElement = payload.wavesurfer?.getMediaElement?.();
        if (mediaElement) connectAudio(mediaElement);
    });

    if (get(ShowVisualizer)) init();

    return {
        setShow(show) {
            if (show) init();
            else destroy();
        },
        loadPreset(presetData, blendTime) {
            visualizer?.loadPreset(presetData, blendTime);
        },
    };
}
