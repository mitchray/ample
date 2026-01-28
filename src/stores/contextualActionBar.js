import { writable } from "svelte/store";

/**
 * Contextual action item shown in the floating action bar.
 * @typedef {Object} ContextualAction
 * @property {string} id - Unique id for show/hide/update
 * @property {string} label - Button label
 * @property {string} [icon] - Material Symbol name (e.g. 'add', 'play_arrow')
 * @property {() => void} onClick - Handler when the action is clicked
 * @property {boolean} [disabled=false] - Whether the button is disabled
 * @property {boolean} [loading=false] - Whether the button shows a loading state
 * @property {'default'|'primary'} [variant='default'] - Button style variant
 * @property {boolean} [visible=true] - Whether this action is currently visible
 */

/** @type {import('svelte/store').Writable<ContextualAction[]>} */
export const contextualActions = writable([]);

/**
 * Replace all actions in the bar (e.g. when a page mounts).
 * @param {ContextualAction[]} actions
 */
export function setContextualActions(actions) {
    contextualActions.set(Array.isArray(actions) ? actions : []);
}

/**
 * Clear all actions (e.g. when a page unmounts).
 */
export function clearContextualActions() {
    contextualActions.set([]);
}

/**
 * Add or update actions by id. Merges with existing; same id overwrites.
 * @param {ContextualAction[]} actionsToSet
 */
export function updateContextualActions(actionsToSet) {
    contextualActions.update((current) => {
        const byId = new Map(current.map((a) => [a.id, a]));
        for (const a of actionsToSet || []) {
            const existing = byId.get(a.id) || {};
            // Merge into existing action so callers can "patch" properties
            byId.set(a.id, { visible: true, loading: false, ...existing, ...a });
        }
        return [...byId.values()];
    });
}

/**
 * Set visibility of an action by id without removing it.
 * @param {string} id
 * @param {boolean} visible
 */
export function setActionVisibility(id, visible) {
    contextualActions.update((current) =>
        current.map((a) => (a.id === id ? { ...a, visible } : a)),
    );
}

/**
 * Remove specific actions by id.
 * @param {string[]} ids
 */
export function removeContextualActions(ids) {
    const set = new Set(ids);
    contextualActions.update((current) =>
        current.filter((a) => !set.has(a.id)),
    );
}
