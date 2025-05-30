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

export function logout() {
    // destroy the session
    get(API).goodbye({ auth: get(User).token });

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

export async function validateSession() {
    if (!get(Server).ampacheURL) {
        logout();
        return;
    }

    let guestUserAPIKey = get(Server).guestUserAPIKey;
    let ampleLastSession = get(Settings).LastSession;

    try {
        API.set(
            new AmpacheAPI({
                url: get(Server).ampacheURL,
                useBearerToken: get(useBearerToken),
                debug: get(debugMode),
            }),
        );

        get(API).setSessionKey(ampleLastSession?.token || guestUserAPIKey);

        let result = await pingWithTimeout(10000);

        if (result.auth) {
            await login({
                auth: ampleLastSession?.token, // result.auth is bugged somehow... returns md5 of username in response
            });
        } else {
            logout();
        }
    } catch (e) {
        console.warn("Unable to validate session", e);
        logout();
    }
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
    get(API)
        .ping({ auth: get(User).token })
        .then((result) => {
            if (!result.auth) {
                logout();
            }
        });
};
