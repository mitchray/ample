const migrations = [
    {
        version: "3.5.0",
        migrate: async () => {
            // migrate indexedDB AmpleUser1 (presumably the sole admin account in most cases)

            const DB_NAME = "AmpleUser1";
            const STORE_NAME = "keyvaluepairs";
            const LOCAL_STORAGE_KEY = "ample-settings-test";

            function readAllDataFromIndexedDB(dbName, storeName) {
                return new Promise((resolve, reject) => {
                    const request = indexedDB.open(dbName);

                    request.onerror = () => reject(request.error);
                    request.onsuccess = () => {
                        const db = request.result;
                        const transaction = db.transaction(
                            storeName,
                            "readonly",
                        );
                        const store = transaction.objectStore(storeName);
                        const data = {};

                        const cursorRequest = store.openCursor();

                        cursorRequest.onsuccess = (event) => {
                            const cursor = event.target.result;
                            if (cursor) {
                                data[cursor.key] = cursor.value; // Add key-value pair to the data object
                                cursor.continue();
                            } else {
                                resolve(data); // Resolve when all entries are processed
                            }
                        };

                        cursorRequest.onerror = () =>
                            reject(cursorRequest.error);
                    };
                    request.onupgradeneeded = () => {
                        reject(
                            new Error(
                                `Database or store not found: ${storeName}`,
                            ),
                        );
                    };
                });
            }

            function saveToLocalStorage(key, data) {
                try {
                    localStorage.setItem(key, JSON.stringify(data));
                } catch (error) {
                    console.error(
                        "Failed to save data to localStorage:",
                        error,
                    );
                }
            }

            async function convertIndexedDBToLocalStorage() {
                try {
                    const data = await readAllDataFromIndexedDB(
                        DB_NAME,
                        STORE_NAME,
                    );
                    saveToLocalStorage(LOCAL_STORAGE_KEY, data);
                } catch (error) {
                    console.error("Error during conversion:", error);
                }
            }

            // Call the conversion function
            await convertIndexedDBToLocalStorage();

            let settings, consolidated;

            /**
             * Skip below options consolidated
             */
            settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

            consolidated = {
                enabled: settings.SkipBelow || false,
                allowZero: settings.SkipBelowAllowZero || false,
                rating: settings.SkipBelowRating || 3,
            };

            // add new temp key
            settings["SkipBelowNew"] = consolidated;

            // remove old
            delete settings["SkipBelow"];
            delete settings["SkipBelowAllowZero"];
            delete settings["SkipBelowRating"];

            // rename temp
            settings["SkipBelow"] = settings["SkipBelowNew"];
            delete settings["SkipBelowNew"];

            // save
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));

            /**
             * Notifications consolidated
             */
            settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

            consolidated = {
                GainTagsMissing: {
                    isEnabled:
                        settings.NotificationGainTagsMissing.isEnabled || false,
                    isSilent:
                        settings.NotificationGainTagsMissing.isSilent || false,
                },
                RatingMissing: {
                    isEnabled:
                        settings.NotificationRatingMissing.isEnabled || false,
                    isSilent:
                        settings.NotificationRatingMissing.isSilent || false,
                },
                AlternateVersions: {
                    isEnabled:
                        settings.NotificationAlternateVersions.isEnabled ||
                        false,
                    isSilent:
                        settings.NotificationAlternateVersions.isSilent ||
                        false,
                },
                LyricsMissing: {
                    isEnabled:
                        settings.NotificationLyricsMissing.isEnabled || false,
                    isSilent:
                        settings.NotificationLyricsMissing.isSilent || false,
                },
                LyricsNotTimestamped: {
                    isEnabled:
                        settings.NotificationLyricsNotTimestamped.isEnabled ||
                        false,
                    isSilent:
                        settings.NotificationLyricsNotTimestamped.isSilent ||
                        false,
                },
            };

            // add new key
            settings["Notifications"] = consolidated;

            // remove old
            delete settings["NotificationGainTagsMissing"];
            delete settings["NotificationRatingMissing"];
            delete settings["NotificationAlternateVersions"];
            delete settings["NotificationLyricsMissing"];
            delete settings["NotificationLyricsNotTimestamped"];

            // save
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
        },
    },
];

function isVersionGreater(v1, v2) {
    const [major1, minor1, patch1] = v1.split(".").map(Number);
    const [major2, minor2, patch2] = v2.split(".").map(Number);

    if (major1 > major2) return true;
    if (major1 < major2) return false;
    if (minor1 > minor2) return true;
    if (minor1 < minor2) return false;
    return patch1 > patch2;
}

export function handleMigrations(currentVersion) {
    const storedVersion = localStorage.getItem("ample-version") || "0.0.0";

    migrations.forEach(async ({ version, migrate }) => {
        if (isVersionGreater(version, storedVersion)) {
            console.log(`Applying migration for version ${version}`);
            await migrate();

            // Update the stored version to this version
            localStorage.setItem("ample-version", version);
        }
    });
}
