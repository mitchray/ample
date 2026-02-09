<script>
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    /** @type {{type: 'artist'|'album_artist'}} */
    let { type } = $props();

    let tabulator = $state(null);
    let limit = 500;
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["artists", type],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            let offsetTotal = lastPageParam + limit;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
            let response = await $API.artists({
                album_artist: type === "album_artist" ? 1 : 0,
                sort: "basename,ASC",
                limit: limit,
                offset: pageParam,
            });

            if (response.error) {
                errorHandler("getting all artists", response.error);
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
        if (artists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={artistsPreset}
    type="artists"
    options={{
        persistenceID: "artists",
    }}
></Tabulator>
