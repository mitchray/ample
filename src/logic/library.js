import { get } from "svelte/store";
import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { debugHelper } from './helper';

let serverURL_value = get(serverURL);

/**
 * Make API request for library data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchLibraryData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.success) ? data.success : data;
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
 * Rate an object
 * @param {string} type
 * @param {number} id
 * @param {number} rating
 * @returns {Promise<*>}
 */
export const setRating = (type, id, rating) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=rate";
    queryURL += "&type=" + type + "&id=" + id + "&rating=" + rating;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "setRating");
    return fetchLibraryData(queryURL);
}

/**
 * Flag/favourite an object
 * @param {string} type
 * @param {number} id
 * @param {boolean} flag
 * @returns {Promise<*>}
 */
export const setFlag = (type, id, flag) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=flag";
    queryURL += "&type=" + type + "&id=" + id + "&flag=" + flag;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "setFlag");
    return fetchLibraryData(queryURL);
}

/**
 * Update info from tags
 * @param {string} type
 * @param {number} id
 * @returns {Promise<*>}
 */
export const updateFromTags = (type, id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=update_from_tags";
    queryURL += "&type=" + type + "&id=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "updateFromTags");
    return fetchLibraryData(queryURL);
}