<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { API, User } from "~/stores/state.js";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);
    let limit = 500;
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["forgottenSongs"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            let offsetTotal = lastPageParam + limit;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
            let response = await $API.stats({
                type: "song",
                filter: "highest",
                sort: "user_rating,DESC",
                limit: limit,
                offset: pageParam,
            });

            if (response.error) {
                errorHandler("getting forgotten songs", response.error);
                return [];
            }

            total = response.total_count;

            // refresh data on subsequent loads
            tabulator?.addData(response.song);

            return response.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let songs = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (songs && query.hasNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <Actions
            type="songs"
            displayMode="fullButtons"
            showShuffle={true}
            data={{ getSongs: () => tabulator.getData("active") }}
        />

        <MassRater bind:tabulator type="song" />
    </div>

    <Tabulator
        bind:tabulator
        data={[]}
        columns={songsPreset}
        type="songs"
        options={{
            persistenceID: "songs",
        }}
    ></Tabulator>
</div>
