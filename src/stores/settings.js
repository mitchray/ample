import { get, writable } from "svelte/store";
import { persisted } from "svelte-persisted-store";
import { API, SystemPreferences, UserPreferences } from "~/stores/state.js";
import { locale } from "@rgglez/svelte-i18n";
import { setTabulatorLang } from "~/logic/i18n.js";

// our global svelte-persisted-store
export let Settings = persisted("ample-settings", {
    SidebarIsExpanded: true,
    QueueIsOpen: true,
    QueueIsPinned: true,
    PlayerVolume: 50,
    PlayerIsMini: false,
    RepeatState: "disabled",
    GainMode: "smart", // "off" | "track" | "album" | "smart"
    DynamicsCompressorEnabled: false,
    Language: "en",
    SkipBelow: {
        enabled: true,
        rating: "2",
        allowZero: true,
    },
    ShowSongsByOtherArtists: "show",
    PlaySongsByOtherArtists: "include",
    LastSession: {},
    LastLoginMethod: null,
    Crossfade: {
        mode: "gapless",
        duration: 6,
    },
    QueueRefill: {
        enabled: true,
        mode: "mix",
        smartlist: null,
    },
    ArtistReleases: {
        view: "table",
        sort: "year",
        group: "release_type",
        sortReversed: true,
    },
    Theme: {
        mode: "system",
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
            isEnabled: true,
            isSilent: true,
        },
        RatingMissing: {
            isEnabled: true,
            isSilent: true,
        },
        AlternateVersions: {
            isEnabled: false,
            isSilent: true,
        },
        LyricsMissing: {
            isEnabled: true,
            isSilent: true,
        },
        LyricsNotTimestamped: {
            isEnabled: false,
            isSilent: true,
        },
    },
    MusicBrainzFilters: {
        hideMatches: true,
        hideDuplicates: true,
        hideIssues: false,
        hideFlagged: false,
        hideMissing: false,
        hideInfos: false,
        hideVideos: true,
        hideRemixes: false,
        hideLive: false,
        hideInstrumentals: false,
        hideDemos: false,
        hideInterviews: true,
        hideZeroTimes: true,
        hideShortSongs: true,
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
