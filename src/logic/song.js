import { get } from "svelte/store";
import { API } from "../stores/api";
import { debugHelper } from './helper';
import { getArtist } from "./artist";

/**
 * Get songs from album ID
 * @param {number} id
 * @param {boolean} groupByDisc
 * @returns {Promise<*>}
 */
export const getSongsFromAlbum = async ({id, groupByDisc = false}) => {
    let songs = await get(API).albumSongs({ filter: id });

    if (groupByDisc) {
        songs = groupSongsByDisc(songs);
    }

    debugHelper(songs, "getSongsFromAlbum");

    return songs;
}

/**
 * Get songs from artist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getSongsFromArtist = async (id) => {
    let songs = await get(API).artistSongs({ filter: id });
    songs = sortSongsByYear(songs);

    return songs;
}

/**
 * Gets songs from different types of playlist
 * @param {string} id
 * @param {('playlist'|'smartlist'|'artist_mix')} type
 */
export const getSongsFromPlaylist = async ({id, type}) => {
    let results = [];

    switch (type) {
        case 'playlist':
        case 'smartlist':
            results = await get(API).playlistSongs({ filter: id });
            break;
        case 'artist_mix':
            let artists = await get(API).getSimilar({ type: "artist", filter: id, limit: 20 });
            let baseArtist   = await getArtist({ id: id });

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
export const getSongsFromPlaylists = async (playlists) => {
    let allResults = [];
    let promises = [];

    for (let i = 0; i < playlists.length; i++) {
        promises[i] = await get(API).playlistSongs({ filter: playlists[i].id });
    }

    allResults = await Promise.all([...promises]);

    return allResults.flat();
}

/**
 * Search songs starting with specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchSongsStartingWith = ({page = 0, limit = 50, query}) => {
    return get(API).advancedSearch({
        type: "song",
        operator: "and",
        limit: limit,
        offset: page * limit,
        rules: [
            ["title", 2, query]
        ]
    })
}

/**
 * Search songs containing (but not starting with) specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchSongsContaining = ({page = 0, limit = 50, query}) => {
    return get(API).advancedSearch({
        type: "song",
        operator: "and",
        limit: limit,
        offset: page * limit,
        rules: [
            ["title", 8, "^(?!" + query + ").*" + query]
        ]
    })
}

/**
 * Find songs with same title from artist
 * @param songTitle
 * @param artistName
 * @returns {Promise<*>}
 */
export const getSongVersions = async (songTitle, artistName) => {
    let cleanedTitle = parseTitle(songTitle);

    let songs = await get(API).advancedSearch({
        type: "song",
        operator: "and",
        limit: 100,
        rules: [
            ["title", 2, cleanedTitle],
            ["artist", 4, artistName],
        ]
    })

    let theRegex = "^" + cleanedTitle + "$";
    let re = new RegExp(theRegex,"gi");
    let filtered = songs.filter(e => parseTitle(e.title).match(re));

    debugHelper(filtered, "getSongVersions after filtering");
    return filtered;
}

/**
 * Get songs from albums
 * @param {array} albums
 * @returns {Promise<*>}
 */
export const getSongsFromAlbums = async (albums) => {
    let allResults = [];
    let promises = [];

    for (let i = 0; i < albums.length; i++) {
        promises[i] = get(API).albumSongs({ filter: albums[i].id })
    }

    allResults = await Promise.all([...promises]);

    return allResults.flat();
}

/**
 * Get songs from albums starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getSongsFromAlbumsStartingWith = (filterChar) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["album", 8, encodeURI('^(?!the\\s)') + filterChar]
        ]
    })
}

/**
 * Get songs from artists
 * @param {array} artists
 * @returns {Promise<*>}
 */
export const getSongsFromArtists = (artists) => {
    let artistsFormatted = artists.map((artist) => artist.name).join("|");

    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["artist", 8, "^(" + artistsFormatted + ")$"]
        ]
    })
}

/**
 * Get songs from artists starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getSongsFromArtistsStartingWith = (filterChar) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["artist", 8, encodeURI('^(?!the\\s)') + filterChar]
        ]
    })
}

/**
 * Get songs by year range
 * @param {number} from
 * @param {number} to
 * @returns {Promise<*>}
 */
export const getSongsByYear = async (from, to) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        offset: page * limit,
        rules: [
            ["year", 0, from],
            ["year", 1, to]
        ]
    })
}

/**
 * Get songs that have no rating
 * @returns {Promise<*>}
 */
export const unratedSongs = ({query = "", page = 0, limit = 50}) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: limit,
        offset: page * limit,
        rules: [
            ["myrating", 2, 0]
        ]
    })
}

/**
 * Returns songs for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchSongs = ({query = "", page = 0, limit = 50, exact = false}) => {
    return get(API).songs({
        exact: (exact) ? 1 : 0,
        filter: query,
        offset: page * limit,
        limit: limit,
    })
}

/**
 * Get newest songs
 * @returns {Promise<*>}
 */
export const newestSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "newest",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get recently played songs
 * @returns {Promise<*>}
 */
export const recentSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "recent",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get favorite songs
 * @returns {Promise<*>}
 */
export const favoriteSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "flagged",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get frequent songs
 * @returns {Promise<*>}
 */
export const frequentSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "frequent",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get top-rated songs
 * @returns {Promise<*>}
 */
export const topSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "highest",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get forgotten songs
 * @returns {Promise<*>}
 */
export const forgottenSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({
        type: "song",
        filter: "forgotten",
        limit: limit,
        offset: page * limit,
    })
}

/**
 * Get random songs
 * @returns {Promise<*>}
 */
export const randomSongs = ({page = 0, limit = 50}) => {
    return get(API).stats({ type: "song", limit: limit, offset: page * limit, filter: "random" })
}

/**
 * Get songs by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsByGenre = (genre) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["genre", 4, genre]
        ]
    })
}

/**
 * Get songs from albums by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsFromAlbumsByGenre = (genre) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["album_genre", 4, genre]
        ]
    })
}

/**
 * Get songs from albums by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsFromArtistsByGenre = (genre) => {
    return get(API).advancedSearch({
        type: "song",
        random: 1,
        operator: "and",
        limit: 100,
        rules: [
            ["artist_genre", 4, genre]
        ]
    })
}

/**
 * Group album songs by disc
 * @param {array} songs
 * @returns {Map<any, any>}
 */
export const groupSongsByDisc = (songs) => {
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
 * Sort songs alphabetically
 * @param {array} songs
 * @returns {*}
 */
export const sortSongsByName = (songs) => {
    return songs.sort(function(obj1, obj2) { return obj1.name.localeCompare(obj2.name) })
}

/**
 * Sort songs from earliest to most recent
 * @param {array} songs
 * @returns {*}
 */
export const sortSongsByYear = (songs) => {
    songs = songs.sort(function(obj1, obj2) {
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
    return str.replace(/\s*[\(\[].*[\)\]]/gi, '');
}