/** Uppercase each word */
export function formatReleaseType(text) {
    if (!text) return "";

    return text.length <= 3
        ? text.toUpperCase()
        : text.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}

/**
 * Format seconds into an hours:mins:secs string
 * @param {number} secs
 * @returns {string}
 */
export function formatTotalTime(secs) {
    return new Date(secs * 1000)
        .toISOString()
        .substring(11, 19)
        .replace(/^0+:?0*/, "")
        .replace(/^:/, "0:");
}

export function formatFilesize(size) {
    return parseFloat(size / 1e6).toFixed(2) + "MB";
}

export function formatSongQuality(song) {
    let bitrate = parseInt(parseInt(song.bitrate) / 1000);
    let variable = song.mode === "vbr" ? "~" : " ";

    return song.format.toUpperCase() + variable + bitrate;
}

/**
 * Format seconds into readable duration
 * @param {number} secs
 * @returns {*}
 */
// Courtesy of https://stackoverflow.com/a/52387803/4968507
export function formatTimeToReadable(secs) {
    secs = Number(secs);
    let d = Math.floor(secs / (3600 * 24));
    let h = Math.floor((secs % (3600 * 24)) / 3600);
    let m = Math.floor((secs % 3600) / 60);
    let s = Math.floor(secs % 60);

    let dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    let hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    let mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    let sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return (dDisplay + hDisplay + mDisplay + sDisplay).replace(/,\s*$/, "");
}

/**
 * Format seconds into track length string
 * @param {number} secs
 * @returns {*}
 */
// Courtesy of https://stackoverflow.com/a/37770048
export function formatSongLength(secs) {
    return (
        (secs - (secs %= 60)) / 60 +
        (9 < Math.floor(secs) ? ":" : ":0") +
        Math.floor(secs)
    );
}

// Courtesy of https://stackoverflow.com/a/23352499
export function formatTimeSince(timeStamp) {
    let now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

    if (secondsPast < 60) {
        // seconds
        // return parseInt(secondsPast) + 's';
        return "<1m";
    }
    if (secondsPast < 3600 * 2) {
        // minutes, use minutes for the first 2 hours
        return parseInt(secondsPast / 60) + "m";
    }
    if (secondsPast <= 86400) {
        // hours
        return parseInt(secondsPast / 3600) + "h";
    }
    if (secondsPast > 86400) {
        let day = timeStamp.getDate();
        let month = timeStamp
            .toDateString()
            .match(/ [a-zA-Z]*/)[0]
            .replace(" ", "");
        let year =
            timeStamp.getFullYear() === now.getFullYear()
                ? ""
                : " " + timeStamp.getFullYear();
        return day + " " + month + year;
    }
}

/**
 * Sanitize name by dropping any special characters, as well as leading 'the '
 * @param val
 * @returns {string}
 */
export function formatSanitizeName(val) {
    return val
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/^the\s/g, "");
}
