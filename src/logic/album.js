import { get } from "svelte/store";

import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { MediaPlayer } from '../stores/player';

import { placeholderArtCheck, debugHelper, getCustomHue, getAverageColor } from "./helper";
import { getUserPreference } from './server';

let serverURL_value = get(serverURL);

/**
 * Make API request for album data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchAlbumData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.album) ? data.album : data;
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
 * Sort albums from earliest to most recent date
 * @param {array} albums
 * @returns {*}
 */
export const sortAlbumsByDate = async (albums) => {
    return albums.sort(function(obj1, obj2) { return obj1.year - obj2.year; })
}

/**
 * Get all albums
 * @returns {Promise<*>}
 */
export const getAlbums = async ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=albums";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get top rated albums
 * @returns {Promise<*>}
 */
export const getTopRatedAlbums = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=highest&limit=6";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getTopRatedAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get recently added albums
 * @returns {Promise<*>}
 */
export const getAlbumsRecentlyAdded = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=recent&limit=6";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsRecentlyAdded");
    return fetchAlbumData(queryURL);
}

/**
 * Get albums through advanced search
 * @returns {Promise<*>}
 */
export const getAlbumsFromAdvancedSearch = ({rows = [], limit = 0, random = false, match = "and"}) => {
    random = (random) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&limit=" + limit;
    queryURL += "&random=" + random;
    queryURL += "&type=album&operator=" + match;

    for (let i = 0; i < rows.length; i++) {
        let counter = parseInt(i + 1);
        queryURL += `&rule_${counter}=${rows[i].field}&rule_${counter}_operator=${rows[i].operator}&rule_${counter}_input=${encodeURI(rows[i].input)}`;
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsFromAdvancedSearch");
    return fetchAlbumData(queryURL);
}

/**
 * Get albums starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const getAlbumsStartingWith = ({page = 0, limit = 50, filterChar}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search&type=album";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    // ignore punctuation
    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsStartingWith");

    return fetchAlbumData(queryURL);
}

/**
 * Test existence of artists starting with specified character
 * @param {string} filterChar
 * @returns {Promise<*>}
 */
export const testAlbumsStartingWith = (filterChar) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search&type=album";
    queryURL += "&limit=1";
    queryURL += "&operator=and&rule_1=title&rule_1_operator=8&rule_1_input=" + encodeURI('^[[:punct:]]*') + filterChar;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "testAlbumsStartingWith");
    return fetchAlbumData(queryURL);
}

/**
 * Get album by ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getAlbum = async (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=album&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbum");

    let album = await fetchAlbumData(queryURL);
    album.averageColor = await getAverageColor(album.art + "&thumb=10");
    await getCustomHue(album.averageColor.value);

    let mp = get(MediaPlayer);
    await mp.setWaveColors();

    return album;
}

/**
 * Get albums by artist ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getAlbumsByArtist = (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=artist_albums&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsByArtist");
    return fetchAlbumData(queryURL);
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
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&type=album&operator=and";
    queryURL += "&rule_1=year&rule_1_operator=0&rule_1_input=" + from;
    queryURL += "&rule_2=year&rule_2_operator=1&rule_2_input=" + to;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsByYear");
    return fetchAlbumData(queryURL);
}

/**
 * Get albums that have no rating
 * @returns {Promise<*>}
 */
export const unratedAlbums = ({query = "", page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=advanced_search";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&type=album&operator=and&random=1";
    queryURL += "&rule_1=myrating&rule_1_operator=2&rule_1_input=0";

    if (query) {
        queryURL += "&rule_2=title&rule_2_operator=8&rule_2_input=" + encodeURI(query);
    }

    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "unratedAlbums");
    return fetchAlbumData(queryURL);
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
    exact = (exact) ? 1 : 0;

    let queryURL = serverURL_value + "/server/json.server.php?action=albums&filter=" + query;
    queryURL += "&exact=" + exact;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "searchAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get newly added albums
 * @returns {Promise<*>}
 */
export const newestAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=newest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "newestAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get newly released albums
 * @returns {Promise<*>}
 */
// TODO: not currently possible from API
export const newReleases = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=newest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "newReleases");
    return fetchAlbumData(queryURL);
}

/**
 * Get recently played albums
 * @returns {Promise<*>}
 */
export const recentAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=recent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "recentAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get favorite albums
 * @returns {Promise<*>}
 */
export const favoriteAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=flagged";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "favoriteAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get frequent albums
 * @returns {Promise<*>}
 */
export const frequentAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=frequent";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "frequentAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get top rated albums
 * @returns {Promise<*>}
 */
export const topAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=highest";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "topAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get forgotten albums
 * @returns {Promise<*>}
 */
export const forgottenAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=forgotten";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "forgottenAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get random albums
 * @returns {Promise<*>}
 */
export const randomAlbums = ({page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=stats&type=album&filter=random";
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "randomAlbums");
    return fetchAlbumData(queryURL);
}

/**
 * Get albums by genre
 * @returns {Promise<*>}
 */
export const getAlbumsByGenre = ({query, page = 0, limit = 50}) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=genre_albums&filter=" + query;
    queryURL += "&offset=" + page * limit;
    queryURL += "&limit=" + limit;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getAlbumsByGenre");
    return fetchAlbumData(queryURL);
}

/**
 * Group albums by release type
 * @param {array} albums
 * @returns {Map<any, any>}
 */
export const groupAlbumsByReleaseType = async (albums) => {
    let releaseTypes = new Map();
    let preferenceAlbumReleaseType = await getUserPreference('album_release_type');
    let preferenceAlbumReleaseTypeSort = await getUserPreference('album_release_type_sort');
    let preferenceReleaseTypes = preferenceAlbumReleaseTypeSort.value.split(',');

    if (preferenceAlbumReleaseType.value === '1') {
        // Create base types in specified order from server setting
        for (let i = 0; i < preferenceReleaseTypes.length; i++) {
            if (!releaseTypes.get(preferenceReleaseTypes[i])) {
                releaseTypes.set(preferenceReleaseTypes[i].toLowerCase(), []);
            }
        }

        // Add a catchall for missing/others
        releaseTypes.set("unknown", []);

        // Assign to existing types or create new ones as needed
        for (let i = 0; i < albums.length; i++) {
            let type = albums[i].type;

            if (type) {
                type = type.toLowerCase();
            }

            if (!releaseTypes.get(type)) {
                releaseTypes.set(type, []);
            }

            switch (type) {
                case null:
                    releaseTypes.get("unknown").push(albums[i]);
                    break;
                default:
                    releaseTypes.get(type).push(albums[i]);
                    break;
            }
        }
    } else {
        // just return the albums
        releaseTypes.set('ungrouped', albums);
    }

    return releaseTypes;
}