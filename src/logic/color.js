import { get } from "svelte/store";
import { FastAverageColor } from "fast-average-color";
import { rgbToLch, lchToRgb } from "color-converters";
import { customHue, Theme } from "../stores/status";
import { debugHelper } from "./helper";

/**
 Get dominant color from image
 */
export async function getAverageColor(url) {
    let finalColor = null;
    const img = new Image();
    const fac = new FastAverageColor();

    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
    await img.decode()
        .then(() => {
            finalColor = fac.getColor(img, {
                ignoredColor: [
                    [255, 255, 255, 255, 128], // white, with threshold
                    [0, 0, 0, 255, 30] // black, with threshold
                ]
            });
        })
        .catch((e) => { return null });

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

export async function findCustomHue(color) {
    let theHue;
    let colorArray = {};

    // Convert RGB (normalized to 0-1) to Lch
    let lchColor = rgbToLch([color[0], color[1], color[2]]);

    colorArray.lightness = lchColor[0];
    colorArray.chroma    = lchColor[1];
    colorArray.hue       = lchColor[2];

    theHue = colorArray.hue;

    return theHue;
}

/**
 Turn color into legible versions
 */
export async function setCustomHue(color) {
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
 * Output CSS theme variables into desired selector
 * @param hue {float}
 * @param selector {string}
 * @returns {string}
 */
export function outputThemeVariables(hue, selector) {
    if (get(Theme) === 'light') {
        return `<style>
        ${selector} {
            --color-background:        rgb(${lchToRgb([ 97,  1, hue])});
            --color-header-search:     rgb(${lchToRgb([ 30, 50, hue])});
            --color-header:            rgb(${lchToRgb([ 40, 60, hue])});
            --color-interface:         rgb(${lchToRgb([100,  0, hue])});
            --color-header-primary:    rgb(${lchToRgb([100,  0, hue])});
            --color-border:            rgb(${lchToRgb([ 80, 10, hue])});
            --color-input-border:      rgb(${lchToRgb([ 70, 10, hue])});
            --color-active-background: rgb(${lchToRgb([ 90, 15, hue])});
            --color-shadow-val:            ${lchToRgb([ 50, 20, hue])};
            --color-text-primary:      rgb(${lchToRgb([ 15, 50, hue])});
            --color-text-secondary:    rgb(${lchToRgb([ 60, 25, hue])});
            --color-text-heading:      rgb(${lchToRgb([ 30, 70, hue])});
            --color-icon:              rgb(${lchToRgb([ 50, 50, hue])});
            --color-highlight:         rgb(${lchToRgb([ 50, 60, hue])});
            --color-highlight-alt:     rgb(${lchToRgb([ 70, 100, hue])});
            --color-link-hover:        rgb(${lchToRgb([ 25, 70, hue])});
            --color-card-primary:      rgb(${lchToRgb([100,  0, hue])});
            --color-card-hover:        rgb(${lchToRgb([100,  0, hue])});
            --color-card-highlight:    rgb(${lchToRgb([ 96,  6, hue])});
            --color-mix-background:    rgb(${lchToRgb([ 30, 50, hue])});
            --color-menu-background:   rgb(${lchToRgb([ 97,  1, hue])});
            --color-menu-border:       rgb(${lchToRgb([ 90,  5, hue])});
            --color-genre-background: rgba(${lchToRgb([ 90,  8, hue])}, 0.75);
            --color-genre-text:        rgb(${lchToRgb([ 15, 50, hue])});
            --color-genre-border:      rgb(${lchToRgb([ 80, 10, hue])});
            --color-separator:         rgb(${lchToRgb([ 85, 10, hue])});
            --color-row-hover:         rgb(${lchToRgb([100,  0, hue])});
            --color-row-stripe:        rgb(${lchToRgb([ 98,  5, hue])});
            --color-column-sticky:    rgba(${lchToRgb([100,  0, hue])}, 0.3);
            --color-waveform-progress: rgb(${lchToRgb([ 15, 50, hue])});
            --color-waveform-wave:     rgb(${lchToRgb([ 75, 20, hue])});
            --color-rating:            rgb(${lchToRgb([ 60, 66, 74])});
            --color-favorite:          rgb(${lchToRgb([ 40, 77, 37])});
            --color-regular-foreground:         rgb(${lchToRgb([ 15, 50, hue])});
            --color-regular-foreground-hover:   rgb(${lchToRgb([100,  0, hue])});
            --color-regular-background:         rgb(${lchToRgb([ 15, 50, hue])});
            --color-danger-foreground:          rgb(${lchToRgb([ 40, 50,  25])});
            --color-danger-foreground-hover:    rgb(${lchToRgb([100,  0,  25])});
            --color-danger-background:          rgb(${lchToRgb([ 50, 50,  25])});
            --color-warning-foreground:         rgb(${lchToRgb([ 40, 50,  60])});
            --color-warning-foreground-hover:   rgb(${lchToRgb([100,  0,  60])});
            --color-warning-background:         rgb(${lchToRgb([ 60, 50,  50])});
            --color-primary-foreground:         rgb(${lchToRgb([ 50, 40, 140])});
            --color-primary-foreground-hover:   rgb(${lchToRgb([100,  0, 140])});
            --color-primary-background:         rgb(${lchToRgb([ 60, 40, 140])});
            --color-secondary-foreground:       rgb(${lchToRgb([ 50, 40, 220])});
            --color-secondary-foreground-hover: rgb(${lchToRgb([100,  0, 220])});
            --color-secondary-background:       rgb(${lchToRgb([ 60, 40, 220])});
        }
    </style>`
    }

    if (get(Theme) === 'dark') {
        return `<style>
        ${selector} {
            --color-background:        rgb(${lchToRgb([  4,  4, hue])});
            --color-header-search:     rgb(${lchToRgb([  8,  4, hue])});
            --color-header:            rgb(${lchToRgb([ 12,  4, hue])});
            --color-interface:         rgb(${lchToRgb([  8,  4, hue])});
            --color-header-primary:    rgb(${lchToRgb([ 80,  4, hue])});
            --color-border:            rgb(${lchToRgb([ 20, 10, hue])});
            --color-input-border:      rgb(${lchToRgb([ 30, 10, hue])});
            --color-active-background: rgb(${lchToRgb([ 25, 15, hue])});
            --color-shadow-val:            ${lchToRgb([  0,  0, hue])};
            --color-text-primary:      rgb(${lchToRgb([ 80, 10, hue])});
            --color-text-secondary:    rgb(${lchToRgb([ 60, 10, hue])});
            --color-text-heading:      rgb(${lchToRgb([ 75, 50, hue])});
            --color-icon:              rgb(${lchToRgb([ 70, 40, hue])});
            --color-highlight:         rgb(${lchToRgb([ 70, 70, hue])});
            --color-highlight-alt:     rgb(${lchToRgb([ 70, 70, hue])});
            --color-link-hover:        rgb(${lchToRgb([ 75, 70, hue])});
            --color-card-primary:      rgb(${lchToRgb([ 12,  1, hue])});
            --color-card-hover:        rgb(${lchToRgb([ 15,  3, hue])});
            --color-card-highlight:    rgb(${lchToRgb([ 10,  3, hue])});
            --color-mix-background:    rgb(${lchToRgb([ 10, 40, hue])});
            --color-menu-background:   rgb(${lchToRgb([  4,  4, hue])});
            --color-menu-border:       rgb(${lchToRgb([ 20, 10, hue])});
            --color-genre-background: rgba(${lchToRgb([ 12,  8, hue])}, 0.75);
            --color-genre-text:        rgb(${lchToRgb([ 90, 10, hue])});
            --color-genre-border:      rgb(${lchToRgb([ 30, 10, hue])});
            --color-separator:         rgb(${lchToRgb([ 15, 10, hue])});
            --color-row-hover:         rgb(${lchToRgb([ 15,  5, hue])});
            --color-row-stripe:        rgb(${lchToRgb([ 12,  5, hue])});
            --color-column-sticky:    rgba(${lchToRgb([100,  0, hue])}, 0.03);
            --color-waveform-progress: rgb(${lchToRgb([ 80, 10, hue])});
            --color-waveform-wave:     rgb(${lchToRgb([ 25, 10, hue])});
            --color-rating:            rgb(${lchToRgb([ 80, 100, 85])});
            --color-favorite:          rgb(${lchToRgb([ 55, 80, 37])});
            --color-regular-foreground:         rgb(${lchToRgb([ 90, 20, hue])});
            --color-regular-foreground-hover:   rgb(${lchToRgb([100,  0, hue])});
            --color-regular-background:         rgb(${lchToRgb([ 40, 10, hue])});
            --color-danger-foreground:          rgb(${lchToRgb([ 60, 60,  25])});
            --color-danger-foreground-hover:    rgb(${lchToRgb([100,  0,  25])});
            --color-danger-background:          rgb(${lchToRgb([ 40, 50,  25])});
            --color-warning-foreground:         rgb(${lchToRgb([ 60, 60,  60])});
            --color-warning-foreground-hover:   rgb(${lchToRgb([100,  0,  60])});
            --color-warning-background:         rgb(${lchToRgb([ 50, 60,  60])});
            --color-primary-foreground:         rgb(${lchToRgb([ 70, 60, 140])});
            --color-primary-foreground-hover:   rgb(${lchToRgb([100,  0, 140])});
            --color-primary-background:         rgb(${lchToRgb([ 50, 40, 140])});
            --color-secondary-foreground:       rgb(${lchToRgb([ 70, 50, 220])});
            --color-secondary-foreground-hover: rgb(${lchToRgb([100,  0, 220])});
            --color-secondary-background:       rgb(${lchToRgb([ 50, 40, 220])});
        }
    </style>`
    }
}