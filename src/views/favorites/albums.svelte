<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["favoriteAlbums"],
            fetchPage: async (offset, limit) => {
                const response = await $API.stats({
                    type: "album",
                    filter: "flagged",
                    sort: "user_flag_rating,DESC",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting favorite albums", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.album);
                return {
                    items: response.album,
                    total_count: response.total_count,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let albums = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (albums && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Actions
    type="albums"
    displayMode="fullButtons"
    showShuffle={true}
    data={{ getAlbums: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={albumsPreset}
    type="albums"
    options={{
        persistenceID: "albums",
    }}
></Tabulator>
