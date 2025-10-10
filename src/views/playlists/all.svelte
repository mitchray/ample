<script>
    import { playlistsPreset } from "~/components/lister/columns.js";
    import { API, User } from "~/stores/state.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let tabulator = $state(null);
    let limit = 500;
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["playlistsAll"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            let offsetTotal = lastPageParam + limit;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
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
    let playlists = $derived(query.data?.pages || []);

    $effect(() => {
        if (playlists && query.hasNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <MassRater bind:tabulator type="artist" />
    </div>

    <Tabulator
        bind:tabulator
        data={[]}
        columns={playlistsPreset}
        options={{
            persistenceID: "playlists",
        }}
    ></Tabulator>
</div>
