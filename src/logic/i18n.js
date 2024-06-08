import { getLocaleFromNavigator, init, register } from "svelte-i18n";
import { TabulatorFull as Tabulator } from "tabulator-tables";

export function setupI18n() {
    register("en", () => import("../../languages/en.json"));
    register("en-AU", () => import("../../languages/en-AU.json"));
    register("de", () => import("../../languages/de.json"));

    init({
        fallbackLocale: "en",
        initialLocale: getLocaleFromNavigator(),
    });
}

export function setTabulatorLang(lang) {
    let tabulators = Tabulator.findTable(".tabulator");

    if (tabulators) {
        tabulators.forEach((table) => {
            table.setLocale(lang.toLowerCase());
        });
    }
}

export const tabulatorStrings = {
    en: {},
    "en-us": {},
    "en-au": {},
    de: {
        columns: {
            album: "ALBUMBRAU",
        },
    },
};
