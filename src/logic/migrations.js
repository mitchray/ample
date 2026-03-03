import { compareVersions } from "compare-versions";
import { clearCache } from "~/logic/helper.js";
import { CachedItemKeys } from "~/stores/state.js";
import { Settings } from "~/stores/settings.svelte.js";

const migrations = [
    {
        version: "4.0.0",
        migrate: async () => {},
    },
];

export function handleMigrations(currentVersion) {
    let storedVersion = localStorage.getItem("ample-version") || "0.0.0";

    if (compareVersions(currentVersion, storedVersion) === 1) {
        migrations.forEach(async ({ version, migrate }) => {
            if (compareVersions(version, storedVersion) === 1) {
                console.log(`Applying migration for version ${version}`);
                await migrate();

                // Update the stored version to this version
                localStorage.setItem("ample-version", version);

                clearCache();
                CachedItemKeys.set(new Set());
            }
        });
    }
}
