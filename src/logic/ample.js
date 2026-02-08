import { get } from "svelte/store";
import DOMPurify from "dompurify";
import { Server } from "~/stores/state.js";

/** Keys allowed from config; unknown keys are ignored */
const ALLOWED_KEYS = new Set(["ampacheURL", "version", "logo", "loginMessage", "guestUserAPIKey"]);

/**
 * Validates that a string is a safe http/https URL (or empty).
 * Rejects javascript:, data:, vbscript:, etc.
 */
function isSafeUrl(value) {
    if (value == null || value === "") return true;
    if (typeof value !== "string") return false;
    const trimmed = String(value).trim();
    try {
        const url = new URL(trimmed, "https://example.com");
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Validates URL for img src: http/https or relative path starting with /
 */
function isSafeImgSrc(value) {
    if (value == null || value === "") return true;
    if (typeof value !== "string") return false;
    if (value.startsWith("/")) return !value.includes("//"); // simple relative path check
    return isSafeUrl(value);
}

/**
 * Sanitizes config values before merging into Server store.
 */
function sanitizeConfig(data) {
    if (!data || typeof data !== "object" || Array.isArray(data)) return {};

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        if (!ALLOWED_KEYS.has(key)) continue;
        if (value == null) continue;

        if (key === "ampacheURL") {
            sanitized[key] = isSafeUrl(value) ? String(value).trim() : null;
        } else if (key === "logo") {
            sanitized[key] = isSafeImgSrc(value) ? String(value).trim() : null;
        } else if (key === "loginMessage") {
            sanitized[key] =
                typeof value === "string"
                    ? DOMPurify.sanitize(value, { ALLOWED_TAGS: ["strong", "em", "b", "i", "br", "p"] })
                    : null;
        } else if (key === "version" || key === "guestUserAPIKey") {
            sanitized[key] = typeof value === "string" ? String(value) : null;
        }
    }
    return sanitized;
}

export async function loadFromConfig() {
    let config = {};

    let prefix = import.meta.env.DEV ? "" : `${import.meta.env.BASE_URL}/`;

    try {
        config = await fetch(`${prefix}config/ample.json`)
            .then((response) => response.json())
            .then((data) => sanitizeConfig(data));
    } catch (e) { }

    Server.set({ ...get(Server), ...config });
}
