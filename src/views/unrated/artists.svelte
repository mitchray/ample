<script>
    import { unratedArtists } from "~/logic/artist.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["unratedArtists", Date.now()],
            fetchPage: async (offset, limit) => {
                const result = await unratedArtists({ limit, offset });
                if (result.error) {
                    errorHandler("getting unrated artists", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.artist);
                return {
                    items: result.artist,
                    total_count: result.total_count,
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
    options={{ persistenceID: "artists" }}
></Tabulator>
