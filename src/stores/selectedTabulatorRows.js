import { writable, get, derived } from "svelte/store";

/**
 * Map of tableId -> selected row data arrays.
 * Aggregates selection across all Tabulator instances.
 * @type {import('svelte/store').Writable<Map<string, any[]>>}
 */
export const selectedTabulatorRows = writable(new Map());

/**
 * Set selection for one table (replaces its entry).
 * @param {string} tableId
 * @param {any[]} rows
 */
export function setTableSelection(tableId, rows) {
    selectedTabulatorRows.update((map) => {
        const next = new Map(map);
        next.set(tableId, Array.isArray(rows) ? rows : []);
        return next;
    });
}

/**
 * Trigger to request all Tabulator instances to clear their selection.
 * Increment this from the UI; Tabulator.svelte subscribes and calls deselectRow().
 * @type {import('svelte/store').Writable<number>}
 */
export const clearSelectionTrigger = writable(0);

/**
 * Call from UI to clear all selections across all Tabulator tables.
 */
export function clearAllSelections() {
    clearSelectionTrigger.update((n) => n + 1);
}

/**
 * Remove one table's selection (e.g. on destroy).
 * @param {string} tableId
 */
export function clearTableSelection(tableId) {
    selectedTabulatorRows.update((map) => {
        const next = new Map(map);
        next.delete(tableId);
        return next;
    });
}

/**
 * Return a single array of all selected rows across all tables.
 * Reads current store value so callers get up-to-date data.
 * @returns {any[]}
 */
/**
 * Derived store of all selected rows (flattened across tables).
 * Use in components for reactive updates.
 * @type {import('svelte/store').Readable<any[]>}
 */
export const selectedTabulatorRowsFlat = derived(
    selectedTabulatorRows,
    (map) => {
        const result = [];
        for (const rows of map.values()) {
            result.push(...rows);
        }
        return result;
    },
);

/**
 * Return a single array of all selected rows across all tables.
 * Reads current store value so callers get up-to-date data.
 * @returns {any[]}
 */
export function getSelectedRows() {
    const map = get(selectedTabulatorRows);
    const result = [];
    for (const rows of map.values()) {
        result.push(...rows);
    }
    return result;
}
