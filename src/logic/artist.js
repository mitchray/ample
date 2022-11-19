import { get } from "svelte/store";

import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { MediaPlayer } from "../stores/player";

import { debugHelper } from "./helper";
import { getAverageColor, setCustomHue } from "./color";
import { getAlbumsByArtist } from "./album";

let serverURL_value = get(serverURL);

/**
 * Make API request for artist data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchArtistData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.artist) ? data.artist : data;
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
 * Get artists through advanced search
 * @returns {Promise<*>}
 */
export const getArtistsFromAdvancedSearch = ({rows = [], limit = 0, random = false, match = "and"}) => {
    random = (random) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=" + limit;
    queryURL += "&random=" + random;
    queryURL += "&type=artist&operator=" + match;

    for (let i = 0; i < rows.length; i++) {
        let counter = parseInt(i + 1);
        queryURL += `&rule_${counter}=${rows[i].field}&rule_${counter}_operator=${rows[i].operator}&rule_${counter}_input=${encodeURI(rows[i].input)}`;
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtistsFromAdvancedSearch");
    return fetchArtistData(queryURL);
}

/**
 * Get artists starting with specified character
 * @param page
 * @param limit
 * @param {string} filterChar
 * @param {string} type
 * @returns {Promise<*>}
 */
export const getArtistsStartingWithChar = ({page = 0, limit = 50, filterChar, type = 'artist'}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=" + type;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    // ignore punctuation
    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtistsStartingWithChar");

    return fetchArtistData(queryURL);
}

/**
 * Search artists starting with specified string
 * @param page
 * @param limit
 * @param {string} query
 * @returns {Promise<*>}
 */
export const searchArtistsStartingWith = ({page = 0, limit = 50, query}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=" + "artist";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&operator=and&rule_1=title&rule_1_operator=2&rule_1_input=" + query;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchArtistsStartingWith");

    return fetchArtistData(queryURL);
}

/**
 * Test existence of artists starting with specified character
 * @param {string} filterChar
 * @param {string} type
 * @returns {Promise<*>}
 */
export const testArtistsStartingWithChar = async (filterChar) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=artist";
    queryURL += `&limit=1`;
    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "testArtistsStartingWithChar");

    return fetchArtistData(queryURL);
}

/**
 * Get artist by ID
 * @param {number} id
 * @param {boolean} artAnalysis
 * @returns {Promise<*>}
 */
export const getArtist = async ({id = id, artAnalysis = false}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artist&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtist");

    let artist = await fetchArtistData(queryURL);

    if (artAnalysis) {
        artist.averageColor = await getAverageColor(artist.art + "&thumb=10");

        if (artist.averageColor) {
            await setCustomHue(artist.averageColor.value);

            let mp = get(MediaPlayer);
            await mp.setWaveColors();
        }
    }

    let appearances = await getAlbumsByArtist(artist.id);
    artist.appearanceCount = appearances.length - artist.albumcount;

    return artist;
}

/**
 * Get artists that have no rating
 * @returns {Promise<*>}
 */
export const unratedArtists = ({query = "", page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=artist";
    queryURL += "&operator=and&random=1";
    queryURL += "&rule_1=myrating&rule_1_operator=2&rule_1_input=0";

    if (query) {
        queryURL += "&rule_2=title&rule_2_operator=8&rule_2_input=" + encodeURI(query);
    }

    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "unratedArtists");
    return fetchArtistData(queryURL);
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
    exact = (exact) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=artists&filter=" + query;
    queryURL += "&exact=" + exact;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get newest artists
 * @returns {Promise<*>}
 */
export const newestArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=newest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "newestArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get recently played artists
 * @returns {Promise<*>}
 */
export const recentArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=recent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "recentArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get favorite artists
 * @returns {Promise<*>}
 */
export const favoriteArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=flagged";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "favoriteArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get frequent artists
 * @returns {Promise<*>}
 */
export const frequentArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=frequent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "frequentArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get top rated artists
 * @returns {Promise<*>}
 */
export const topArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=highest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "topArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get forgotten artists
 * @returns {Promise<*>}
 */
export const forgottenArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=forgotten";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "forgottenArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export const randomArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=artist";
    queryURL += "&operator=and&random=1";
    queryURL += "&rule_1=title&rule_1_operator=0&rule_1_input=";

    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "randomArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get random artists
 * @returns {Promise<*>}
 */
export const randomAlbumArtists = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=artist";
    queryURL += "&operator=and&random=1";
    queryURL += "&rule_1=album_count&rule_1_operator=4&rule_1_input=0";

    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "randomAlbumArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get similar artists
 * @returns {Promise<*>}
 */
export const similarArtists = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=get_similar&type=artist&filter=" + id;
    queryURL += "&limit=15";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "similarArtists");
    return fetchArtistData(queryURL);
}

/**
 * Get artists by genre
 * @returns {Promise<*>}
 */
export const getArtistsByGenre = ({query, page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=genre_artists&filter=" + query;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtistsByGenre");
    return fetchArtistData(queryURL);
}