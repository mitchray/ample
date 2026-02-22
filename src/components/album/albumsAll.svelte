<script>
    import { User, API } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["albums"],
            fetchPage: async (offset, limit) => {
                const response = await $API.albums({
                    sort: "basename,ASC",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting all albums", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.album);
                return {
                    items: response.album,
                    total_count: response.total_count,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let albums = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (albums && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={albumsPreset}
    type="albums"
    options={{
        persistenceID: "albums",
    }}
></Tabulator>
