<script>
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { onDestroy } from "svelte";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { playlist } = $props();

    let tabulator = $state(null);
    let destroyed = false;

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["playlist_items", playlist.id],
            fetchPage: async (offset, limit) => {
                try {
                    const result = await $API.playlistSongs({
                        filter: playlist.id,
                        limit,
                        offset,
                    });
                    if (destroyed) return { items: [], total_count: 0 };
                    if (result.error) {
                        errorHandler("getting items from smartlist", result.error);
                        return { items: [], total_count: 0 };
                    }
                    return {
                        items: result.song,
                        total_count: result.total_count ?? 0,
                    };
                } catch (e) {
                    if (destroyed) return { items: [], total_count: 0 };
                    throw e;
                }
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let items = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (items.length > 0 && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });

    onDestroy(() => {
        destroyed = true;
    });
</script>

{#key playlist.id}
    <Actions
        type="songs"
        displayMode="fullButtons"
        showShuffle={items.length > 1}
        data={{ getSongs: () => tabulator?.getData("active") }}
    />

    <Tabulator
        bind:tabulator
        data={items}
        columns={songsPreset}
        type="songs"
        options={{
            persistenceID: "smartlist",
        }}
    ></Tabulator>
{/key}
