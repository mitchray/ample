import { get } from "svelte/store";

import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { customColors, MediaPlayer } from "../stores/player";

import { placeholderArtCheck, debugHelper, getAverageColor, getLegibleColors } from "./helper";
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
 * Get all artists
 * @returns {Promise<*>}
 */
export const getArtists = async ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artists";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtists");

    return fetchArtistData(queryURL);
}

/**
 * Get artists starting with specified character
 * @param {string} filterChar
 * @param albumArtistsOnly
 * @returns {Promise<*>}
 */
export const getArtistsStartingWith = async (filterChar, albumArtistsOnly = false) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search&type=artist";
    // ignore punctuation and leading "The "
    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^(?!the\\s)[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtistsStartingWith");

    let artists = await fetchArtistData(queryURL);

    artists.sort(function(obj1, obj2) {
        return obj1.name.toLowerCase().replace(/([^a-z0-9\s]|the\s)/g, "").localeCompare(obj2.name.toLowerCase().replace(/([^a-z0-9\s]|the\s)/g, "")) ;
    });

    if (albumArtistsOnly) {
        artists = artists.filter(a => a.albumcount > 0);
    }

    return artists;
}

/**
 * Test existence of artists starting with specified character
 * @param {string} filterChar
 * @param albumArtistsOnly
 * @returns {Promise<*>}
 */
export const testArtistsStartingWith = async (filterChar, albumArtistsOnly = false) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search&type=artist";

    // need to check more artists if albumArtistsOnly in case some get filtered out
    // 20 seems like a reasonable balance between speed and accuracy
    queryURL += `&limit=${albumArtistsOnly ? 20 : 1}`;

    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "testArtistsStartingWith");

    let artists = await fetchArtistData(queryURL);

    if (albumArtistsOnly) {
        artists = artists.filter(a => a.albumcount > 0);
    }

    return artists;
}

/**
 * Get artist by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getArtist = async (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artist&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getArtist");

    let artist = await fetchArtistData(queryURL);
    artist.useBackground = await placeholderArtCheck(artist.art + "&thumb=10");
    artist.averageColor = await getAverageColor(artist.art + "&thumb=10");
    artist.legibleColors = await getLegibleColors(artist.averageColor.value);

    customColors.set(artist.legibleColors);
    let mp = get(MediaPlayer);
    await mp.setWaveColors();

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
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&type=artist&operator=and&random=1";
    queryURL += "&rule_1=myrating&rule_1_operator=2&rule_1_input=0";

    if (query) {
        queryURL += "&rule_2=title&rule_2_operator=8&rule_2_input=" + encodeURI(query);
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "unratedArtists");
    return fetchArtistData(queryURL);
}

/**
 * Returns artists for search
 * @param query
 * @param page
 * @param limit
 * @returns {Promise<*>}
 */
export const searchArtists = ({query = "", page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artists&filter=" + query;
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
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=artist&filter=random";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "randomArtists");
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