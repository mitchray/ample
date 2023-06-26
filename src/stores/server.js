import { writable } from 'svelte/store';

// Debug toggle for development
export let debugMode = writable(false);

export let APIVersion = writable("6.0.0");
export const serverURL = writable(JSON.parse(localStorage.getItem('AmpleServerURL')) || '');

export let serverVersion = writable('');

export let allArtists = writable([]);
export let allAlbumArtists = writable([]);
export let groupedArtists = writable(null);
export let groupedAlbumArtists = writable(null);