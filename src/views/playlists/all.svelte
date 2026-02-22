<script>
    import { playlistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["playlistsAll"],
            fetchPage: async (offset, limit) => {
                const response = await $API.playlists({
                    hide_search: 1,
                    sort: "name,ASC",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting all playlists", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.playlist);
                return {
                    items: response.playlist,
                    total_count: response.total_count,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let playlists = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (playlists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={playlistsPreset}
    type="playlists"
    options={{ id: "all-playlists", persistenceID: "all-playlists" }}
></Tabulator>
