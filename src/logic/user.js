import { get } from "svelte/store";
import AmpacheAPI from "javascript-ampache";
import localforage from "localforage";
import { MediaPlayer } from "~/stores/elements.js";
import { API, APIVersion, debugMode, Server, User } from "~/stores/state.js";
import { Saved } from "~/stores/settings.js";

export async function login({ auth }) {
    get(API).setSessionKey(auth);

    let currentUser = await get(API).user();

    Saved.set(
        localforage.createInstance({
            name: `AmpleUser${currentUser.id}`,
        }),
    );

    User.set({
        ...get(User),
        ...currentUser,
        token: auth,
        isLoggedIn: true,
    });

    await localforage.setItem("AmpleLastSession", {
        token: auth,
        time: Date.now(),
        rememberMe: false,
    });
}

export async function logout() {
    // destroy the session
    await get(API).goodbye({ auth: get(User).token });

    await localforage.removeItem("AmpleLastSession");

    User.set({ ...get(User), isLoggedIn: false });

    // stop playing
    get(MediaPlayer)?.clearAll();

    // TODO stop the web worker
}

export async function validateSession() {
    let newCachedSession = await localforage.getItem("AmpleLastSession");

    if (!get(Server).url) {
        logout();
        return;
    }

    try {
        API.set(
            new AmpacheAPI({ url: get(Server).url, debug: get(debugMode) }),
        );

        let result = await get(API).ping({ auth: newCachedSession?.token });

        if (result.auth) {
            await login({
                auth: result.auth,
            });
        } else {
            logout();
        }
    } catch (e) {
        logout();
    }
}

export async function loginNew({ passphrase = null, username = null }) {
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
        await logout();
    }

    return result;
}

/**
 * Extend an existing session by pinging the server with auth
 */
export let extendSession = () => {
    get(API).ping({ auth: get(User).token });
};
