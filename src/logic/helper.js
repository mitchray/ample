import { _ } from "svelte-i18n";
import { get } from "svelte/store";
import { addAlert } from "~/logic/alert";
import { debugMode, Server } from "~/stores/state.js";
import { Settings } from "~/stores/settings";
import { v4 as uuidv4 } from "uuid";
import JsSHA from "jssha/dist/sha1";

let debugEnabled = get(debugMode);

/**
 * Output debug lines if enabled
 * @param val
 * @param description
 */
export function debugHelper(val, description = "--") {
    if (debugEnabled) {
        console.log(description, val);
    }
}

export function errorHandler(description, err) {
    if (err.errorCode && err.errorCode === 4701) {
        console.debug("ERROR 4701");
    }

    console.error("Ample error: " + description, err.error);
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffleArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}

/**
 * Generate a random integer
 * @param max
 * @returns {number}
 */
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export function truncateDecimals(num) {
    return num % 1 === 0 ? num : parseFloat(num.toFixed(2));
}

/**
 Get hash of image and compare it to the placeholder art
 Based on https://stackoverflow.com/a/16566198/4968507
 */
export async function placeholderArtCheck(url) {
    // Calculate placeholder hash each time as canvas results can and do differ
    // across sessions, making it impractical to hardcode results
    let results = [];
    let images = [
        get(Server).ampacheURL +
            "/image.php?object_id=0&object_type=album&thumb=10",
        url + "&thumb=10",
    ];

    try {
        for (let i = 0; i < images.length; i++) {
            let img = new Image();
            img.setAttribute("crossOrigin", "anonymous");
            img.src = images[i];
            await img.decode(); // this is key as it waits until the image is ready

            let canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            let dataURL = canvas.toDataURL("image/png");
            let shaObj = new JsSHA("SHA-1", "TEXT", { encoding: "UTF8" });
            shaObj.update(dataURL);

            let backgroundHash = shaObj.getHash("HEX");
            results[i] = backgroundHash;

            debugHelper(backgroundHash, "placeholderArtCheck");
        }

        return results[0] !== results[1];
    } catch (e) {
        console.warn("error during placeholder art check", e);
        return false;
    }
}

/**
 Test if lyrics are timestamped
 */
export function lyricsAreTimestamped(lyrics) {
    return new RegExp(/\[\d\d:/gi).test(lyrics);
}

export function setIndexes(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].initialOrder = i;
    }

    return items;
}

export function getPlaylistIDFromUrl() {
    let urlParts = location.href.split("/"); // 'location' is inherited from Router automatically
    return urlParts.pop() || urlParts.pop(); // trick to handle potential trailing slash
}

/**
 * Filter out songs below a specified rating
 * @param {array} arr
 * @returns array
 */
export function filterBelow(arr) {
    let originalCount = arr.length;

    // if length is 1 let's assume we want to play that item regardless of rating
    if (arr.length > 1 && get(Settings).SkipBelow.enabled) {
        arr = arr.filter(
            (item) => item.rating >= get(Settings).SkipBelow.rating,
        );
    }

    let filteredCount = originalCount - arr.length;

    if (filteredCount > 0) {
        addAlert({
            title: get(_)("text.skippedItemsBelow", {
                values: {
                    itemCount: filteredCount,
                    starCount: get(Settings).SkipBelow.rating,
                },
            }),
            style: "info",
        });
    }

    return arr;
}

/**
 * Replace spaces in a string with hyphens
 * @param {string} input
 * @returns string
 */
export function replaceSpacesWithHyphens(input) {
    return input?.replace(/ /g, "-");
}

/**
 * Prepare for Genius URL (spaces to hyphens and remove special chars)
 * @param {string} input
 * @returns string
 */
export function formatForGenius(input) {
    input = input?.replace(/[^a-zA-Z0-9 -]/g, "");

    return replaceSpacesWithHyphens(input);
}

export function prepareForQueue(arr) {
    const propertiesToKeep = [
        //common
        "id",
        "name",
        "title",
        "art",
        "object_type",
        "rating",
        "averagerating",
        "flag",
        "url",

        //song
        "album",
        "artist",
        "artists",
        "year",
        "r128_track_gain",
        "replaygain_track_gain",
        "time",

        //podcast
        "podcast",

        //radio
        "site_url",
    ];

    arr = arr.reduce((acc, obj) => {
        const newObj = {};
        propertiesToKeep.forEach((prop) => {
            if (obj.hasOwnProperty(prop)) {
                newObj[prop] = obj[prop];
            }
        });
        acc.push(newObj);
        return acc;
    }, []);

    // assign object_type and _id
    for (let i = 0; i < arr.length; i++) {
        let objectType = "song";

        if (arr[i].podcast?.id) {
            objectType = "podcast_episode";
        }

        if (arr[i].site_url) {
            objectType = "live_stream";
        }

        arr[i].object_type = objectType;

        arr[i]._id = uuidv4();
    }

    return arr;
}

export async function trimCache() {
    const maxItems = 20;

    const cache = await caches.open("audio-cache");
    const requests = await cache.keys();
    if (requests.length > maxItems) {
        for (let i = 0; i < requests.length - maxItems; i++) {
            await cache.delete(requests[i]);
        }
    }
}

export function clearCache() {
    caches.keys().then((keys) => {
        for (const key of keys) {
            if (key === "audio-cache") {
                void caches.delete(key);
            }
        }
    });
}
