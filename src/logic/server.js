import { get } from "svelte/store";
import { debugHelper } from './helper';
import { API } from "../stores/api";
import {serverVersion} from "../stores/server.js";

/**
 * Get server version
 * @returns {Promise<*>}
 */
export const getServerVersion = async () => {
    let {version = ""} = await get(API).ping();

    if (version) {
        serverVersion.set(version);
    }

    debugHelper(version, "getServerVersion");
}