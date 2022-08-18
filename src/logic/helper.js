import { get } from "svelte/store";

import { debugMode, serverURL } from '../stores/server';
import { customHue } from "../stores/status";

import JsSHA from "jssha/dist/sha1";
import FastAverageColor from "fast-average-color";
import { rgbToLch } from 'color-converters';

let debugEnabled = get(debugMode);

/**
 * Output debug lines if enabled
 * @param val
 * @param description
 */
export const debugHelper = (val, description = "--") => {
    if (debugEnabled) {
        console.log(description, val);
    }
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Copy of lodash "get", for accessing object properties by dot notation
 * https://gist.github.com/harish2704/d0ee530e6ee75bad6fd30c98e5ad9dab
 * @param object
 * @param keys
 * @param defaultVal
 * @returns {null|*}
 */
export function getProp( object, keys, defaultVal = null ){
    keys = Array.isArray( keys )? keys : keys.split('.');
    object = object[keys[0]];
    if( object && keys.length>1 ){
        return getProp( object, keys.slice(1) );
    }
    return object === undefined? defaultVal : object;
}

export const shuffleArray = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    return arr;
}

/**
 * Format seconds into an hours:mins:secs string
 * @param {number} secs
 * @returns {string}
 */
export const formatTotalTime = (secs) => {
    return new Date(secs * 1000).toISOString().substr(11, 8).replace(/^0+:?0*/, '').replace(/^:/, '0:');
}

/**
 * Format seconds into track length string
 * @param {number} secs
 * @returns {*}
 */
// Courtesy of https://stackoverflow.com/a/37770048
export const formatSongLength = (secs) => {
    return (secs - (secs %= 60)) / 60 + (9 < Math.floor(secs) ? ':' : ':0') + Math.floor(secs);
}

/**
 * Format seconds into readable duration
 * @param {number} secs
 * @returns {*}
 */
// Courtesy of https://stackoverflow.com/a/52387803/4968507
export const formatTimeToReadable = (secs) => {
    secs = Number(secs);
    let d = Math.floor(secs / (3600*24));
    let h = Math.floor(secs % (3600*24) / 3600);
    let m = Math.floor(secs % 3600 / 60);
    let s = Math.floor(secs % 60);

    let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
}

// Courtesy of https://stackoverflow.com/a/23352499
export const timeSince = (timeStamp) => {
    let now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime() ) / 1000;

    if (secondsPast < 60) { // seconds
        // return parseInt(secondsPast) + 's';
        return "<1m";
    }
    if (secondsPast < 3600 * 2) { // minutes, use minutes for the first 2 hours
        return parseInt(secondsPast/60) + 'm';
    }
    if (secondsPast <= 86400) { // hours
        return parseInt(secondsPast/3600) + 'h';
    }
    if (secondsPast > 86400) {
        let day = timeStamp.getDate();
        let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
        let year = timeStamp.getFullYear() === now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
        return day + " " + month + year;
    }
}

/**
 * Generate a random integer
 * @param max
 * @returns {number}
 */
export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Sanitize name by dropping any special characters, as well as leading 'the '
 * @param val
 * @returns {string}
 */
export function sanitizeName(val) {
    return val.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/^the\s/g, "");
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
        get(serverURL) + '/image.php?object_id=0&object_type=album&thumb=10',
        url + '&thumb=10'
    ];

    try {
        for (let i = 0; i < images.length; i++) {
            let img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
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
        console.warn('error during placeholder art check', e);
        return false;
    }
}

/**
 Get dominant color from image
 */
export async function getAverageColor(url) {
    let finalColor;
    const img = new Image();
    const fac = new FastAverageColor();

    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    await img.decode();

    finalColor = fac.getColor(img, {
        ignoredColor: [
            [255, 255, 255, 255, 128], // white, with threshold
            [0, 0, 0, 255, 30] // black, with threshold
        ]
    });

    debugHelper(finalColor, "getAverageColor");

    return finalColor;
}

/**
 * Expects Lch colorArray
 * @param color
 * @returns {boolean}
 */
function colorIsAcceptable(color) {
    // If not enough color
    if (color.chroma < 10) {
        debugHelper(color, "not enough color");
        return false;
    }

    // If too dark
    if (color.lightness < 10) {
        debugHelper(color, "too dark");
        return false;
    }

    return true;
}

/**
 Turn color into legible versions
 */
export async function getCustomHue(color) {
    let theHue;
    let colorArray = [];

    // Convert RGB (normalized to 0-1) to Lch
    let lchColor = rgbToLch([color[0], color[1], color[2]]);

    colorArray.lightness = lchColor[0];
    colorArray.chroma    = lchColor[1];
    colorArray.hue       = lchColor[2];

    if (!colorIsAcceptable(colorArray)) {
        customHue.set(null);
    }

    theHue = colorArray.hue;

    debugHelper(theHue, "customHue");

    customHue.set(theHue);
}

/**
 Test if lyrics are timestamped
 */
export function lyricsAreTimestamped(lyrics) {
    return new RegExp(/\[\d\d:/gi).test(lyrics);
}

/**
 Wait for an element to exist before continuing
 */
export async function waitForElement(selector)  {
    while ( document.querySelector(selector) === null) {
        await new Promise( resolve =>  requestAnimationFrame(resolve) )
    }
    return document.querySelector(selector);
}

export function setIndexes(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].initialOrder = i;
    }

    return items;
}