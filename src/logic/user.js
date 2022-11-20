import { get } from 'svelte/store';
import JsSHA from "jssha/dist/sha256";
import { APIVersion, serverURL } from '../stores/server';
import { userName, isLoggedIn, userToken } from '../stores/user';
import { MediaPlayer } from "../stores/player";
import { debugHelper } from './helper';

let serverURL_value = get(serverURL);

/**
 * Make API request for user data
 * @param {string} url
 * @returns {Promise<*>}
 */
const fetchUserData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.user) ? data.user : data[0];
            } else {
                return [];
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

export const getUsers = () => {
    let queryURL = serverURL_value + "/server/json.server.php?action=users";
    queryURL += "&auth=" + get(userToken) + "&version=" + get(APIVersion);
    debugHelper(queryURL, "getUsers");
    return fetchUserData(queryURL);
}

/**
 * Get SHA256 of input as hex string
 * @param {string} text
 * @returns {string}
 */
function getSHA256(text) {
    let shaObj = new JsSHA("SHA-256", "TEXT", { encoding: "UTF8" });
    shaObj.update(text);

    return shaObj.getHash("HEX");
}

/**
 * Handshake with username/password to Ampache server for authentication
 * @param {string} username
 * @param {string} password
 * @returns {string}
 */
export let handshake = async (username, password) => {
    let time = Math.floor(new Date().getTime() / 1000);
    let key = getSHA256(password);
    let passphrase = getSHA256(time + key);

    let fullURL = serverURL_value + "/server/json.server.php?action=handshake&auth=" + passphrase + "&timestamp=" + time + "&version=" + get(APIVersion) + "&user=" + username;

    return await fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            debugHelper(data, "handshake");

            if (data.auth) {
                login(data.auth, username);
                return {
                    status: "success", message: "Login successful"
                }
            } else {
                if (data.error) {
                    return {
                        status: "error", message: data.error.errorMessage
                    }
                } else {
                    return {
                        status: "error", message: "Unknown login error"
                    }
                }
            }
        })
        .catch(err => {
            console.log("Error reading data " + err);
            return {
                status: "error", message: "Login error caught"
            }
        });
}

/**
 * Handshake with API key to Ampache server for authentication
 * @param {string} apikey
 * @returns {Promise<T|{message: string, status: string}>}
 */
export let handshakeAPI = async (apikey) => {
    let fullURL = serverURL_value + "/server/json.server.php?action=handshake&auth=" + apikey + "&version=" + get(APIVersion);

    return await fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            debugHelper(data, "handshakeAPI");

            if (data.auth) {
                login(data.auth);
                localStorage.setItem('AmpleAPIKey', JSON.stringify(apikey));
                return {
                    status: "success", message: "Login successful"
                }
            } else {
                localStorage.setItem('AmpleAPIKey', JSON.stringify(null));

                if (data.error) {
                    return {
                        status: "error", message: data.error.errorMessage
                    }
                } else {
                    return {
                        status: "error", message: "Unknown login error"
                    }
                }
            }
        })
        .catch(err => {
            console.log("Error reading data " + err);
            return {
                status: "error", message: "Login error caught"
            }
        });
}

/**
 * Set all the required data after authentication
 * @param {string} token
 * @param {string} user
 */
export let login = (token, user) => {
    userToken.set(token);

    let userInfo = {
        userName: null,
        userToken: token
    }

    if (user) {
        userName.set(user);
        userInfo.userName = user;
    }

    localStorage.setItem('AmpleAuth', JSON.stringify(userInfo));
    isLoggedIn.set(true);
};

/**
 * Clear all login related data
 */
export let logout = () => {
    localStorage.setItem('AmpleAuth', null);
    localStorage.setItem('AmpleAPIKey', null);
    userName.set(null);
    isLoggedIn.set(false);

    // stop playing
    let mp = get(MediaPlayer);

    if (mp) {
        mp.clearAll();
        mp.next();
    }
};

/**
 * Login with a cached auth
 */
export let validateCachedAuth = async () => {
    // Attempt with an API key first
    let cachedAPIKey = JSON.parse(localStorage.getItem('AmpleAPIKey'));

    if (cachedAPIKey !== null) {
        let result = await handshakeAPI(cachedAPIKey);

        if (result.status !== "success") {
            localStorage.setItem('AmpleAPIKey', null);
            logout();
            return;
        }
    }

    // If not logged in from API key, see if we already have a session going
    if (get(isLoggedIn) !== true) {
        checkExistingSession();
    }
}


/**
 * Check if a cached auth token is still valid
 */
export let checkExistingSession = () => {
    let cachedUserInfo = JSON.parse(localStorage.getItem('AmpleAuth'));
    debugHelper(cachedUserInfo, "cached user info");

    if (cachedUserInfo === null) {
        logout();
        return;
    }

    let fullURL = serverURL_value + "/server/json.server.php?action=ping&auth=" + cachedUserInfo.userToken;

    fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            debugHelper(data, "returned data from attempted auth ping");

            if (data.session_expire) {
                userToken.set(cachedUserInfo.userToken);
                userName.set(cachedUserInfo.userName);
                isLoggedIn.set(true);
            } else {
                logout();
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

/**
 * Ping the server
 */
export let pingServer = (sessionID) => {
    let queryURL = serverURL_value + "/server/json.server.php?action=ping";

    if (sessionID) {
        queryURL += "&auth=" + sessionID;
    }

    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            if (data.session_expire) {
                debugHelper(data, "extending session");
            } else {
                debugHelper(data, "no session_expire, forcing log out");
                logout();
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

/**
 * Extend an existing session by pinging the server
 */
export let extendSession = () => {
    pingServer(get(userToken));
}