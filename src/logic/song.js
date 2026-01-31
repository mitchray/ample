import { get } from "svelte/store";
import { API } from "~/stores/state";
import { debugHelper } from "~/logic/helper";
import { getArtist, getSimilarArtistsWithGenreFallback } from "~/logic/artist";

/**
 * Get songs from artist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export async function getSongsFromArtist(id) {
    let songs = await get(API).artistSongs({ filter: id, sort: "track,ASC" });
    songs = sortSongsByYear(songs.song);

    return songs;
}

/**
 * Gets songs from different types of playlist
 * @param {string} id
 * @param {('playlist'|'smartlist'|'artist_mix')} type
 */
export async function getSongsFromPlaylist({ id, type }) {
    let results = [];

    switch (type) {
        case "playlist":
        case "smartlist":
            results = await get(API).playlistSongs({ filter: id });
            break;
        case "artist_mix":
            let artists = await getSimilarArtistsWithGenreFallback(id);
            let baseArtist = await getArtist(id);

            if (baseArtist) {
                artists.push(baseArtist);
            }

            results = await getSongsFromArtists(artists);
            break;
        default:
            break;
    }

    return results;
}

/**
 * Get songs from playlists
 * @param {array} playlists
 * @returns {Promise<*>}
 */
export async function getSongsFromPlaylists(playlists) {
    let allResults = [];
    let promises = [];

    for (let i = 0; i < playlists.length; i++) {
        promises[i] = await get(API).playlistSongs({ filter: playlists[i].id });
    }

    allResults = await Promise.all([...promises]);

    allResults = allResults.map((group) => group.song);

    return allResults.flat();
}

/**
 * Search songs containing specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export function searchSongs({ page = 0, limit = 50, query }) {
    return get(API).advancedSearch({
        type: "song",
        operator: "and",
        limit: limit,
        offset: page * limit,
        rules: [["title", 0, query]],
    });
}

/**
 * Find songs with same title from artist
 * @param songTitle
 * @param artistName
 * @returns {Promise<*>}
 */
export async function getSongVersions(songTitle, artistName) {
    let cleanedTitle = parseTitle(songTitle);

    let response = await get(API).advancedSearch({
        type: "song",
        operator: "and",
        limit: 100,
        rules: [
            ["title", 2, cleanedTitle],
            ["artist", 4, artistName],
        ],
    });

    if (response.error) {
        return false;
    }

    debugHelper(response, "getSongVersions");

    return response?.song;
}

/**
 * Get songs from albums
 * @param {array} albums
 * @returns {Promise<*>}
 */
export async function getSongsFromAlbums(albums) {
    let allResults = [];
    let promises = [];

    for (let i = 0; i < albums.length; i++) {
        promises[i] = get(API).albumSongs({ filter: albums[i].id });
    }

    allResults = await Promise.all([...promises]);

    allResults = allResults.map((group) => group.song);

    return allResults.flat();
}

/**
 * Get songs from albums starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export function getSongsFromAlbumsStartingWith(filterChar) {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["album", 8, encodeURI("^(?!the\\s)") + filterChar]],
    });
}

/**
 * Get songs from artists
 * @param {array} artists
 * @returns {Promise<*>}
 */
export function getSongsFromArtists(artists) {
    let artistsFormatted = artists.map((artist) => artist.name).join("|");

    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["artist", 8, "^(" + artistsFormatted + ")$"]],
    });
}

/**
 * Get songs from artists starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export function getSongsFromArtistsStartingWith(filterChar) {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["artist", 8, encodeURI("^(?!the\\s)") + filterChar]],
    });
}

/**
 * Get songs by year range
 * @param {number} from
 * @param {number} to
 * @returns {Promise<*>}
 */
export async function getSongsByYear(from, to) {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        offset: page * limit,
        rules: [
            ["year", 0, from],
            ["year", 1, to],
        ],
    });
}

/**
 * Get songs that have no rating
 * @returns {Promise<*>}
 */
export function unratedSongs({ page = 0, limit = 50 }) {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: limit,
        offset: page * limit,
        rules: [["myrating", 2, 0]],
    });
}

/**
 * Get newest songs
 * @returns {Promise<*>}
 */
export function newestSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        filter: "newest",
        limit: limit,
        offset: page * limit,
    });
}

/**
 * Get recently played songs
 * @returns {Promise<*>}
 */
export function recentSongs({ page = 0, limit = 50, offset = null }) {
    return get(API).stats({
        type: "song",
        filter: "recent",
        limit: limit,
        offset: offset || page * limit,
    });
}

/**
 * Get favorite songs
 * @returns {Promise<*>}
 */
export function favoriteSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        filter: "flagged",
        limit: limit,
        offset: page * limit,
    });
}

/**
 * Get frequent songs
 * @returns {Promise<*>}
 */
export function frequentSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        filter: "frequent",
        limit: limit,
        offset: page * limit,
    });
}

/**
 * Get top-rated songs
 * @returns {Promise<*>}
 */
export function topSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        filter: "highest",
        limit: limit,
        offset: page * limit,
    });
}

/**
 * Get forgotten songs
 * @returns {Promise<*>}
 */
export function forgottenSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        filter: "forgotten",
        limit: limit,
        offset: page * limit,
    });
}

/**
 * Get random songs
 * @returns {Promise<*>}
 */
export function randomSongs({ page = 0, limit = 50 }) {
    return get(API).stats({
        type: "song",
        limit: limit,
        offset: page * limit,
        filter: "random",
    });
}

/**
 * Get songs by genre
 * @param {number} genreID
 * @returns {Promise<*>}
 */
export async function getSomeSongsByGenre(genreID) {
    let genre = await get(API).genre({ filter: genreID });

    if (!genre.name) return;

    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["genre", 4, genre.name]],
    });
}

/**
 * Get songs from albums by genre
 * @param {number} genreID
 * @returns {Promise<*>}
 */
export async function getSomeSongsFromAlbumsByGenre(genreID) {
    let genre = await get(API).genre({ filter: genreID });

    if (!genre.name) return;

    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["album_genre", 4, genre.name]],
    });
}

/**
 * Get songs from albums by genre
 * @param {number} genreID
 * @returns {Promise<*>}
 */
export async function getSomeSongsFromArtistsByGenre(genreID) {
    let genre = await get(API).genre({ filter: genreID });

    if (!genre.name) return;

    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [["artist_genre", 4, genre.name]],
    });
}

/**
 * Group album songs by disc
 * @param {array} songs
 * @returns {Map<any, any>}
 */
export function groupSongsByDisc(songs) {
    let discs = new Map();

    for (let i = 0; i < songs.length; i++) {
        let discID = songs[i].disk;
        if (!discs.get(discID)) {
            discs.set(discID, []);
        }

        discs.get(discID).push(songs[i]);
    }

    return discs;
}

/**
 * Sort songs from earliest to most recent
 * @param {array} songs
 * @returns {*}
 */
export function sortSongsByYear(songs) {
    songs = songs.sort(function (obj1, obj2) {
        // Sort by year
        if (obj1.year > obj2.year) return 1;
        if (obj1.year < obj2.year) return -1;

        // Group by release if same year
        if (obj1.album.name > obj2.album.name) return 1;
        if (obj1.album.name < obj2.album.name) return -1;
    });

    return songs;
}

/**
 * Strips brackets & parentheses from title; e.g. (acoustic) or [live version]
 * @param str
 * @returns {*}
 */
function parseTitle(str) {
    return str.replace(/\s*[\(\[].*[\)\]]/gi, "");
}
