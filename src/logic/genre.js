import { get } from "svelte/store";
import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { debugHelper } from "./helper";

let serverURL_value = get(serverURL);

/**
 * Make API request for genre data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchGenreData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.genre) ? data.genre : data;
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
 * Get all genres
 * @returns {Promise<*>}
 */
export const getGenres = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=genres";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getGenres");
    return fetchGenreData(queryURL);
}

/**
 * Get genre by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getGenre = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=genre&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getGenre");

    return fetchGenreData(queryURL);
}

/**
 * Sort genres alphabetically
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByName = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.name.localeCompare(obj2.name) })
}

/**
 * Sort genres by artists count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByArtists = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.artists < obj2.artists })
}

/**
 * Sort genres by albums count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByAlbums = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.albums < obj2.albums })
}

/**
 * Sort genres by songs count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresBySongs = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.songs < obj2.songs })
}