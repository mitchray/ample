import { CurrentMediaGainInfo } from "~/stores/state.js";
import { truncateDecimals, debugHelper } from "~/logic/helper.js";
import { findViableItem } from "~/logic/player/queue.js";

const TARGET_VOLUME_DEFAULT = -14;

/**
 * Calculate track gain (R128 & ReplayGain) and update CurrentMediaGainInfo store.
 * @param {object|null} currentMedia - Current track item
 * @param {number} [targetVolume] - Target volume in dB (default -14)
 * @returns {number} finalGainAmount
 */
export function calculateGain(currentMedia, targetVolume = TARGET_VOLUME_DEFAULT) {
    return _calculateGainFromTags(
        currentMedia,
        targetVolume,
        currentMedia?.r128_track_gain,
        currentMedia?.replaygain_track_gain,
        "Track",
    );
}

/**
 * Calculate album gain (R128 & ReplayGain) and update CurrentMediaGainInfo store.
 * Falls back to track gain if no album gain tags are present.
 * @param {object|null} currentMedia - Current track item
 * @param {number} [targetVolume] - Target volume in dB (default -14)
 * @returns {number} finalGainAmount
 */
export function calculateAlbumGain(currentMedia, targetVolume = TARGET_VOLUME_DEFAULT) {
    const r128AlbumRaw = currentMedia?.r128_album_gain;
    const rgAlbumRaw = currentMedia?.replaygain_album_gain;
    const hasAlbumTags =
        (r128AlbumRaw !== undefined && r128AlbumRaw !== null) ||
        (rgAlbumRaw !== undefined && rgAlbumRaw !== null);

    if (!hasAlbumTags) {
        return _calculateGainFromTags(
            currentMedia,
            targetVolume,
            currentMedia?.r128_track_gain,
            currentMedia?.replaygain_track_gain,
            "Track",
        );
    }

    return _calculateGainFromTags(
        currentMedia,
        targetVolume,
        r128AlbumRaw,
        rgAlbumRaw,
        "Album",
    );
}

/**
 * Resolve gain based on the active GainMode setting.
 * "off"   → gain factor 1, no normalization
 * "track" → track gain tags
 * "album" → album gain tags (falls back to track if absent)
 * "smart" → album gain when the previous or next viable queue item shares the
 *            same album as the current track, otherwise track gain
 * @param {object|null} currentMedia
 * @param {string} gainMode - "off" | "track" | "album" | "smart"
 * @param {number} [targetVolume]
 * @returns {number} finalGainAmount
 */
export function resolveGainMode(
    currentMedia,
    gainMode,
    targetVolume = TARGET_VOLUME_DEFAULT,
) {
    if (gainMode === "off") {
        CurrentMediaGainInfo.set({ gainType: "None", gainFactor: 1, masteredVolume: 0 });
        return 1;
    }

    if (gainMode === "album") {
        return calculateAlbumGain(currentMedia, targetVolume);
    }

    if (gainMode === "smart") {
        const albumId = currentMedia?.album?.id;
        const prevItem = findViableItem("previous");
        const nextItem = findViableItem("next");
        const useAlbum =
            albumId != null &&
            (prevItem?.album?.id === albumId || nextItem?.album?.id === albumId);
        return useAlbum
            ? calculateAlbumGain(currentMedia, targetVolume)
            : calculateGain(currentMedia, targetVolume);
    }

    // "track" (default)
    return calculateGain(currentMedia, targetVolume);
}

/**
 * Internal helper: compute gain from a pair of raw tag values and update the store.
 * @param {object|null} currentMedia
 * @param {number} targetVolume
 * @param {number|string|null|undefined} r128Raw - raw r128 tag value
 * @param {number|string|null|undefined} rgRaw - raw replaygain tag value
 * @param {"Track"|"Album"} scope - label suffix for gainType display
 * @returns {number}
 */
function _calculateGainFromTags(currentMedia, targetVolume, r128Raw, rgRaw, scope) {
    let finalGainAmount = 1;

    CurrentMediaGainInfo.set({
        gainType: "None",
        gainFactor: 1,
        masteredVolume: 0,
    });

    if (!currentMedia) return finalGainAmount;

    const r128Tag = r128Raw !== undefined && r128Raw !== null ? r128Raw.toString() : null;
    const rgTag = rgRaw !== undefined && rgRaw !== null ? rgRaw.toString() : null;

    if (r128Tag !== null) {
        const referenceLevel = -23; // LUFS
        // EBU R128 stores gain in 256ths of dB (e.g. -230 = -0.9 dB)
        const gainDb = Number(r128Tag) / 256;
        const masteredVolume = referenceLevel - gainDb;
        const difference = targetVolume - masteredVolume;
        finalGainAmount = Math.pow(10, difference / 20);
        CurrentMediaGainInfo.set({
            gainType: `EBU R128 ${scope}`,
            gainFactor: truncateDecimals(finalGainAmount),
            masteredVolume: truncateDecimals(masteredVolume),
        });
    } else if (rgTag !== null) {
        const referenceLevel = -18; // ReplayGain 2.0
        const parsedGainLevel = parseFloat(rgTag);
        const trackLoudness = referenceLevel - parsedGainLevel;
        const difference = targetVolume - trackLoudness;
        finalGainAmount = Math.pow(10, difference / 20);
        CurrentMediaGainInfo.set({
            gainType: `ReplayGain ${scope}`,
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
