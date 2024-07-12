import { getLocaleFromNavigator, init, register } from "svelte-i18n";
import { TabulatorFull as Tabulator } from "tabulator-tables";

export function setupI18n() {
    register("en", () => import("../../languages/en.json"));
    register("en-AU", () => import("../../languages/en-AU.json"));
    register("ko", () => import("../../languages/ko.json"));
    register("it", () => import("../../languages/it.json"));
    register("hu", () => import("../../languages/hu.json"));
    register("pl", () => import("../../languages/pl.json"));
    register("fr", () => import("../../languages/fr.json"));
    register("pt", () => import("../../languages/pt.json"));
    register("es", () => import("../../languages/es.json"));

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
            actions: "Aktionen",
            "album.name": "Album",
            albumcount: "Albumanzahl",
            albums: "Alben",
            artist: "Interpret",
            artists: "Interpret",
            count: "Anzahl",
            genres: "Genres",
            items: "Artikel",
            name: "Name",
            owner: "Eigentümer",
            playcount: "Wiedergaben",
            published: "Veröffentlicht",
            quality: "Qualität",
            rating: "Bewertung",
            size: "Größe",
            songcount: "Lieder",
            songs: "Lieder",
            state: "Status",
            time: "Länge",
            type: "Typ",
            year: "Jahr",
        },
    },
};
