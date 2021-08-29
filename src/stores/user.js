import { writable } from 'svelte/store';

export let userToken = writable(null);
export let userName = writable(null);
export let isLoggedIn = writable(null);

