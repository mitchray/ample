import { getLocaleFromNavigator, init, register } from "svelte-i18n";

export function setupI18n() {
    register("en", () => import("../../languages/en.json"));
    register("en-AU", () => import("../../languages/en-AU.json"));
    register("de", () => import("../../languages/de.json"));

    init({
        fallbackLocale: "en",
        initialLocale: getLocaleFromNavigator(),
    });
}
