import { get } from "svelte/store";
import { API } from "~/stores/state";
import { errorHandler } from "~/logic/helper.js";

/**
 * Search artists containing specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export async function searchArtists({ page = 0, limit = 50, query }) {
    return await get(API).advancedSearch({
        type: "artist",
        operator: "and",
        limit: limit,
        offset: limit * page,
        rules: [["title", 0, query]],
    });
}

/**
 * Get artist by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export async function getArtist(id) {
    let artist = await get(API).artist({ filter: id });

    let appearances = await get(API).artistAlbums({ filter: artist.id });
    artist.appearanceCount = appearances.length - artist.albumcount;

    return artist;
}

/**
 * Get artists that have no rating
 * @returns {Promise<*>}
 */
export function unratedArtists({ page = 0, limit = 50 }) {
    return get(API).advancedSearch({
        type: "artist",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [["myrating", 2, 0]],
    });
}

/**
 * Get newest artists
 * @returns {Promise<*>}
 */
export function newestArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "newest",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get recently played artists
 * @returns {Promise<*>}
 */
export function recentArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "recent",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get favorite artists
 * @returns {Promise<*>}
 */
export function favoriteArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "flagged",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get frequent artists
 * @returns {Promise<*>}
 */
export function frequentArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "frequent",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get top-rated artists
 * @returns {Promise<*>}
 */
export function topArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "highest",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get forgotten artists
 * @returns {Promise<*>}
 */
export function forgottenArtists({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "artist",
        filter: "forgotten",
        offset: page * limit,
        limit: limit,
    });
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export function randomArtists({ page = 0, limit = 50 }) {
    return get(API).advancedSearch({
        type: "artist",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [["title", 0, ""]],
    });
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export function randomAlbumArtists({ page = 0, limit = 50 }) {
    return get(API).advancedSearch({
        type: "artist",
        operator: "and",
        random: 1,
        offset: page * limit,
        limit: limit,
        rules: [["album_count", 4, 0]],
    });
}

/**
 * Get similar artists, falling back to artists of the same genre
 * @param {string} id
 * @returns {Promise<*>}
 */
export async function getSimilarArtistsWithGenreFallback(id) {
    let result = await get(API).getSimilar({
        type: "artist",
        filter: id,
        limit: 15,
    });

    if (result.error) {
        errorHandler(
            "getting similar artists with genre fallback (get similar)",
            result.error,
        );
        return [];
    }

    if (result.length === 0) {
        let artist = await get(API).artist({ filter: id });

        if (artist?.genre.length === 0) {
            return [];
        }

        const rows = [];

        artist.genre.forEach((genre) => {
            rows.push(["genre", 4, genre.name]);
        });

        result = await get(API).advancedSearch({
            type: "artist",
            random: 1,
            operator: "or",
            limit: 15,
            rules: rows,
        });

        if (result.error) {
            errorHandler(
                "getting similar artists with genre fallback (genres)",
                result.error,
            );
            return [];
        }
    }

    return result;
}
