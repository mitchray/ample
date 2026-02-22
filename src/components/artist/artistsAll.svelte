<script>
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    /** @type {{type: 'artist'|'album_artist'}} */
    let { type } = $props();

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["artists", type],
            fetchPage: async (offset, limit) => {
                const response = await $API.artists({
                    album_artist: type === "album_artist" ? 1 : 0,
                    sort: "basename,ASC",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting all artists", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.artist);
                return {
                    items: response.artist,
                    total_count: response.total_count,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let artists = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (artists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={artistsPreset}
    type="artists"
    options={{
        persistenceID: "artists",
    }}
></Tabulator>
