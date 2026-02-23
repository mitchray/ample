import { getSongVersions } from "~/logic/song";
import {
    addAlternateVersionsNotification,
    addGainTagsMissingNotification,
    addRatingMissingNotification,
} from "~/logic/notification";

/**
 * TrackChecks plugin: on trackLoaded, run gain-tags check, song-versions check, rating notification.
 * @param {object} player - Player instance with on()
 */
export function installTrackChecks(player) {
    player.on("trackLoaded", (payload) => {
        const item = payload.item;
        if (!item) return;

        if (
            item.object_type === "song" &&
            item.r128_track_gain === null &&
            item.replaygain_track_gain === null
        ) {
            addGainTagsMissingNotification(item);
        }

        if (item.object_type === "song" && item.artist?.id) {
            getSongVersions(item.title, item.artist.name).then((result) => {
                if (!result.error && result.length > 1) {
                    item.versionsCount = result.length - 1;
                    addAlternateVersionsNotification(item);
                }
            });
        }
    });
}

/**
 * Call when an item has finished playing and had no rating (for notification).
 * @param {object} item
 */
export function notifyRatingMissing(item) {
    addRatingMissingNotification(item);
}
