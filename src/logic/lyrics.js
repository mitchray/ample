const lrcLineRegex = /(\[[0-9.:\[\]]*])+(.*)/;
const timeTagRegex = /(?:\[(?:[0-9]+):(?:[0-9.]+)])/;

function lyricsAreTimestamped(lyrics) {
    return new RegExp(/\[\d\d:/gi).test(lyrics);
}

function timestampToSeconds(ts) {
    const split = ts.split(":");
    const minutes = split[0];
    const seconds = split[1];
    return parseInt(minutes, 10) * 60 + parseFloat(seconds);
}

/**
 * Parse raw lyrics string into lines and metadata.
 * @param {string|null} raw - Raw lyrics from API
 * @returns {{ lines: Array<{text: string, startSeconds?: number}>, isTimestamped: boolean, hasLyrics: boolean }}
 */
export function parseLyrics(raw) {
    if (!raw?.length) {
        return { lines: [], isTimestamped: false, hasLyrics: false };
    }

    const isTimestamped = lyricsAreTimestamped(raw);
    const normalized = raw
        .replace(/(<br\s*\/?>\s*)+/gim, "<br>\r\n")
        .replace(/^\[.*\]\s*<br\s?\/?\>\s*$/gim, "");

    let lineStrings = normalized.split(/\r\n/);
    if (isTimestamped) {
        lineStrings = lineStrings.filter((line) => line.match(lrcLineRegex));
    }

    const lines = lineStrings.map((line) => {
        const lineObj = { text: line.replace(timeTagRegex, "").trim() };
        const timeMatch = line.match(timeTagRegex);
        if (timeMatch) {
            const timestamp = timeMatch[0].replace(/[\[\]]/g, "");
            lineObj.startSeconds = timestampToSeconds(timestamp);
        }
        return lineObj;
    });

    return { lines, isTimestamped, hasLyrics: true };
}

/**
 * Get the active line index for the current playback time.
 * @param {Array<{startSeconds?: number}>} lines - Parsed lyrics lines
 * @param {boolean} isTimestamped
 * @param {number} time - Current time in seconds
 * @returns {number|null}
 */
export function getCurrentLineIndex(lines, isTimestamped, time) {
    if (!isTimestamped || !lines?.length) return null;
    for (let i = 0; i < lines.length; i++) {
        if (time >= lines[i].startSeconds) {
            if (
                i + 1 === lines.length ||
                time < lines[i + 1].startSeconds
            ) {
                return i;
            }
        }
    }
    return null;
}

export function secondsToTimestamp(seconds) {
    const milliseconds = seconds * 1000;
    const timestamp = new Date(Date.UTC(0, 0, 0, 0, 0, 0, milliseconds));
    const parts = {
        m: timestamp.getUTCMinutes().toString().padStart(2, "0"),
        s: timestamp.getUTCSeconds().toString().padStart(2, "0"),
        ms: timestamp.getUTCMilliseconds().toString().padStart(3, "0"),
    };
    return `[${parts.m}:${parts.s}.${parts.ms}]`;
}
