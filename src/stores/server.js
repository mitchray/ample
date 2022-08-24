import { readable, writable, derived } from 'svelte/store';

// Debug toggle for development
export let debugMode = writable(false);

// Attempt to obtain the Ampache server installation based on requested path
let detectedPathname = (window.location.pathname).split(/\/ample/)[0];
let detectedURL = (window.location.origin + detectedPathname);

export let APIVersion = writable("5.5.1");

export const serverURL = readable(detectedURL, function start(set) {
    // local testing override
    // detectedURL = "http://ampache-preview";

    // stable demo server override
    // detectedURL = "https://demo.ampache.dev";

    // develop demo server override
    // detectedURL = "https://develop.ampache.dev";

    set(detectedURL);
    return function stop() {};
});

export const serverPathname = readable(detectedPathname, function start(set) {
    set(detectedPathname);
    return function stop() {};
});

export let serverVersion = writable('');

export let serverTotals = writable([]);

export let allArtists = writable({});
export let artistIndex = derived(
    allArtists,
    $allArtists => {
        if ($allArtists.loaded) {
            let usedChars = new Map();

            // Add a catchall for numbers and non-word chars
            usedChars.set("#", []);

            // find unique starting characters
            for (let i = 0; i < $allArtists.data.length; i++) {
                let char = $allArtists.data[i].name.charAt(0).toLowerCase();

                // if digit or non-word char, skip adding to map
                if (/^((\d|\W))/i.test(char)) {
                    continue;
                }

                if (!usedChars.get(char)) {
                    usedChars.set(char, []);
                }
            }


            // work out counts for artists and album artists
            usedChars.forEach((value, key) => {
                let artistCount;

                let code = key.replaceAll("#", "(\\d|\\W)");

                artistCount = $allArtists.data.filter(function(a) {
                    let regex = new RegExp("^" + code, "i");
                    return regex.test(a.name);
                });

                usedChars.set(key, {artistCount: artistCount.length});
            });

            let sorted = new Map([...usedChars.entries()].sort());

            return sorted;
        }
    }
);

export let allAlbums = writable({});
export let albumIndex = derived(
    allAlbums,
    $allAlbums => {
        if ($allAlbums.loaded) {
            let usedChars = new Map();

            // Add a catchall for numbers and non-word chars
            usedChars.set("#", []);

            // find unique starting characters
            for (let i = 0; i < $allAlbums.data.length; i++) {
                let char = $allAlbums.data[i].name.charAt(0).toLowerCase();

                // if digit or non-word char, skip adding to map
                if (/^((\d|\W))/i.test(char)) {
                    continue;
                }

                if (!usedChars.get(char)) {
                    usedChars.set(char, []);
                }
            }


            // work out counts for artists and album artists
            usedChars.forEach((value, key) => {
                let albumCount;

                let code = key.replaceAll("#", "(\\d|\\W)");

                albumCount = $allAlbums.data.filter(function(a) {
                    let regex = new RegExp("^" + code, "i");
                    return regex.test(a.name);
                });

                usedChars.set(key, {albumCount: albumCount.length});
            });

            let sorted = new Map([...usedChars.entries()].sort());

            return sorted;
        }
    }
);