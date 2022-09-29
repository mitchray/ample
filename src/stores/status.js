import { writable } from 'svelte/store';

export let NowPlayingQueue = writable([]);
export let NowPlayingIndex = writable(0);

export let IsPlaying   = writable(false);
export let IsMuted     = writable(false);
export let CurrentSong = writable(null);

export let SearchQuery = writable('');
export let ShowSearch  = writable(false);
export let ShowLyrics    = writable(JSON.parse(localStorage.getItem('ShowLyrics')) || false);

export let SidebarIsMini   = writable(JSON.parse(localStorage.getItem('SidebarIsMini')) || false);
export let SidebarIsOpen   = writable(JSON.parse(localStorage.getItem('SidebarIsOpen')) || false);
export let SidebarIsPinned = writable(JSON.parse(localStorage.getItem('SidebarIsPinned')) || false);

export let QueueIsOpen   = writable(JSON.parse(localStorage.getItem('QueueIsOpen')) || false);
export let QueueIsPinned = writable(JSON.parse(localStorage.getItem('QueueIsPinned')) || false);

export let PlayerVolume               = writable(JSON.parse(localStorage.getItem('PlayerVolume')) || 50);
export let RepeatEnabled              = writable(JSON.parse(localStorage.getItem('RepeatEnabled')) || false);
export let VolumeNormalizationEnabled = writable(JSON.parse(localStorage.getItem('VolumeNormalizationEnabled')) || false);
export let DynamicsCompressorEnabled  = writable(JSON.parse(localStorage.getItem('DynamicsCompressorEnabled')) || false);

export let AutoPlayEnabled  = writable(JSON.parse(localStorage.getItem('AutoPlayEnabled')) || false);
export let AutoPlayPlaylist = writable(JSON.parse(localStorage.getItem('AutoPlayPlaylist')) || null);

export let ShowNotificationGainTagsMissing      = writable(JSON.parse(localStorage.getItem('ShowNotificationGainTagsMissing')) || false);
export let ShowNotificationRatingMissing        = writable(JSON.parse(localStorage.getItem('ShowNotificationRatingMissing')) || false);
export let ShowNotificationAlternateVersions    = writable(JSON.parse(localStorage.getItem('ShowNotificationAlternateVersions')) || false);
export let ShowNotificationLyricsMissing        = writable(JSON.parse(localStorage.getItem('ShowNotificationLyricsMissing')) || false);
export let ShowNotificationLyricsNotTimestamped = writable(JSON.parse(localStorage.getItem('ShowNotificationLyricsNotTimestamped')) || false);

export let ShowArtistType = writable(JSON.parse(localStorage.getItem('ShowArtistType')) || "all");
export let ShowExpandedAlbums = writable(JSON.parse(localStorage.getItem('ShowExpandedAlbums')) || false);

export let SkipBelow       = writable(JSON.parse(localStorage.getItem('SkipBelow')) || false);
export let SkipBelowRating = writable(JSON.parse(localStorage.getItem('SkipBelowRating')) || 3);

export let Theme     = writable(JSON.parse(localStorage.getItem('AmpleTheme')) || null);
export let customHue = writable();