import { get } from "svelte/store";
import { Server } from "~/stores/state.js";

export async function loadFromConfig() {
    let config = {};

    let prefix = import.meta.env.DEV ? "" : `${import.meta.env.BASE_URL}/`;

    try {
        config = await fetch(`${prefix}config/ample.json`)
            .then((response) => response.json())
            .then((data) => {
                // console.debug(data, "CONFIG");
                return data;
            });
    } catch (e) {}

    Server.set({ ...get(Server), ...config });
}
