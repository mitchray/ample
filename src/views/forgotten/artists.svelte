<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { API, User } from "~/stores/state.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);
    let limit = 500;
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["forgottenArtists"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            let offsetTotal = lastPageParam + limit;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
            let response = await $API.stats({
                type: "artist",
                filter: "forgotten",
                limit: limit,
                offset: pageParam,
            });

            if (response.error) {
                errorHandler("getting forgotten artists", response.error);
                return [];
            }

            total = response.total_count;

            // refresh data on subsequent loads
            tabulator?.addData(response.artist);

            return response.artist;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let artists = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (artists && query.hasNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <Actions
            type="artists"
            displayMode="fullButtons"
            showShuffle={true}
            data={Object.create({ artists: artists })}
        />

        <MassRater bind:tabulator type="artist" />
    </div>

    <Tabulator
        bind:tabulator
        data={[]}
        columns={artistsPreset}
        options={{
            persistenceID: "artists",
        }}
    ></Tabulator>
</div>
