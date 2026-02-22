<script>
    import { unratedArtists } from "~/logic/artist.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["unratedArtists", Date.now()],
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

            let result = await unratedArtists({
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting unrated artists", result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result.artist);

            return result.artist;
        },
        enabled: $User.isLoggedIn,
    }));

    let artists = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (artists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Actions
    type="artists"
    displayMode="fullButtons"
    showShuffle={true}
    data={{
        getArtists: () => tabulator?.getData("active"),
    }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={artistsPreset}
    type="artists"
    options={{ persistenceID: "artists" }}
></Tabulator>
