import { FastAverageColor } from "fast-average-color";
import { debugHelper } from "./helper";

/**
 Get dominant color from image
 */
export async function getAverageColor(url) {
    let finalColor = null;
    const img = new Image();
    const fac = new FastAverageColor();

    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
    await img
        .decode()
        .then(() => {
            finalColor = fac.getColor(img, {
                ignoredColor: [
                    [255, 255, 255, 255, 128], // white, with threshold
                    [0, 0, 0, 255, 30], // black, with threshold
                ],
            });
        })
        .catch(() => {
            return null;
        });

    debugHelper(finalColor, "getAverageColor");

    return finalColor;
}
