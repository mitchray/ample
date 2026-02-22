<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { unratedAlbums } from "~/logic/album.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["unratedAlbums", Date.now()],
            fetchPage: async (offset, limit) => {
                const result = await unratedAlbums({ limit, offset });
                if (result.error) {
                    errorHandler("getting unrated albums", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.album);
                return {
                    items: result.album,
                    total_count: result.total_count,
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
    options={{ persistenceID: "albums" }}
></Tabulator>
