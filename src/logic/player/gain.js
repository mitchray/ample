import { CurrentMediaGainInfo } from "~/stores/state.js";
import { truncateDecimals } from "~/logic/helper.js";
import { debugHelper } from "~/logic/helper.js";

const TARGET_VOLUME_DEFAULT = -14;

/**
 * Calculate gain (R128 & ReplayGain) and update CurrentMediaGainInfo store.
 * @param {object|null} currentMedia - Current track item
 * @param {number} [targetVolume] - Target volume in dB (default -14)
 * @returns {number} finalGainAmount
 */
export function calculateGain(currentMedia, targetVolume = TARGET_VOLUME_DEFAULT) {
    let finalGainAmount = 1;

    CurrentMediaGainInfo.set({
        gainType: "None",
        gainFactor: 1,
        masteredVolume: 0,
    });

    if (!currentMedia) return finalGainAmount;

    const r128 = currentMedia.r128_track_gain;
    const rg = currentMedia.replaygain_track_gain;
    const r128_track_gain =
        r128 !== undefined && r128 !== null ? r128.toString() : null;
    const replaygain_track_gain =
        rg !== undefined && rg !== null ? rg.toString() : null;

    if (r128_track_gain !== null) {
        const referenceLevel = -23; // LUFS
        // EBU R128 stores gain in 256ths of dB (e.g. -230 = -0.9 dB)
        const gainDb = Number(r128_track_gain) / 256;
        const masteredVolume = referenceLevel - gainDb;
        const difference = targetVolume - masteredVolume;
        finalGainAmount = Math.pow(10, difference / 20);
        CurrentMediaGainInfo.set({
            gainType: "EBU R128",
            gainFactor: truncateDecimals(finalGainAmount),
            masteredVolume: truncateDecimals(masteredVolume),
        });
    } else if (replaygain_track_gain !== null) {
        const referenceLevel = -18; // ReplayGain 2.0
        const parsedGainLevel = parseFloat(replaygain_track_gain);
        const trackLoudness = referenceLevel - parsedGainLevel;
        const difference = targetVolume - trackLoudness;
        finalGainAmount = Math.pow(10, difference / 20);
        CurrentMediaGainInfo.set({
            gainType: "ReplayGain",
            gainFactor: truncateDecimals(finalGainAmount),
            masteredVolume: truncateDecimals(trackLoudness),
        });
    }

    return finalGainAmount;
}

/**
 * Set the master volume gain node on all players.
 * @param {Object} players - Map of playerId -> { filters }
 * @param {number} globalVolume - Master volume (0-1, logarithmic)
 */
export function setMasterVolume(players, globalVolume) {
    Object.keys(players).forEach((key) => {
        players[key].filters.masterVolume.gain.value = globalVolume;
    });
}

/**
 * Apply tag gain and compressor filter values to all players.
 * @param {Object} players - Map of playerId -> { filters }
 * @param {string} currentPlayerId - Which player is current (for tag gain)
 * @param {object} options
 * @param {number} options.tagGainValue - Gain value for current player's tagGain
 * @param {boolean} options.volumeNormalizationEnabled
 * @param {boolean} options.dynamicsCompressorEnabled
 * @param {object} [options.audioContext] - Optional audio context to resume (e.g. current player's)
 */
export function updateFilters(players, currentPlayerId, options) {
    const {
        tagGainValue,
        volumeNormalizationEnabled,
        dynamicsCompressorEnabled,
        audioContext,
    } = options;

    const currentPlayer = players[currentPlayerId];
    if (currentPlayer) {
        currentPlayer.filters.tagGain.gain.value =
            volumeNormalizationEnabled ? tagGainValue : 1;
    }

    Object.keys(players).forEach((key) => {
        const player = players[key];
        player.filters.compressor.threshold.value = dynamicsCompressorEnabled
            ? -30
            : 0;
    });

    debugHelper(currentPlayer?.filters, "Active filters");
    if (audioContext) audioContext.resume();
}
