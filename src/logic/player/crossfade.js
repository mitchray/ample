import { get } from "svelte/store";
import EnvelopePlugin from "wavesurfer.js/dist/plugins/envelope.js";
import { Settings } from "~/stores/settings.svelte.js";

/**
 * Crossfade plugin: attaches WaveSurfer Envelope on trackReady when crossfade is enabled.
 * @param {object} player - Player instance with on()
 */
export function installCrossfade(player) {
    player.on("trackReady", (payload) => {
        const { wavesurfer, duration, skipCrossfade } = payload;
        if (!wavesurfer) return;

        wavesurfer.envelopePlugin?.setPoints([]);
        wavesurfer.envelopePlugin?.destroy();
        wavesurfer.envelopePlugin = null;
        wavesurfer.setVolume(1.0);

        const settings = Settings.current;
        const crossfadeEnabled = settings.Crossfade?.mode === "crossfade";
        const crossfadeDuration = settings.Crossfade?.duration ?? 6;

        if (
            !crossfadeEnabled ||
            skipCrossfade ||
            !(crossfadeDuration * 2 < duration)
        ) {
            return;
        }

        const envelope = wavesurfer.registerPlugin(
            EnvelopePlugin.create({
                volume: 1.0,
                lineColor: "rgba(255, 0, 0, 0.5)",
                lineWidth: 4,
                dragPointSize: 12,
                dragLine: true,
                dragPointFill: "rgba(0, 255, 255, 0.8)",
                dragPointStroke: "rgba(0, 0, 0, 0.5)",
                points: [
                    { time: 0, volume: 0.0 },
                    { time: (crossfadeDuration / 2) * 0.66, volume: 0.3 },
                    { time: crossfadeDuration / 2, volume: 1.0 },
                    { time: duration - crossfadeDuration, volume: 1.0 },
                    {
                        time: duration - crossfadeDuration * 0.66,
                        volume: 0.3,
                    },
                    { time: duration - 0.1, volume: 0.0 },
                ],
            }),
        );

        wavesurfer.envelopePlugin = envelope;
    });
}
