import { get } from "svelte/store";
import { v4 as uuidv4 } from "uuid";
import { API } from "../stores/api";
import { AlertsList } from '../stores/message';

export const addAlert = ({ title, style, message = null }) => {
    let settings = {};
    settings.title = title;
    settings.style = style;
    settings.message = message;
    settings.id    = uuidv4();
    settings.time  = new Date().toLocaleTimeString();
    settings.fresh = true

    AlertsList.set(
        [
            settings,
            ...get(AlertsList)
        ]
    );
}

export const removeAlert = (id) => {
    let alerts = get(AlertsList);

    // get position of ID
    let foundIndex = alerts.findIndex(element => element.id === id);

    if (foundIndex !== -1) {
        alerts.splice(foundIndex, 1);

        AlertsList.set(
            [
                ...alerts
            ]
        );
    }
}
