<script>
    import { songsPreset } from "~/components/lister/columns.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { unratedSongs } from "~/logic/song.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["unratedSongs", Date.now()],
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

            let result = await unratedSongs({
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting unrated songs", result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result.song);

            return result.song;
        },
        enabled: $User.isLoggedIn,
    }));

    let songs = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (songs && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Actions
    type="songs"
    displayMode="fullButtons"
    showShuffle={true}
    data={{ getSongs: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={songsPreset}
    type="songs"
    options={{ persistenceID: "songs" }}
></Tabulator>
