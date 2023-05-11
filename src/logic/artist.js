import { get } from "svelte/store";
import { API } from "../stores/api";
import { MediaPlayer } from "../stores/player";
import { getAverageColor, setCustomHue } from "./color";
import { cleanArtURL } from "./helper";

/**
 * Search artists starting with specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchArtistsStartingWith = async ({page = 0, limit = 50, query}) => {
    return await get(API).advancedSearch({
        type: "artist",
        operator: "and",
        limit: limit,
        offset: limit * page,
        rules: [
            ['title', 2, query]
        ]
    })
}

/**
 * Search artists containing (but not starting with) specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchArtistsContaining = async ({page = 0, limit = 50, query}) => {
    return await get(API).advancedSearch({
        type: "artist",
        operator: "and",
        limit: limit,
        offset: limit * page,
        rules: [
            ['title', 8, "^(?!" + query + ").*" + query]
        ]
    })
}

/**
 * Get artist by ID
 * @param {number} id
 * @param {boolean} artAnalysis
 * @returns {Promise<*>}
 */
export const getArtist = async ({id = id, artAnalysis = false}) => {
    let artist = await get(API).artist({ filter: id });

    if (artAnalysis) {
        artist.averageColor = await getAverageColor(cleanArtURL(artist.art) + "&thumb=10");

        if (artist.averageColor) {
            await setCustomHue(artist.averageColor.value);

            let mp = get(MediaPlayer);
            await mp.setWaveColors();
        }
    }

    let appearances = await get(API).artistAlbums({ filter: artist.id });
    artist.appearanceCount = appearances.length - artist.albumcount;

    return artist;
}

/**
 * Get artists that have no rating
 * @returns {Promise<*>}
 */
export const unratedArtists = ({page = 0, limit = 50}) => {
    return get(API).advancedSearch({
        type: "artist",
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
 * Returns artists for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchArtists = ({query = "", page = 0, limit = 50, exact = false}) => {
    return get(API).artists({
        filter: query,
        exact: (exact) ? 1 : 0,
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get newest artists
 * @returns {Promise<*>}
 */
export const newestArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "newest",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get recently played artists
 * @returns {Promise<*>}
 */
export const recentArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "recent",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get favorite artists
 * @returns {Promise<*>}
 */
export const favoriteArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "flagged",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get frequent artists
 * @returns {Promise<*>}
 */
export const frequentArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "frequent",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get top-rated artists
 * @returns {Promise<*>}
 */
export const topArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "highest",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get forgotten artists
 * @returns {Promise<*>}
 */
export const forgottenArtists = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "artist",
        filter: "forgotten",
        offset: page * limit,
        limit: limit
    })
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export const randomArtists = ({page = 0, limit = 50}) => {
    return get(API).advancedSearch({
        type: "artist",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['title', 0, ""]
        ]
    })
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export const randomAlbumArtists = ({page = 0, limit = 50}) => {
    return get(API).advancedSearch({
        type: "artist",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [
            ['album_count', 4, 0]
        ]
    })
}