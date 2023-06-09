import { _ } from 'svelte-i18n';
import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { API } from "../stores/api";
import { NotificationsList } from '../stores/message';
import {
    ShowNotificationRatingMissing,
    ShowNotificationGainTagsMissing,
    ShowNotificationAlternateVersions,
    ShowNotificationLyricsMissing,
    ShowNotificationLyricsNotTimestamped,
} from '../stores/status';

export const addNotification = (settings) => {
    settings.id    = uuidv4();
    settings.time  = new Date().toLocaleTimeString();
    settings.fresh = true

    NotificationsList.set(
        [
            settings,
            ...get(NotificationsList)
        ]
    );
}

export const removeNotification = (id) => {
    let notifications  = get(NotificationsList);

    // get position of ID
    let foundIndex = notifications.findIndex(element => element.id === id);

    if (foundIndex !== -1) {
        notifications.splice(foundIndex, 1);

        NotificationsList.set(
            [
                ...notifications
            ]
        );
    }
}

export const addGainTagsMissingNotification = (data) => {
    if (!get(ShowNotificationGainTagsMissing) || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationGainTagsMissing"),
        type: "gainTagsMissing",
        style: "warning",
        data: data
    }

    addNotification(settings);
}

export const addRatingMissingNotification = (data) => {
    if (!get(ShowNotificationRatingMissing) || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationRatingMissing"),
        type: "ratingMissing",
        style: "warning",
        data: data
    }

    get(API).song({ filter: data.id })
        .then(result => {
            if (result?.id && !result?.rating) {
                addNotification(settings);
            }
        });
}

export const addAlternateVersionsNotification = (data) => {
    if (!get(ShowNotificationAlternateVersions) || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationAlternateVersions", { values: { versionCount: data.versionsCount } }),
        type: "alternateVersions",
        style: "info",
        data: data
    }

    addNotification(settings);
}

export const addLyricsMissingNotification = (data) => {
    if (!get(ShowNotificationLyricsMissing) || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsMissing"),
        type: "lyricsMissing",
        style: "warning",
        data: data
    }

    addNotification(settings);
}

export const addLyricsNotTimestampedNotification = (data) => {
    if (!get(ShowNotificationLyricsNotTimestamped) || !data) {
        return;
    }

    let settings = {
        title: get(_)("text.notificationLyricsNotTimestamped"),
        type: "lyricsMissingTimestamps",
        style: "warning",
        data: data
    }

    addNotification(settings);
}