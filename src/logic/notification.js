import { _ } from "svelte-i18n";
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { API } from "~/stores/state";
import { Notifications } from "~/stores/message";
import {
    NotificationRatingMissing,
    NotificationGainTagsMissing,
    NotificationLyricsMissing,
    NotificationLyricsNotTimestamped,
    NotificationAlternateVersions,
} from "~/stores/settings";

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
    if (!get(NotificationGainTagsMissing).isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationGainTagsMissing"),
        type: "gainTagsMissing",
        style: "warning",
        data: data,
        isSilent: get(NotificationGainTagsMissing).isSilent,
    };

    addNotification(settings);
}

export function addRatingMissingNotification(data) {
    if (!get(NotificationRatingMissing).isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationRatingMissing"),
        type: "ratingMissing",
        style: "warning",
        data: data,
        isSilent: get(NotificationRatingMissing).isSilent,
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
    if (!get(NotificationAlternateVersions).isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationAlternateVersions", {
            values: { versionCount: data.versionsCount },
        }),
        type: "alternateVersions",
        style: "info",
        data: data,
        isSilent: get(NotificationAlternateVersions).isSilent,
    };

    addNotification(settings);
}

export function addLyricsMissingNotification(data) {
    if (!get(NotificationLyricsMissing).isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsMissing"),
        type: "lyricsMissing",
        style: "warning",
        data: data,
        isSilent: get(NotificationLyricsMissing).isSilent,
    };

    addNotification(settings);
}

export function addLyricsNotTimestampedNotification(data) {
    if (!get(NotificationLyricsNotTimestamped).isEnabled || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsNotTimestamped"),
        type: "lyricsMissingTimestamps",
        style: "warning",
        data: data,
        isSilent: get(NotificationLyricsNotTimestamped).isSilent,
    };

    addNotification(settings);
}
