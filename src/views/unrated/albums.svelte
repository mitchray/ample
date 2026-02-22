<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { unratedAlbums } from "~/logic/album.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["unratedAlbums", Date.now()],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await unratedAlbums({
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting unrated albums", result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result.album);

            return result.album;
        },
        enabled: $User.isLoggedIn,
    }));

    let albums = $derived(query.data?.pages.flat() || []);

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
