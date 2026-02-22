<script>
    import { songsPreset } from "~/components/lister/columns.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { unratedSongs } from "~/logic/song.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["unratedSongs", Date.now()],
            fetchPage: async (offset, limit) => {
                const result = await unratedSongs({ limit, offset });
                if (result.error) {
                    errorHandler("getting unrated songs", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.song);
                return {
                    items: result.song,
                    total_count: result.total_count,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let songs = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (songs && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Actions
    type="songs"
    displayMode="fullButtons"
    showShuffle={true}
    data={{ getSongs: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={songsPreset}
    type="songs"
    options={{ persistenceID: "songs" }}
></Tabulator>
