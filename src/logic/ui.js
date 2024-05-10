import { Saved, SidebarIsOpen } from "~/stores/settings.js";
import { IsMobile, NowPlayingIndex, NowPlayingQueue } from "~/stores/state.js";
import { get } from "svelte/store";
import { tick } from "svelte";
import { QueueVirtualListBind } from "~/stores/elements.js";

/**
 * Close sidebar
 */
export async function closeSidebar() {
    if (get(IsMobile)) {
        let status = false;
        get(Saved).setItem("SidebarIsOpen", status);
        SidebarIsOpen.set(status);
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

export function showQueueItemAtIndex(index) {
    get(QueueVirtualListBind)?.scrollToIndex(index, {
        behavior: "smooth",
        align: "start",
    });
}

export async function updateQueue() {
    // need to restore scroll offset as the list will reset
    let offsetBefore = get(QueueVirtualListBind).scrollOffset;
    NowPlayingQueue.set(get(NowPlayingQueue));
    await tick();
    get(QueueVirtualListBind).scrollToOffset(offsetBefore);
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
