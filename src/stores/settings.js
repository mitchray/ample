import { get, writable } from "svelte/store";
import { persisted } from "svelte-persisted-store";
import { API, SystemPreferences, UserPreferences } from "~/stores/state.js";
import { locale } from "svelte-i18n";
import { setTabulatorLang } from "~/logic/i18n.js";

// our global svelte-persisted-store
export let Settings = persisted("ample-settings", {
    SidebarIsExpanded: true,
    QueueIsOpen: true,
    QueueIsPinned: true,
    PlayerVolume: 50,
    PlayerIsMini: false,
    RepeatState: "disabled",
    VolumeNormalizationEnabled: true,
    DynamicsCompressorEnabled: false,
    Language: "en",
    SkipBelow: {
        enabled: false,
        rating: "3",
        allowZero: true,
    },
    ShowSongsByOtherArtists: "show",
    PlaySongsByOtherArtists: "include",
    LastSession: {},
    LastLoginMethod: null,
    Crossfade: {
        mode: "disabled",
        duration: 6,
    },
    QueueRefill: {
        enabled: false,
        mode: "smartlist",
        smartlist: null,
    },
    ArtistReleases: {
        view: "expanded_columns",
        sort: "year",
        group: "release_type",
        sortReversed: false,
    },
    Theme: {
        mode: null,
        Dark: {
            hueBackground: 60,
            hue1: 60,
            hue2: 60,
            colorWave: "hsl(30, 70%, 50%)",
            isGray: true,
        },
        Light: {
            hueBackground: 250,
            hue1: 250,
            hue2: 250,
            colorWave: "hsl(207, 88%, 54%)",
            isGray: true,
        },
    },
    Notifications: {
        GainTagsMissing: {
            isEnabled: false,
            isSilent: false,
        },
        RatingMissing: {
            isEnabled: false,
            isSilent: false,
        },
        AlternateVersions: {
            isEnabled: false,
            isSilent: false,
        },
        LyricsMissing: {
            isEnabled: false,
            isSilent: false,
        },
        LyricsNotTimestamped: {
            isEnabled: false,
            isSilent: false,
        },
    },
    MusicBrainzFilters: {
        hideMatches: false,
        hideDuplicates: false,
        hideIssues: false,
        hideFlagged: false,
        hideMissing: false,
        hideInfos: false,
        hideVideos: false,
        hideRemixes: false,
        hideLive: false,
        hideInstrumentals: false,
        hideDemos: false,
        hideInterviews: false,
        hideZeroTimes: false,
        hideShortSongs: false,
        hideRadioEdits: false,
    },
});

export async function loadSettings() {
    let systemsPrefsResponse = await get(API).systemPreferences();
    SystemPreferences.set(systemsPrefsResponse.preference);

    let userPrefsResponse = await get(API).userPreferences();
    UserPreferences.set(userPrefsResponse.preference);

    let lang = get(Settings).Language;
    if (lang) {
        locale.set(lang);
        setTabulatorLang(lang);
    }
}
