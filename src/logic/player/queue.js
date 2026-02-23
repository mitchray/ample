import { get } from "svelte/store";
import { NowPlayingQueue, NowPlayingIndex } from "~/stores/state.js";
import { Settings } from "~/stores/settings.js";
import { updateQueue } from "~/logic/ui.js";

/**
 * @returns {object|null}
 */
export function getCurrentItem() {
    const queue = get(NowPlayingQueue);
    const index = get(NowPlayingIndex);
    return queue[index] ?? null;
}

/**
 * @param {object} item
 * @param {object} [settings]
 */
export function isEligibleToPlay(item, settings = get(Settings)) {
    if (!item) return false;
    return (
        !settings.SkipBelow.enabled ||
        !item.hasOwnProperty("rating") ||
        (settings.SkipBelow.enabled &&
            settings.SkipBelow.allowZero &&
            !item.rating) ||
        item.rating >= settings.SkipBelow.rating
    );
}

/**
 * @param {'previous' | 'next'} direction
 */
export function findViableItem(direction) {
    const queue = get(NowPlayingQueue);
    const index = get(NowPlayingIndex);
    const settings = get(Settings);
    let i = direction === "previous" ? index - 1 : index + 1;
    while (direction === "previous" ? i >= 0 : i < queue.length) {
        if (isEligibleToPlay(queue[i], settings)) return queue[i];
        direction === "previous" ? i-- : i++;
    }
    return null;
}

/**
 * @param {number} count
 */
export function findViableItemsAhead(count) {
    const queue = get(NowPlayingQueue);
    const index = get(NowPlayingIndex);
    const settings = get(Settings);
    const result = [];
    for (
        let i = index + 1;
        i < queue.length && result.length < count;
        i++
    ) {
        if (isEligibleToPlay(queue[i], settings)) result.push(queue[i]);
    }
    return result;
}

export function hasEligibleItems() {
    const queue = get(NowPlayingQueue);
    const settings = get(Settings);
    return queue.some((item) => isEligibleToPlay(item, settings));
}

/**
 * @param {object} media
 */
export function setIndexToItem(media) {
    if (!media) return;
    const queue = get(NowPlayingQueue);
    const foundIndex = queue.findIndex((item) => item._id === media._id);
    if (foundIndex >= 0) NowPlayingIndex.set(foundIndex);
}

/**
 * @param {Array} arr
 */
export async function setQueueItems(arr) {
    NowPlayingQueue.set(arr);
    await updateQueue();
}

/**
 * Clear queue to only the current item and set index to 0.
 */
export async function clearAllExceptCurrent() {
    const current = getCurrentItem();
    await setQueueItems(current ? [current] : []);
    NowPlayingIndex.set(0);
}
