import { writable } from "svelte/store";

export let MediaPlayer = writable(null);
export let SiteContentBind = writable();
export let SitePlayerBind = writable();
export let QueueTabulatorBind = writable();
export let QueuePanelBind = writable();
