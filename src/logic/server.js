import { get } from "svelte/store";
import { debugHelper } from './helper';
import { API } from "../stores/api";

/**
 * Get server version
 * @returns {Promise<*>}
 */
export const getServerVersion = async () => {
    let {version = ''} = await get(API).ping();
    debugHelper(version, "getServerVersion");
    return version;
}