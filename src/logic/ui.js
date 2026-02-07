import { JukeboxQueue, NowPlayingQueue } from "~/stores/state.js";
import { get } from "svelte/store";
import { tick } from "svelte";
import { QueueTabulatorBind } from "~/stores/elements.js";

/**
 * Callback to keep the sl-drawer open
 */
export function keepDrawerOpen(event) {
    if (event.detail.source === "overlay") {
        event.preventDefault();
    }
}

/**
 * Wait for multiple ticks
 * @param count
 */
export async function ticks(count) {
    for (let i = 0; i < count; i++) {
        await tick();
    }
}

export async function showQueueItemAtIndex(index) {
    await tick();
    const tabulator = get(QueueTabulatorBind);
    const queue = get(NowPlayingQueue);
    const item = queue[index];
    if (item?._id) {
        tabulator?.scrollToRow(item._id, "top");
    }
}

export async function updateQueue() {
    NowPlayingQueue.set(get(NowPlayingQueue));
    JukeboxQueue.set(get(JukeboxQueue));

    await tick();
}

export function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");

    if (overlay) {
        overlay.classList.add("hiding");

        setTimeout(() => {
            overlay.classList.add("hidden");
            overlay.classList.remove("hiding");
        }, 300); // Adjust timing to match transition duration
    }
}
