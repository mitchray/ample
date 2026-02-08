import { get } from "svelte/store";
import AmpacheAPI from "javascript-ampache";
import { MediaPlayer } from "~/stores/elements.js";
import {
    API,
    APIVersion,
    debugMode,
    Server,
    useBearerToken,
    User,
} from "~/stores/state.js";
import { Settings } from "~/stores/settings.js";

export async function login({ auth }) {
    get(API).setSessionKey(auth);

    let currentUser = await get(API).user();

    User.set({
        ...get(User),
        ...currentUser,
        token: auth,
        isLoggedIn: true,
    });

    Settings.update((x) => ({
        ...x,
        LastSession: {
            token: auth,
            time: Date.now(),
            rememberMe: false,
        },
    }));
}

/**
 * Session valid if auth present and no error in response.
 */
function isSessionValid(result) {
    return !result?.error && !!result?.auth;
}

export function logout() {
    console.warn("[logout] called", new Error().stack);

    // destroy the session
    const token = get(User).token;
    if (token) {
        get(API).goodbye({ auth: token });
    }

    Settings.update((x) => ({
        ...x,
        LastSession: null,
    }));

    User.set({ ...get(User), isLoggedIn: false });

    // stop playing
    get(MediaPlayer)?.clearAll();
}

export async function pingWithTimeout(timeout = 5000) {
    return Promise.race([
        get(API).ping(),
        new Promise((_, reject) =>
            setTimeout(
                () =>
                    reject(
                        new Error(
                            "Request timed out, could not ping the server",
                        ),
                    ),
                timeout,
            ),
        ),
    ]);
}

const VALIDATE_RETRIES = 2;
const VALIDATE_RETRY_DELAY_MS = 1000;

export async function validateSession() {
    if (!get(Server).ampacheURL) {
        logout();
        return;
    }

    let guestUserAPIKey = get(Server).guestUserAPIKey;
    let ampleLastSession = get(Settings).LastSession;
    let finalToken = ampleLastSession?.token || guestUserAPIKey;

    if (!finalToken) {
        logout();
        return;
    }

    API.set(
        new AmpacheAPI({
            url: get(Server).ampacheURL,
            useBearerToken: get(useBearerToken),
            debug: get(debugMode),
        }),
    );
    get(API).setSessionKey(finalToken);

    let lastError;
    for (let attempt = 0; attempt <= VALIDATE_RETRIES; attempt++) {
        try {
            let result = await pingWithTimeout(10000);

            if (isSessionValid(result)) {
                await login({
                    auth: finalToken,
                });
                return;
            }

            logout();
            return;
        } catch (e) {
            lastError = e;
            console.warn(`Unable to validate session (attempt ${attempt + 1}/${VALIDATE_RETRIES + 1})`, e);

            if (attempt < VALIDATE_RETRIES) {
                await new Promise((r) => setTimeout(r, VALIDATE_RETRY_DELAY_MS));
            }
        }
    }

    console.warn("All validation retries failed", lastError);
    logout();
}

export async function attemptLogin({ passphrase = null, username = null }) {
    let result;

    // if username, attempt login with username/password
    if (username) {
        let time = Math.floor(new Date().getTime() / 1000);
        let encryptedPassword = get(API).encryptPassword({
            password: passphrase,
            time: time,
        });

        result = await get(API).handshake({
            auth: encryptedPassword,
            user: username,
            timestamp: time,
            version: get(APIVersion),
        });
    } else {
        result = await get(API).handshake({
            auth: passphrase,
            version: get(APIVersion),
        });
    }

    if (result.auth) {
        await login({ auth: result.auth, username: username });
    } else {
        logout();
    }

    return result;
}

/**
 * Extend an existing session by pinging the server with auth
 */
export let extendSession = () => {
    pingWithTimeout(8000)
        .then((result) => {
            if (!isSessionValid(result)) {
                console.warn("[extendSession] Session invalid, logging out", result);
                logout();
            }
        })
        .catch((e) => {
            console.warn("[extendSession] Ping failed, keeping session (network error)", e);
        });
};
