import { get } from 'svelte/store';
import JsSHA from "jssha/dist/sha256";
import { APIVersion, serverURL, serverTotals } from '../stores/server';
import { userName, isLoggedIn, userToken } from '../stores/user';
import { debugHelper } from './helper';

let serverURL_value = get(serverURL);

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
 * @returns {Promise<void>}
 */
export let handshake = async (username, password) => {
    let time = Math.floor(new Date().getTime() / 1000);
    let key = getSHA256(password);
    let passphrase = getSHA256(time + key);

    let fullURL = serverURL_value + "/server/json.server.php?action=handshake&auth=" + passphrase + "&timestamp=" + time + "&version=" + get(APIVersion) + "&user=" + username;

    let result = await fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            debugHelper(data, "handshake");
            serverTotals.set(data);

            if (data.auth) {
                login(data.auth, username);
                return 'Login successful';
            } else {
                if (data.error) {
                    return data.error.errorMessage;
                } else {
                    return 'Unknown login error';
                }
            }
        })
        .catch(err => {
            console.log("Error reading data " + err);
            return err;
        });

    return result;
}

/**
 * Handshake with API key to Ampache server for authentication
 * @param {string} apikey
 * @returns {Promise<void>}
 */
export let handshakeAPI = async (apikey) => {
    let fullURL = serverURL_value + "/server/json.server.php?action=handshake&auth=" + apikey + "&version=" + get(APIVersion);

    let result = await fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            debugHelper(data, "handshakeAPI");

            serverTotals.set(data);

            if (data.auth) {
                login(data.auth);
                return 'Login successful';
            } else {
                if (data.error) {
                    return data.error.errorMessage;
                } else {
                    return 'Unknown login error';
                }
            }
        })
        .catch(err => {
            console.log("Error reading data " + err);
            return err;
        });

    return result;
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
    userName.set(null);
    isLoggedIn.set(false);
};

/**
 * Check if our auth token is still valid
 */
export let validateAuthToken = () => {
    let cachedUserInfo = JSON.parse(localStorage.getItem('AmpleAuth'));

    if (cachedUserInfo === null) {
        logout();
        return;
    }

    let fullURL = serverURL_value + "/server/json.server.php?action=ping&auth=" + cachedUserInfo.userToken;

    fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            serverTotals.set(data);

            if (data.session_expire) {
                userToken.set(cachedUserInfo.userToken);
                userName.set(cachedUserInfo.userName);
                isLoggedIn.set(true);
            } else {
                logout();
            }

            APIVersion.set(data.version);
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
    let fullURL = serverURL_value + "/server/json.server.php?action=ping&auth=" +  get(userToken);

    fetch(fullURL)
        .then(response => response.json())
        .then(data => {
            serverTotals.set(data);

            if (data.session_expire) {
            } else {
                logout();
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}