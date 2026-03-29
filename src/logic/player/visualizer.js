import butterchurn from "butterchurn";
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
    let renderFrameScheduled = false;
    let connectedNode = null;
    let showing = false;

    /** Connect the visualizer to an audio node (e.g. player's mediaNode). Use the player's graph; do not create a second MediaElementSource. */
    function connectAudio(audioNode) {
        if (!audioNode || !visualizer) return;
        if (connectedNode) {
            try {
                visualizer.disconnectAudio(connectedNode);
            } catch (_) {}
        }
        connectedNode = audioNode;
        visualizer.connectAudio(audioNode);
    }

    function startRenderer() {
        if (!renderLoopActive) return;
        if (renderFrameScheduled) return;
        renderFrameScheduled = true;
        requestAnimationFrame(() => {
            renderFrameScheduled = false;
            if (!renderLoopActive) return;
            if (visualizer) visualizer.render();
            startRenderer();
        });
    }

    function init() {
        if (visualizer) return;
        if (!showing) return;
        const canvas = document.querySelector("#visualizer");
        if (!canvas) {
            requestAnimationFrame(init);
            return;
        }
        const presets = getCuratedVisualizerPresets();
        const preset = presets[DEFAULT_VISUALIZER_PRESET];
        try {
            const current = player.currentPlayer;
            if (!current?.audioContext) return;
            audioContextProxy = current.audioContext;
            visualizer = butterchurn.createVisualizer(
                audioContextProxy,
                canvas,
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
            if (current.mediaNode) connectAudio(current.mediaNode);
        } catch (e) {
            errorHandler("initializing visualizer", e);
        }
    }

    function teardown() {
        renderLoopActive = false;
        renderFrameScheduled = false;
        if (visualizer && connectedNode) {
            try {
                visualizer.disconnectAudio(connectedNode);
            } catch (_) {}
        }
        connectedNode = null;
        visualizer = null;
    }

    function destroy() {
        teardown();
    }

    player.on("trackLoaded", () => {
        const current = player.currentPlayer;
        if (!current?.mediaNode) return;
        if (current.audioContext !== audioContextProxy) return;
        connectAudio(current.mediaNode);
    });

    return {
        setShow(show) {
            showing = !!show;
            if (show) init();
            else destroy();
        },
        loadPreset(presetData, blendTime) {
            visualizer?.loadPreset(presetData, blendTime);
        },
    };
}
