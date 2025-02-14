import { writable } from "svelte/store";

export let MediaPlayer = writable(null);
export let SiteContentBind = writable();
export let SitePlayerBind = writable();
export let QueueVirtualListBind = writable();
export let JukeboxVirtualListBind = writable();
export let QueuePanelBind = writable();
