import { get } from "svelte/store";
import { API } from "~/stores/state";
import { groupBy } from "lodash-es";
import { userPreference } from "~/logic/preferences.js";

/**
 * Sort albums from earliest to most recent date
 * @param {array} albums
 * @returns {*}
 */
export async function sortAlbumsByDate(albums) {
    return albums.sort(function (obj1, obj2) {
        return obj1.year - obj2.year;
    });
}

/**
 * Get albums starting with specified character
 * @param {number} page
 * @param {number} limit
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export function getAlbumsStartingWithChar({
    page = 0,
    limit = 50,
    filterChar,
}) {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 0,
        offset: page * limit,
        limit: limit,
        rules: [["title", 8, "^" + filterChar]],
    });
}

/**
 * Search albums containing specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export function searchAlbums({ page = 0, limit = 50, query }) {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [["title", 0, query]],
    });
}

/**
 * Get albums by year range
 * @param page
 * @param limit
 * @param {number} from
 * @param {number} to
 * @returns {Promise<*>}
 */
export function getAlbumsByYear({ page = 0, limit = 50, from, to }) {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        offset: page * limit,
        limit: limit,
        rules: [
            ["year", 0, from],
            ["year", 1, to],
        ],
    });
}

/**
 * Get albums that have no rating
 * @returns {Promise<*>}
 */
export function unratedAlbums({ page = 0, limit = 50 }) {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [["myrating", 2, 0]],
    });
}

/**
 * Get newly added albums
 * @returns {Promise<*>}
 */
export function newestAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "newest",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get recently played albums
 * @returns {Promise<*>}
 */
export function recentAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "recent",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get favorite albums
 * @returns {Promise<*>}
 */
export function favoriteAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "flagged",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get frequent albums
 * @returns {Promise<*>}
 */
export function frequentAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "frequent",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get top-rated albums
 * @returns {Promise<*>}
 */
export function topAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "highest",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get forgotten albums
 * @returns {Promise<*>}
 */
export function forgottenAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "forgotten",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get random albums
 * @returns {Promise<*>}
 */
export function randomAlbums({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "album",
        filter: "random",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Group albums by release type
 * @param {array} albums
 * @returns {Map<any, any>}
 */
export async function groupAlbumsByReleaseType(albums) {
    let releaseTypes = new Map();

    let preferenceAlbumReleaseType = userPreference("album_release_type");
    let preferenceAlbumReleaseTypeSort = userPreference(
        "album_release_type_sort",
    );

    let preferenceReleaseTypes = get(preferenceAlbumReleaseTypeSort).split(",");

    if (get(preferenceAlbumReleaseType) === "1") {
        // Create base types in specified order from server setting
        for (let i = 0; i < preferenceReleaseTypes.length; i++) {
            let typeText = preferenceReleaseTypes[i].toLowerCase();

            // for releases by artist
            if (!releaseTypes.get(typeText)) {
                releaseTypes.set(typeText, []);
            }
        }

        // Add a catchall for missing/others
        releaseTypes.set("missing release type", []);

        // Assign to existing types or create new ones as needed
        for (let i = 0; i < albums.length; i++) {
            let type = albums[i].type;

            // standardise else comparison will fail
            if (type) {
                type = type.toLowerCase();
            }

            // create new base type if needed
            if (!releaseTypes.get(type)) {
                releaseTypes.set(type, []);
            }

            switch (type) {
                case null:
                    releaseTypes.get("missing release type").push(albums[i]);
                    break;
                default:
                    releaseTypes.get(type).push(albums[i]);
                    break;
            }
        }
    } else {
        // just return the albums
        releaseTypes.set("ungrouped", albums);
    }

    return releaseTypes;
}

/**
 * Get all the tracks from an album, grouped by their disks
 * @param {number} albumID
 */
export async function getAlbumDisks(albumID) {
    let tracks = await get(API).albumSongs({ filter: albumID });

    // group into disks
    let grouped = groupBy(tracks, "disk");

    // convert to array and append disksubtitle from first track if present
    return Object.entries(grouped).map(([key, value]) => {
        let diskTitle = key;
        let diskSubtitle = value[0]?.disksubtitle?.trim();

        if (diskSubtitle?.length) {
            diskTitle += `: ${diskSubtitle}`;
        }

        return [diskTitle, value];
    });
}
