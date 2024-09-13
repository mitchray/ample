import { get, derived } from "svelte/store";
import { SystemPreferences, UserPreferences } from "~/stores/state.js";

/**
 * Get a user preference by name, and return the value
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

/**
 * Create a derived store for user preferences
 * @param {string} name
 * @returns {import('svelte/store').Readable<any>}
 */
export function userPreferenceStore(name) {
    return derived(UserPreferences, ($UserPreferences) => {
        let pref = $UserPreferences.find((item) => item.name === name);

        if (pref?.type === "boolean") {
            return parseInt(pref.value) === 1;
        }

        return pref ? pref.value : null;
    });
}

/**
 * Create a derived store for system preferences
 * @param {string} name
 * @returns {import('svelte/store').Readable<any>}
 */
export function systemPreference(name) {
    return derived(SystemPreferences, ($SystemPreferences) => {
        let pref = $SystemPreferences.find((item) => item.name === name);

        if (pref?.type === "boolean") {
            return parseInt(pref.value) === 1;
        }

        return pref ? pref.value : null;
    });
}
