import { readable, writable } from "svelte/store";
import AmpacheAPI from "javascript-ampache";

// Debug toggle for development
export let debugMode = writable(false);

// Ample version
export let ampleVersion = readable("4.0.0-WIP");

// Ampache API version this app should use
export let APIVersion = writable("6.6.8");

export let useBearerToken = writable(true);

// our instance of javascript-ampache
export let API = writable(new AmpacheAPI({ url: "" }));

export let PageTitle = writable("");
export let SearchQuery = writable("");
export let ShowSearch = writable(false);
export let ShowLyrics = writable(false);
export let ShowPreferences = writable(false);
export let ShowVisualizer = writable(false);

export let CurrentMedia = writable(null);
export let CurrentMediaGainInfo = writable({});
export let JukeboxQueue = writable([]);
export let NowPlayingQueue = writable([]);
export let NowPlayingIndex = writable(0);
export let IsPlaying = writable(false);
export let IsMuted = writable(false);
export let TimeToggled = writable(false);
export let PlaybackSpeed = writable(1.0);

export const SystemPreferences = writable([]);
export const UserPreferences = writable([]);

/**
 * Hold info about current user
 * @typedef {Object} AmpleUser
 * @property {boolean} isLoggedIn
 * @property {string|null} [name]
 * @property {string|null} [token]
 */
/** @type {import('svelte/store').Writable<AmpleUser>} */
export let User = writable({
    token: null,
    name: null,
    isLoggedIn: null,
});

/**
 * Hold info about the Ampache server
 * @typedef {Object} AmpleServer
 * @property {string|null} [ampacheURL]
 * @property {string|null} [version]
 */
/** @type {import('svelte/store').Writable<AmpleServer>} */
export let Server = writable({
    ampacheURL: null,
    version: null,
});

export let recentRating = writable({
    type: null,
    id: null,
    rating: null,
});

// shared across component instances
export let recentFlag = writable({
    type: null,
    id: null,
    flag: null,
});
