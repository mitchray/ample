<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { API, User } from "~/stores/state.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);
    let limit = 500;
    let total = $state(0);

    let query = $derived(
        createInfiniteQuery({
            queryKey: ["favoriteAlbums"],
            initialPageParam: 0,
            getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
                let offsetTotal = lastPageParam + limit;
                return offsetTotal <= total ? offsetTotal : undefined;
            },
            // pageParam is based on offset total
            queryFn: async ({ pageParam }) => {
                let response = await $API.stats({
                    type: "album",
                    filter: "flagged",
                    sort: "user_flag_rating,DESC",
                    limit: limit,
                    offset: pageParam,
                });

                if (response.error) {
                    errorHandler("getting favorite albums", response.error);
                    return [];
                }

                total = response.total_count;

                // refresh data on subsequent loads
                tabulator?.addData(response.album);

                return response.album;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let albums = $derived($query.data?.pages.flat() || []);

    $effect(() => {
        if (albums && $query.hasNextPage) {
            $query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <Actions
            type="albums"
            displayMode="fullButtons"
            showShuffle={true}
            data={Object.create({ albums: albums })}
        />

        <MassRater bind:tabulator type="album" />
    </div>

    <Tabulator
        bind:tabulator
        data={[]}
        columns={albumsPreset}
        options={{
            persistenceID: "albums",
        }}
    ></Tabulator>
</div>
