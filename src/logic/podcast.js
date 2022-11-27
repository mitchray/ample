import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

import { APIVersion, serverURL } from '../stores/server';
import { userToken } from '../stores/user';

import { debugHelper } from "./helper";

let serverURL_value = get(serverURL);

/**
 * Make API request for artist data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchPodcastData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                let results;

                if (data.podcast) {
                    results = data.podcast;
                } else if (data.podcast_episode) {
                    results = data.podcast_episode;
                } else {
                    results = [data]; // if a single object is returned place into array so map works
                }

                // each media item needs a unique _id
                results = results.map((item, index) => ({ ...item, _id: uuidv4(), isPodcast: true}));

                return results;
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
 * Get all podcast
 * @returns {Promise<*>}
 */
export const getPodcasts = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=podcasts";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getPodcasts");
    return fetchPodcastData(queryURL);
}

/**
 * Get episodes from podcast ID
 * @param {number} id
 * @returns {Promise<*>}
 */
export const getEpisodesFromPodcast = async (id) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=podcast_episodes&filter=" + id;
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getEpisodesFromPodcast");

    let results = await fetchPodcastData(queryURL);

    return results.filter((item) => item.state === "completed");
}