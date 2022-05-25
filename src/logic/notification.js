import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { getSong } from "./song";
import { NotificationsList } from '../stores/notification';
import {
    ShowNotificationRatingMissing,
    ShowNotificationGainTagsMissing,
    ShowNotificationAlternateVersions
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
    if (!get(ShowNotificationGainTagsMissing)) {
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
    if (!get(ShowNotificationRatingMissing)) {
        return;
    }

    let settings = {
        title: "Missing rating",
        type: "ratingMissing",
        style: "warning",
        data: data
    }

    let song = Promise.resolve([]);

    song = getSong(data.id)
        .then((result) => {
            if (!result.error && result.length > 0 && !result[0].rating) {
                addNotification(settings);
            }
        });
}

export const addAlternateVersionsNotification = (data) => {
    if (!get(ShowNotificationAlternateVersions)) {
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