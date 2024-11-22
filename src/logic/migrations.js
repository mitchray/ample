import { compareVersions } from "compare-versions";

const migrations = [
    {
        version: "3.5.0-alpha1",
        migrate: async () => {
            // migrate indexedDB AmpleUser1 (presumably the sole admin account in most cases)

            const DB_NAME = "AmpleUser1";
            const STORE_NAME = "keyvaluepairs";
            const LOCAL_STORAGE_KEY = "ample-settings";

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
                allowZero: settings.SkipBelowAllowZero || true,
                rating: settings.SkipBelowRating || "3",
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

export function handleMigrations(currentVersion) {
    const storedVersion = localStorage.getItem("ample-version") || "0.0.0";

    migrations.forEach(async ({ version, migrate }) => {
        if (compareVersions(version, storedVersion)) {
            console.log(`Applying migration for version ${version}`);
            await migrate();

            // Update the stored version to this version
            localStorage.setItem("ample-version", version);
        }
    });
}
