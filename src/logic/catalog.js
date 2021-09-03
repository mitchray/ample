import { get } from "svelte/store";
import { serverURL, APIVersion } from '../stores/server';
import { userToken } from '../stores/user';
import { debugHelper } from './helper';

let serverURL_value = get(serverURL);

/**
 * Make API request for user data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchCatalogData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.catalog) ? data.catalog : data[0];
            } else {
                return [];
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

export const getCatalogs = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=catalogs";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getCatalogs");
    return fetchCatalogData(queryURL);
}