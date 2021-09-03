import { readable, writable } from 'svelte/store';
import Player from '../logic/player'

export let ampleVersion = readable("0.10.0");

export let MediaPlayer = writable(new Player);

export let customColors = writable(null);