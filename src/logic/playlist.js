import { get } from "svelte/store";
import { sampleSize, uniqBy } from "lodash-es";
import { API } from "~/stores/state";
import { frequentArtists } from "~/logic/artist";

/**
 * Returns playlists for search
 * @param query
 * @param page
 * @param limit
 * @param exact
 * @returns {Promise<*>}
 */
export function searchPlaylists({
    query = "",
    page = 0,
    limit = 50,
    exact = false,
}) {
    return get(API).playlists({
        filter: query,
        exact: exact ? 1 : 0,
        offset: page * limit,
        limit: limit,
        hide_search: 1,
    });
}

/**
 * Returns smartlists for search
 * @param query
 * @param exact
 * @returns {Promise<*>}
 */
export function searchSmartlists({ query = "", exact = false }) {
    return get(API).smartlists({
        filter: query,
        exact: exact ? 1 : 0,
    });
}

export async function artistMixes() {
    // get mix of trending and top-rated artists
    let top = await get(API).advancedSearch({
        type: "artist",
        operator: "and",
        limit: 10,
        random: 1,
        rules: [["myrating", 0, 4]],
    });

    let trending = await frequentArtists({ limit: 5 });

    let mixedArtists = [...top.artist, ...trending.artist];

    // filter out duplicates
    let uniqueArtists = uniqBy(mixedArtists, (item) => {
        return item.id;
    });

    // filter Various Artists
    uniqueArtists = uniqueArtists.filter(
        (item) => item.name !== "Various Artists",
    );

    // select 5 randomly
    let finalArtists = sampleSize(uniqueArtists, 5);

    finalArtists = finalArtists.map((item) => ({
        ...item,
        playlistType: "artist",
    }));

    return [...finalArtists];
}
