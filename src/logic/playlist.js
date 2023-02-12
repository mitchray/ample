import { get } from "svelte/store";
import samplesize from "lodash/sampleSize";
import uniqby from "lodash/uniqby";
import { API } from "../stores/api";
import { frequentArtists, topArtists } from "./artist";

/**
 * Returns playlists for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export const searchPlaylists = ({query = "", page = 0, limit = 50, exact = false}) => {
    return get(API).playlists({
        filter: query,
        exact: (exact) ? 1 : 0,
        offset: page * limit,
        limit: limit,
        hide_search: 1
    })
}

/**
 * Returns smartlists for search
 * @param query
 * @param exact
 * @returns {Promise<*>}
 */
export const searchSmartlists = ({query = "", exact = false}) => {
    return get(API).smartlists({
        filter: query,
        exact: (exact) ? 1 : 0,
    })
}

export const artistMixes = async () => {
    // get mix of trending and top-rated artists
    let top = await get(API).advancedSearch({
        type: "artist",
        operator: "and",
        limit: 10,
        random: 1,
        rules: [
            ['myrating', 0, 4]
        ]
    });

    let trending = await frequentArtists({ limit: 5 });

    let mixedArtists = [...top,...trending];

    // filter out duplicates
    let uniqueArtists = uniqby(mixedArtists, (item) => {
       return item.id;
    });

    // filter Various Artists
    uniqueArtists = uniqueArtists.filter(item => item.name !== "Various Artists");

    // select 5 randomly
    let finalArtists = samplesize(uniqueArtists, 5);

    finalArtists = finalArtists.map((item, index) => ({ ...item, playlistType: "artist"}));

    return [...finalArtists];
}