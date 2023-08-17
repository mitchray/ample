import { readable, writable } from 'svelte/store';
import Player from '../logic/player'

export let ampleVersion = readable("2.0.1");

export let MediaPlayer = writable(new Player);

export let SiteInnerBind = writable();
export let SiteContentBind = writable();
export let SiteSidebarBind = writable();
export let SiteQueueBind   = writable();
