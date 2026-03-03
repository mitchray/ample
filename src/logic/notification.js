import { _ } from "@rgglez/svelte-i18n";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { API } from "~/stores/state";
import { Notifications } from "~/stores/message";
import { Settings } from "~/stores/settings.svelte.js";

export function addNotification(settings) {
    settings.id = uuidv4();
    settings.time = new Date().toLocaleTimeString();
    settings.fresh = true;

    Notifications.set([settings, ...get(Notifications)]);
}

export function removeNotification(id) {
    let notifications = get(Notifications);

    // get position of ID
    let foundIndex = notifications.findIndex((element) => element.id === id);

    if (foundIndex !== -1) {
        notifications.splice(foundIndex, 1);

        Notifications.set([...notifications]);
    }
}

export function addGainTagsMissingNotification(data) {
    if (!Settings.current.Notifications.GainTagsMissing.isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationGainTagsMissing"),
        type: "gainTagsMissing",
        style: "warning",
        data: data,
        isSilent: Settings.current.Notifications.GainTagsMissing.isSilent,
    };

    addNotification(settings);
}

export function addRatingMissingNotification(data) {
    if (!Settings.current.Notifications.RatingMissing.isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationRatingMissing"),
        type: "ratingMissing",
        style: "warning",
        data: data,
        isSilent: Settings.current.Notifications.RatingMissing.isSilent,
    };

    get(API)
        .song({ filter: data.id })
        .then((result) => {
            if (result?.id && !result?.rating) {
                addNotification(settings);
            }
        });
}

export function addAlternateVersionsNotification(data) {
    if (!Settings.current.Notifications.AlternateVersions.isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationAlternateVersions", {
            values: { versionCount: data.versionsCount },
        }),
        type: "alternateVersions",
        style: "info",
        data: data,
        isSilent: Settings.current.Notifications.AlternateVersions.isSilent,
    };

    addNotification(settings);
}

export function addLyricsMissingNotification(data) {
    if (!Settings.current.Notifications.LyricsMissing.isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsMissing"),
        type: "lyricsMissing",
        style: "warning",
        data: data,
        isSilent: Settings.current.Notifications.LyricsMissing.isSilent,
    };

    addNotification(settings);
}

export function addLyricsNotTimestampedNotification(data) {
    if (!Settings.current.Notifications.LyricsNotTimestamped.isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsNotTimestamped"),
        type: "lyricsMissingTimestamps",
        style: "warning",
        data: data,
        isSilent: Settings.current.Notifications.LyricsNotTimestamped.isSilent,
    };

    addNotification(settings);
}
