import { get } from "svelte/store";
import { API, CachedItemKeys } from "~/stores/state.js";
import { debugHelper, trimCache } from "~/logic/helper.js";
import { findViableItemsAhead } from "./queue.js";

/**
 * Retrieve an audio blob from cache, filling cache if needed.
 * @param {object} item - Item being referenced
 * @param {'stream' | 'download'} method
 * @returns {Promise<Blob|null>} - Blob when method is 'stream', otherwise undefined; null on failure
 */
export async function getBlob(item, method) {
    let blob;

    const fetchParams = {
        filter: item.id,
        type: item.object_type,
    };

    const fakeURL =
        "fake-cache-endpoint?" +
        new URLSearchParams(fetchParams).toString();

    let cache, response;
    const hasCacheAPI = typeof caches !== "undefined";

    if (hasCacheAPI) {
        cache = await caches.open("audio-cache");
        response = await cache.match(fakeURL);
    }

    if (!response) {
        debugHelper("song was not in cache, do new fetch");

        if (method === "download") {
            blob = await get(API).download(fetchParams);
        } else {
            blob = await get(API).stream(fetchParams);
        }

        if (blob instanceof Blob) {
            if (hasCacheAPI) {
                const responseToCache = new Response(blob, { status: 200 });
                await trimCache();
                await cache.put(fakeURL, responseToCache);
                const cacheKey = `${item.id}:${item.object_type}`;
                CachedItemKeys.update((s) => new Set(s).add(cacheKey));
            }

            if (method === "stream") {
                debugHelper("saving this stream to cache", item);
            } else {
                debugHelper("downloaded next item to cache", item);
            }
        } else {
            debugHelper("response was not a blob (i.e. failure)");
            return null;
        }
    } else {
        blob = await response.blob();
        const cacheKey = `${item.id}:${item.object_type}`;
        CachedItemKeys.update((s) => new Set(s).add(cacheKey));
        debugHelper("song was in cache! method: " + method, item);

        if (method === "stream") {
            get(API).player({
                filter: item.id,
                type: item.object_type,
                state: "play",
                client: "Ample",
            });
        }
    }

    if (method === "stream") {
        return blob;
    }
}

/**
 * Preload up to maxCount items ahead of current playback (rolling cache).
 * Skips already-cached items and runs in background; call with void.
 * @param {number} maxCount
 */
export async function preloadAhead(maxCount) {
    const items = findViableItemsAhead(maxCount);
    const cached = get(CachedItemKeys);
    const toLoad = items.filter(
        (item) => !cached.has(`${item.id}:${item.object_type}`),
    );
    for (const item of toLoad) {
        debugHelper("loading next song into cache", item);
        await getBlob(item, "download");
    }
}
