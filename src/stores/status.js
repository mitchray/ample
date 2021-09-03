import { writable } from 'svelte/store';

export let NowPlayingQueue = writable([]);
export let NowPlayingIndex = writable(0);

export let IsPlaying = writable(false);
export let IsMuted = writable(false);
export let CurrentSong = writable(null);

export let SearchQuery = writable('');
export let ShowSearch = writable(false);

export let RepeatEnabled = writable(JSON.parse(localStorage.getItem('RepeatEnabled')) || false);
export let VolumeNormalizationEnabled = writable(JSON.parse(localStorage.getItem('VolumeNormalizationEnabled')) || false);
export let DynamicsCompressorEnabled = writable(JSON.parse(localStorage.getItem('DynamicsCompressorEnabled')) || false);

export let AutoPlayEnabled = writable(JSON.parse(localStorage.getItem('AutoPlayEnabled')) || false);
export let AutoPlayPlaylist = writable(JSON.parse(localStorage.getItem('AutoPlayPlaylist')) || null);

export let ShowExpandedAlbums = writable(false);
export let ShowAlbumArtistsOnly = writable(true);

export let SkipBelow = writable(JSON.parse(localStorage.getItem('SkipBelow')) || false);
export let SkipBelowRating = writable(JSON.parse(localStorage.getItem('SkipBelowRating')) || 3);

export let ThemeIsLight = writable(JSON.parse(localStorage.getItem('AmpleThemeIsLight')) || false);