import { get } from "svelte/store";
import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { debugHelper } from './helper';
import { v4 as uuidv4 } from 'uuid';

let serverURL_value = get(serverURL);

/**
 * Make API request for song data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchSongData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                // if a single object is returned place into array so map works
                let dataPlaceholder = (data.song) ? data.song : [data];

                dataPlaceholder = dataPlaceholder.map((item, index) => ({ ...item, _id: uuidv4()}));

                return dataPlaceholder;
            } else {
                return [];
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

/**
 * Get song by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getSong = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=song&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSong");
    return fetchSongData(queryURL);
}

/**
 * Get songs from album ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getSongsFromAlbum = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=album_songs&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromAlbum");
    return fetchSongData(queryURL);
}

/**
 * Get songs from artist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getSongsFromArtist = async (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artist_songs&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromArtist");

    let songs = await fetchSongData(queryURL);
    songs = sortSongsByYear(songs);

    return songs;
}

/**
 * Get top songs from artist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getTopSongsFromArtist = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artist_songs&filter=" + id;
    queryURL += "&top50=1";
    queryURL += "&limit=20";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getTopSongsFromArtist");
    return fetchSongData(queryURL);
}

/**
 * Get songs from playlist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getSongsFromPlaylist = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_songs&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromPlaylist");
    return fetchSongData(queryURL);
}

/**
 * Get a single song from playlist ID
 * @param {number} playlistID
 * @param {number} songIndex
 * @param {number} limit
 * @returns {Promise<*>}
 */
// TODO can probably refactor into getSongsFromPlaylist
export const getSongFromPlaylist = ({playlistID = '', songIndex = '', limit = 1}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=playlist_songs";
    queryURL += "&filter=" + playlistID;
    queryURL += "&offset=" + songIndex;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongFromPlaylist");
    return fetchSongData(queryURL);
}

/**
 * Get songs through advanced search
 * @returns {Promise<*>}
 */
export const getSongsFromAdvancedSearch = ({rows = [], limit = 0, random = false, match = "and"}) => {
    random = (random) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=" + limit;
    queryURL += "&random=" + random;
    queryURL += "&type=song&operator=" + match;

    for (let i = 0; i < rows.length; i++) {
        let counter = parseInt(i + 1);
        queryURL += `&rule_${counter}=${rows[i].field}&rule_${counter}_operator=${rows[i].operator}&rule_${counter}_input=${encodeURI(rows[i].input)}`;
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromAdvancedSearch");
    return fetchSongData(queryURL);
}

/**
 * Find songs with same title from artist
 * @param songTitle
 * @param artistName
 * @returns {Promise<*>}
 */
export const getSongVersions = async (songTitle, artistName) => {
    let cleanedTitle = parseTitle(songTitle);

    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=100";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=title&rule_1_operator=2&rule_1_input=" + encodeURI(cleanedTitle);
    queryURL += "&rule_2=artist&rule_2_operator=4&rule_2_input=" + encodeURI(artistName);
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongVersions URL");

    let songs = await fetchSongData(queryURL);
    debugHelper(songs, "getSongVersions before filtering");

    let theRegex = "^" + cleanedTitle + "$";
    let re = new RegExp(theRegex,"gi");
    let filtered = songs.filter(e => parseTitle(e.title).match(re));

    debugHelper(filtered, "getSongVersions after filtering");
    return filtered;
}

/**
 * Get songs from albums starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getSongsFromAlbumsStartingWith = (filterChar) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=album&rule_1_operator=8&rule_1_input=" + encodeURI('^(?!the\\s)') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromAlbumsStartingWith");
    return fetchSongData(queryURL);
}

/**
 * Get songs from artists starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getSongsFromArtistsStartingWith = (filterChar) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=artist&rule_1_operator=8&rule_1_input=" + encodeURI('^(?!the\\s)') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsFromArtistsStartingWith");
    return fetchSongData(queryURL);
}

/**
 * Get songs by year range
 * @param {number} from
 * @param {number} to
 * @returns {Promise<*>}
 */
export const getSongsByYear = async (from, to) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=year&rule_1_operator=0&rule_1_input=" + from;
    queryURL += "&rule_2=year&rule_2_operator=1&rule_2_input=" + to;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSongsByYear");
    return fetchSongData(queryURL);
}

/**
 * Get songs that have no rating
 * @returns {Promise<*>}
 */
export const unratedSongs = ({query = "", page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&type=song&operator=and&random=1";
    queryURL += "&rule_1=myrating&rule_1_operator=2&rule_1_input=0";

    if (query) {
        queryURL += "&rule_2=title&rule_2_operator=8&rule_2_input=" + encodeURI(query);
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "unratedSongs");
    return fetchSongData(queryURL);
}

/**
 * Returns songs for search
 * @param query
 * @param page
 * @param limit
 * @returns {Promise<*>}
 */
export const searchSongs = ({query = "", page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=songs&filter=" + query;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchSongs");
    return fetchSongData(queryURL);
}

/**
 * Get newest songs
 * @returns {Promise<*>}
 */
export const newestSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=newest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "newestSongs");
    return fetchSongData(queryURL);
}

/**
 * Get recently played songs
 * @returns {Promise<*>}
 */
export const recentSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=recent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "recentSongs");
    return fetchSongData(queryURL);
}

/**
 * Get favorite songs
 * @returns {Promise<*>}
 */
export const favoriteSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=flagged";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "favoriteSongs");
    return fetchSongData(queryURL);
}

/**
 * Get frequent songs
 * @returns {Promise<*>}
 */
export const frequentSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=frequent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "frequentSongs");
    return fetchSongData(queryURL);
}

/**
 * Get top rated songs
 * @returns {Promise<*>}
 */
export const topSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=highest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "topSongs");
    return fetchSongData(queryURL);
}

/**
 * Get forgotten songs
 * @returns {Promise<*>}
 */
export const forgottenSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=forgotten";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "forgottenSongs");
    return fetchSongData(queryURL);
}

/**
 * Get random songs
 * @returns {Promise<*>}
 */
export const randomSongs = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=song&filter=random";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "randomSongs");
    return fetchSongData(queryURL);
}

/**
 * Get genre songs (non-advanced search method)
 * @returns {Promise<*>}
 */
export const getGenreSongs = ({query, page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=genre_songs&filter=" + query;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getGenreSongs");
    return fetchSongData(queryURL);
}

/**
 * Get songs by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsByGenre = (genre) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=tag&rule_1_operator=4&rule_1_input=" + genre;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSomeSongsByGenre");
    return fetchSongData(queryURL);
}

/**
 * Get songs from albums by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsFromAlbumsByGenre = (genre) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=album_tag&rule_1_operator=4&rule_1_input=" + genre;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSomeSongsFromAlbumsByGenre");
    return fetchSongData(queryURL);
}

/**
 * Get songs from albums by genre
 * @param {string} genre
 * @returns {Promise<*>}
 */
export const getSomeSongsFromArtistsByGenre = (genre) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=200&random=1";
    queryURL += "&type=song&operator=and";
    queryURL += "&rule_1=artist_tag&rule_1_operator=4&rule_1_input=" + genre;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getSomeSongsFromArtistsByGenre");
    return fetchSongData(queryURL);
}

/**
 * Group album songs by disc
 * @param {array} songs
 * @returns {Map<any, any>}
 */
export const groupSongsByDisc = (songs) => {
    let discs = new Map();

    for (let i = 0; i < songs.length; i++) {
        let discID = songs[i].album.id;
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
 * Sort songs by album
 * @param {array} songs
 * @returns {*}
 */
export const sortSongsByAlbum = (songs) => {
    return songs.sort(function(obj1, obj2) { return obj1.album.name.localeCompare(obj2.album.name) })
}

/**
 * Sort songs by rating
 * @param {array} songs
 * @returns {*}
 */
export const sortSongsByRating = (songs) => {
    return songs.sort(function(obj1, obj2) { return obj1.rating < obj2.rating })
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