import { get } from "svelte/store";
import { SystemPreferences, UserPreferences } from "~/stores/state.js";

/**
 * Get a system preference by name, and return the value
 * @param name
 * @returns {*|null}
 */
export function systemPreference(name) {
    let pref = get(SystemPreferences).find((item) => item.name === name);

    if (pref?.type === "boolean") {
        return parseInt(pref.value) === 1;
    }

    return pref ? pref.value : null;
}

/**
 * Get a system preference by name, and return the value
 * @param name
 * @returns {*|null}
 */
export function userPreference(name) {
    let pref = get(UserPreferences).find((item) => item.name === name);

    if (pref?.type === "boolean") {
        return parseInt(pref.value) === 1;
    }

    return pref ? pref.value : null;
}
