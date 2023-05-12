import { readable, writable } from 'svelte/store';
import Player from '../logic/player'

export let ampleVersion = readable("1.1.0");

export let MediaPlayer = writable(new Player);

export let SiteInnerBind = writable();
export let SiteContentBind = writable();
export let SiteSidebarBind = writable();
export let SiteQueueBind   = writable();
