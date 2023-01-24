import { writable, get } from 'svelte/store';
import AmpacheAPI from 'javascript-ampache';
import { serverURL } from "./server";

export let API = writable(new AmpacheAPI({ url: get(serverURL), debug: false }));