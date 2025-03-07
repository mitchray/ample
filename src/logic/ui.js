import { Settings } from "~/stores/settings.js";
import { IsMobile, JukeboxQueue, NowPlayingQueue } from "~/stores/state.js";
import { get } from "svelte/store";
import { tick } from "svelte";
import {
    JukeboxVirtualListBind,
    QueueVirtualListBind,
} from "~/stores/elements.js";

/**
 * Close sidebar
 */
export async function closeSidebar() {
    if (get(IsMobile)) {
        let status = false;
        Settings.update((x) => ({
            ...x,
            SidebarIsOpen: status,
        }));
    }
}

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

export async function showQueueItemAtIndex(index, immediate = false) {
    await tick();
    get(QueueVirtualListBind)?.scrollToIndex(index, {
        behavior: immediate ? "auto" : "smooth",
        align: "start",
    });
}

export async function updateQueue() {
    // need to restore scroll offset as the list will reset
    let offsetBeforeQueue = get(QueueVirtualListBind).scrollOffset;
    let offsetBeforeJukebox = get(JukeboxVirtualListBind).scrollOffset;

    NowPlayingQueue.set(get(NowPlayingQueue));
    JukeboxQueue.set(get(JukeboxQueue));

    await tick();

    get(QueueVirtualListBind).scrollToOffset(offsetBeforeQueue);
    get(JukeboxVirtualListBind).scrollToOffset(offsetBeforeJukebox);
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
