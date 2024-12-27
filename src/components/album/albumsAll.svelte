<script>
    import { User, API } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";
    import MassRater from "~/components/lister/massRater.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    // pageParam is based on offset total
    let tabulator = $state(null);
    let limit = 1000;
    let total = $state(0);

    let query = $derived(
        createInfiniteQuery({
            queryKey: ["albums"],
            initialPageParam: 0,
            getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
                let offsetTotal = lastPageParam + limit;
                return offsetTotal <= total ? offsetTotal : undefined;
            },
            // pageParam is based on offset total
            queryFn: async ({ pageParam }) => {
                let response = await $API.albums({
                    sort: "basename,ASC",
                    limit: limit,
                    offset: pageParam,
                });

                if (response.error) {
                    errorHandler("getting all albums", response.error);
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
    let albums = $derived($query.data?.pages || []);

    $effect(() => {
        if (albums && $query.hasNextPage) {
            $query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
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
