import { get, writable } from "svelte/store";
import { API, SystemPreferences, UserPreferences } from "~/stores/state.js";
import { locale } from "svelte-i18n";
import { setTabulatorLang } from "~/logic/i18n.js";

// our global localforage IndexedDB getter/setter, which will be prefixed by the user ID
export let Saved = writable();

export let SidebarIsOpen = writable(true);
export let QueueIsOpen = writable(true);
export let QueueIsPinned = writable(true);

export let PlayerVolume = writable(50);
export let PlayerIsOpen = writable(true);
export let PlayerIsMini = writable(false);
export let RepeatState = writable("disabled");
export let VolumeNormalizationEnabled = writable(true);
export let DynamicsCompressorEnabled = writable(false);

export let QueueRefill = writable({
    enabled: false,
    mode: "smartlist",
    smartlist: null,
});

export let NotificationGainTagsMissing = writable({
    isEnabled: false,
    isSilent: false,
});
export let NotificationRatingMissing = writable({
    isEnabled: false,
    isSilent: false,
});
export let NotificationAlternateVersions = writable({
    isEnabled: false,
    isSilent: false,
});

export let NotificationLyricsMissing = writable({
    isEnabled: false,
    isSilent: false,
});
export let NotificationLyricsNotTimestamped = writable({
    isEnabled: false,
    isSilent: false,
});
export let SkipBelow = writable(false);
export let SkipBelowRating = writable("3");
export let SkipBelowAllowZero = writable(true);
export let Theme = writable({
    mode: null,
    hueBackground: 60,
    hue1: 60,
    hue2: 60,
    colorWave: "hsl(30, 70%, 50%)",
    isGray: true,
});

export let ShowSongsByOtherArtists = writable("show");

export let PlaySongsByOtherArtists = writable("include");

export async function loadSettings() {
    const stores = {
        SidebarIsOpen: SidebarIsOpen,
        QueueIsOpen: QueueIsOpen,
        QueueIsPinned: QueueIsPinned,
        PlayerVolume: PlayerVolume,
        PlayerIsOpen: PlayerIsOpen,
        PlayerIsMini: PlayerIsMini,
        RepeatState: RepeatState,
        VolumeNormalizationEnabled: VolumeNormalizationEnabled,
        DynamicsCompressorEnabled: DynamicsCompressorEnabled,
        QueueRefill: QueueRefill,
        NotificationGainTagsMissing: NotificationGainTagsMissing,
        NotificationRatingMissing: NotificationRatingMissing,
        NotificationAlternateVersions: NotificationAlternateVersions,
        NotificationLyricsMissing: NotificationLyricsMissing,
        NotificationLyricsNotTimestamped: NotificationLyricsNotTimestamped,
        SkipBelow: SkipBelow,
        SkipBelowRating: SkipBelowRating,
        SkipBelowAllowZero: SkipBelowAllowZero,
        Theme: Theme,
        ShowSongsByOtherArtists: ShowSongsByOtherArtists,
        PlaySongsByOtherArtists: PlaySongsByOtherArtists,
    };

    // Load items from Saved for each store
    for (const storeName of Object.keys(stores)) {
        const storedItem = await get(Saved).getItem(storeName);

        if (storedItem !== null) {
            try {
                // Update the store with the saved item
                stores[storeName].set(storedItem);
            } catch (error) {
                console.error(
                    `Error parsing item for store ${storeName}:`,
                    error,
                );
            }
        }
    }

    let systemsPrefsResponse = await get(API).systemPreferences();
    SystemPreferences.set(systemsPrefsResponse.preference);

    let userPrefsResponse = await get(API).userPreferences();
    UserPreferences.set(userPrefsResponse.preference);

    get(Saved)
        ?.getItem("Language")
        .then((lang) => {
            if (lang) {
                locale.set(lang);
                setTabulatorLang(lang);
            }
        });
}
