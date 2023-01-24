import { get } from "svelte/store";
import { API } from "../stores/api";

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