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
        title: "Missing volume gain tags",
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
        title: "Missing song rating",
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

    let versionText = data.versionsCount !== 1 ? 'versions' : 'version';
    let title = `${data.versionsCount} alternate ${versionText} found`;

    let settings = {
        title: title,
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
        title: "Missing lyrics",
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
        title: "Lyrics not timestamped",
        type: "lyricsMissingTimestamps",
        style: "warning",
        data: data
    }

    addNotification(settings);
}