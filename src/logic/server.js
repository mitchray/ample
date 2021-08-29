import { get } from "svelte/store";
import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { debugHelper } from './helper';

let serverURL_value = get(serverURL);

/**
 * Make API request for server data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchServerData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.preference) ? data.preference : data[0];
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
 * Get all user preferences
 * @returns {Promise<*>}
 */
export const getAllUserPreferences = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=user_preferences";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "all user_preferences");
    return fetchServerData(queryURL);
}

/**
 * Get a single user preference by name
 * @returns {Promise<*>}
 */
export const getUserPreference = (name) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=user_preference";
    queryURL += "&filter=" + name;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getUserPreference");
    return fetchServerData(queryURL);
}

/**
 * Get server version
 * @returns {Promise<*>}
 */
export const getServerVersion = async () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=ping";

    let version = await fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            if (data.version) {
                return data.version
            } else {
                return '';
            }
        })
        .catch(err => {
            console.log("Error reading data " + err);
            return err;
        });

    debugHelper(version, "getServerVersion");
    return version;
}