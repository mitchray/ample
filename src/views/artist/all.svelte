<script>
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { songsPreset, track } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let { artistID } = $props();

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["allArtistSongs", artistID],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await $API.artistSongs({
                filter: artistID,
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting all songs for artist", result.error);
                return [];
            }

            total = result.total_count;

            // refresh data on subsequent loads
            tabulator?.addData(result.song);

            return result.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
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
    showShuffle={songs.length > 1}
    data={{ getSongs: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={[track, ...songsPreset]}
    type="songs"
    options={{ persistence: true, persistenceID: "SongsArtistAll" }}
></Tabulator>
