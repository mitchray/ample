<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["trendingArtists"],
            fetchPage: async (offset, limit) => {
                const response = await $API.stats({
                    type: "artist",
                    filter: "frequent",
                    sort: "user_flag_rating,DESC",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting trending artists", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.artist);
                return {
                    items: response.artist,
                    total_count: response.total_count,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let artists = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

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
    options={{
        persistenceID: "artists",
    }}
></Tabulator>
