import { get } from "svelte/store";
import { API } from "../stores/api";
import { MediaPlayer } from '../stores/player';
import { debugHelper } from "./helper";
import { setCustomHue, getAverageColor } from "./color";
import { getSongsFromAlbum } from './song';

/**
 * Sort albums from earliest to most recent date
 * @param {array} albums
 * @returns {*}
 */
export const sortAlbumsByDate = async (albums) => {
    return albums.sort(function(obj1, obj2) { return obj1.year - obj2.year; })
}

/**
 * Get albums starting with specified character
 * @param {number} page
 * @param {number} limit
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getAlbumsStartingWithChar = ({page = 0, limit = 50, filterChar}) => {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['title', 8, '^' + filterChar]
        ]
    });
}

/**
 * Search albums starting with specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchAlbumsStartingWith = ({page = 0, limit = 50, query}) => {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['title', 2, query]
        ]
    });
}

/**
 * Search albums containing (but not starting with) specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchAlbumsContaining = ({page = 0, limit = 50, query}) => {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['title', 8, "^(?!" + query + ").*" + query]
        ]
    });
}

/**
 * Get album by ID
 * @param {number} id
 * @param {boolean} withTracks
 * @param {boolean} artAnalysis
 * @returns {Promise<*>}
 */
export const getAlbum = async ({id, withTracks = false, artAnalysis = false}) => {
    let album = await get(API).album({ filter: id });

    if (withTracks) {
        album.ampleSongs = await getSongsFromAlbum({id: id, groupByDisc: true});
        debugHelper(album.ampleSongs, "getAlbum - getSongsFromAlbum");
    }

    if (artAnalysis) {
        album.averageColor = await getAverageColor(album.art + "&thumb=10");

        if (album.averageColor) {
            await setCustomHue(album.averageColor.value);

            let mp = get(MediaPlayer);
            await mp.setWaveColors();
        }
    }

    return album;
}

/**
 * Get albums by year range
 * @param page
 * @param limit
 * @param {number} from
 * @param {number} to
 * @returns {Promise<*>}
 */
export const getAlbumsByYear = ({page = 0, limit = 50, from, to}) => {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        offset: page * limit,
        limit: limit,
        rules: [
            ['year', 0, from],
            ['year', 1, to]
        ]
    });
}

/**
 * Get albums that have no rating
 * @returns {Promise<*>}
 */
export const unratedAlbums = ({query = "", page = 0, limit = 50}) => {
    return get(API).advancedSearch({
        type: "album",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['myrating', 2, 0]
        ]
    });
}

/**
 * Returns albums for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchAlbums = ({query = "", page = 0, limit = 50, exact = false}) => {
    return get(API).albums({
        filter: query,
        exact: (exact) ? 1 : 0,
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get newly added albums
 * @returns {Promise<*>}
 */
export const newestAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "newest",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get recently played albums
 * @returns {Promise<*>}
 */
export const recentAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "recent",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get favorite albums
 * @returns {Promise<*>}
 */
export const favoriteAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "flagged",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get frequent albums
 * @returns {Promise<*>}
 */
export const frequentAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "frequent",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get top-rated albums
 * @returns {Promise<*>}
 */
export const topAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "highest",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get forgotten albums
 * @returns {Promise<*>}
 */
export const forgottenAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "forgotten",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get random albums
 * @returns {Promise<*>}
 */
export const randomAlbums = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "album",
        filter: "random",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Group albums by release type
 * @param {array} albums
 * @param artistID
 * @returns {Map<any, any>}
 */
export const groupAlbumsByReleaseType = async (albums, artistID) => {
    let releaseTypes = new Map();
    let preferenceAlbumReleaseType = await get(API).userPreference({ filter: 'album_release_type'} );
    let preferenceAlbumReleaseTypeSort = await get(API).userPreference({ filter: 'album_release_type_sort'} );
    let preferenceReleaseTypes = preferenceAlbumReleaseTypeSort.value.split(',');
    let appearanceText = " (appearance)";

    if (preferenceAlbumReleaseType.value === '1') {
        // Create base types in specified order from server setting
        for (let i = 0; i < preferenceReleaseTypes.length; i++) {
            let typeText = preferenceReleaseTypes[i].toLowerCase();

            // for releases by artist
            if (!releaseTypes.get(typeText)) {
                releaseTypes.set(typeText, []);
            }

            // for appearances on releases from other artists
            if (!releaseTypes.get(typeText + appearanceText)) {
                releaseTypes.set(typeText + appearanceText, []);
            }
        }

        // Add a catchall for missing/others
        releaseTypes.set("unknown release type", []);

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

            // create new appearance type if needed
            if (!releaseTypes.get(type + appearanceText)) {
                releaseTypes.set(type + appearanceText, []);
            }

            switch (type) {
                case null:
                    releaseTypes.get("unknown release type").push(albums[i]);
                    break;
                default:
                    if (albums[i].artist.id === artistID) {
                        releaseTypes.get(type).push(albums[i]);
                    } else {
                        releaseTypes.get(type + appearanceText).push(albums[i]);
                    }
                    break;
            }
        }
    } else {
        // just return the albums
        releaseTypes.set('ungrouped', albums);
    }

    return releaseTypes;
}