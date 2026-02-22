<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["forgottenSongs"],
            fetchPage: async (offset, limit) => {
                const response = await $API.stats({
                    type: "song",
                    filter: "forgotten",
                    limit,
                    offset,
                });
                if (response.error) {
                    errorHandler("getting forgotten songs", response.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(response.song);
                return {
                    items: response.song,
                    total_count: response.total_count,
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
    options={{
        persistenceID: "songs",
    }}
></Tabulator>
