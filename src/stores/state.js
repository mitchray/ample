import { readable, writable } from "svelte/store";
import AmpacheAPI from "javascript-ampache";

// Debug toggle for development
export let debugMode = writable(false);

// Ample version
export let ampleVersion = readable("3.0.0-RC1");

// Ampache API version this app should use
export let APIVersion = writable("6.3.0");

// our instance of javascript-ampache
export let API = writable(new AmpacheAPI({ url: "" }));

export let PageTitle = writable("");
export let SearchQuery = writable("");
export let ShowSearch = writable(false);
export let ShowLyrics = writable(false);
export let ShowPreferences = writable(false);

export let CurrentMedia = writable(null);
export let NowPlayingQueue = writable([]);
export let NowPlayingIndex = writable(0);
export let IsPlaying = writable(false);
export let IsMuted = writable(false);
export let TimeToggled = writable(false);
export let PlaybackSpeed = writable(1.0);
export let QueueIsUpdating = writable(false);

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
 * @property {boolean} isHardcodedURL
 * @property {string|null} [url]
 * @property {string|null} [version]
 */
/** @type {import('svelte/store').Writable<AmpleServer>} */
export let Server = writable({
    url: null,
    version: null,
    isHardcodedURL: false,
});

export const IsMobile = readable(false, function start(set) {
    const mobile = window.matchMedia("(max-width: 679.99px)");

    mobile.onchange = (e) => {
        handleDeviceChange(e);
    };

    function handleDeviceChange(e) {
        set(e.matches);
    }

    // Kick-off
    handleDeviceChange(mobile);

    return function stop() {};
});
