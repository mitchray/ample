import { get, writable } from "svelte/store";
import { API, CurrentMedia } from "~/stores/state.js";
import { lyricsAreTimestamped } from "./helper";
import {
    addLyricsMissingNotification,
    addLyricsNotTimestampedNotification,
} from "~/logic/notification.js";

class Lyrics {
    constructor() {
        this.currentLine = 0;
        this.lyricsRaw = "";
        this.lyricsProcessed = "";
        this.lyricsByLine = [];
        this.lyricsFinal = [];
        this.isTimestamped = false;
        this.API = get(API);

        CurrentMedia.subscribe(async (value) => {
            this.currentMedia = value;

            await this.setLyrics();
        });

        this._store = writable(this);
    }

    subscribe(subscriber) {
        return this._store.subscribe(subscriber);
    }

    async getLyrics() {
        if (this.currentMedia?.object_type !== "song") return null;
        let song = await this.API.song({ filter: this.currentMedia?.id });
        return song?.lyrics;
    }

    async setLyrics() {
        if (this.currentMedia) {
            this.lyricsRaw = await this.getLyrics();

            this.lyricsFinal = [];

            this.currentLine = null;
            this._store.set(this);

            this.parseLyrics();
        }
    }

    parseLyrics() {
        let tagRegex = /\[([a-z]+):(.*)].*/;
        let lrcAllRegex = /(\[[0-9.:\[\]]*])+(.*)/;
        let timeRegex = /(?:\[(?:[0-9]+):(?:[0-9.]+)])/;
        let textRegex = /(?:\[(?:[0-9]+):(?:[0-9.]+)])?(.*)/;

        if (!this.lyricsRaw) {
            this.lyricsFinal = [];
            return;
        }

        this.isTimestamped = lyricsAreTimestamped(this.lyricsRaw);

        // always need to format the line breaks properly
        this.lyricsProcessed = this.lyricsRaw.replace(
            /(<br\s*\/?>\s*)+/gim,
            "<br>\r\n",
        );

        // strip any blank lines, including 'empty' timestamps
        this.lyricsProcessed = this.lyricsProcessed.replace(
            /^\[.*\]\s*<br\s?\/?\>\s*$/gim,
            "",
        );

        this.lyricsByLine = this.lyricsProcessed.split(/\r\n/);

        for (let i = this.lyricsByLine.length - 1; i >= 0; i--) {
            let thisLine = {
                current: false,
            };

            // remove non-timestamped lines
            if (
                this.isTimestamped &&
                !this.lyricsByLine[i].match(lrcAllRegex)
            ) {
                this.lyricsByLine.splice(i, 1);
                continue;
            }

            // get text
            thisLine.text = this.lyricsByLine[i].replace(timeRegex, "");

            // get time
            if (timeRegex.test(this.lyricsByLine[i])) {
                thisLine.timestamp = this.lyricsByLine[i]
                    .match(timeRegex)[0]
                    .replace(/[\[\]]/g, "");
                thisLine.startSeconds = this.timestampToSeconds(
                    thisLine.timestamp,
                );
            }

            // finally, push to the final lyrics object
            this.lyricsFinal.push(thisLine);
        }

        this.checkLyrics();

        this.lyricsFinal.reverse();
    }

    hasLyrics() {
        return this.lyricsFinal.length > 0;
    }

    checkLyrics() {
        // notify if missing lyrics
        if (this.currentMedia.object_type === "song" && !this.hasLyrics()) {
            addLyricsMissingNotification(this.currentMedia);
        }

        // notify if lyrics are not timestamped
        if (this.hasLyrics() && !lyricsAreTimestamped(this.lyricsRaw)) {
            addLyricsNotTimestampedNotification(this.currentMedia);
        }
    }

    timestampToSeconds(ts) {
        let split = ts.split(":");
        let minutes = split[0];
        let seconds = split[1];

        return parseInt(minutes, 10) * 60 + parseFloat(seconds);
    }

    secondsToTimestamp(seconds) {
        let milliseconds = seconds * 1000;
        let timestamp = new Date(Date.UTC(0, 0, 0, 0, 0, 0, milliseconds));
        let parts = {
            m: timestamp.getUTCMinutes().toString().padStart(2, "0"),
            s: timestamp.getUTCSeconds().toString().padStart(2, "0"),
            ms: timestamp.getUTCMilliseconds().toString().padStart(3, "0"),
        };

        return `[${parts.m}:${parts.s}.${parts.ms}]`;
    }

    move(time) {
        if (this.isTimestamped) {
            for (let i = 0; i < this.lyricsFinal.length; i++) {
                if (time >= this.lyricsFinal[i].startSeconds) {
                    // if last item, or less than next item
                    if (
                        i + 1 === this.lyricsFinal.length ||
                        time < this.lyricsFinal[i + 1].startSeconds
                    ) {
                        this.currentLine = i;
                        this._store.set(this);
                        return;
                    }
                }
            }
        }
    }
}

export default Lyrics;
