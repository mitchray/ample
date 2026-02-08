<script>
    import { playlistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["playlistsAll"],
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

            let response = await $API.playlists({
                hide_search: 1,
                sort: "name,ASC",
                limit: limit,
                offset: pageParam,
            });

            if (response.error) {
                errorHandler("getting all playlists", response.error);
                return [];
            }

            total = response.total_count;

            // refresh data on subsequent loads
            tabulator?.addData(response.playlist);

            return response.playlist;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let playlists = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (playlists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <Tabulator
        bind:tabulator
        data={[]}
        columns={playlistsPreset}
        type="playlists"
        options={{ id: "all-playlists", persistenceID: "all-playlists" }}
    ></Tabulator>
</div>
