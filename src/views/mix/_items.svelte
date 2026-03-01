<script>
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { getSongsFromPlaylist } from "~/logic/song.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { playlist } = $props();

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["playlist_items", playlist.id + "mix"],
            noMorePages: true,
            fetchPage: async () => {
                const response = await getSongsFromPlaylist({
                    id: playlist.id,
                    type: "artist_mix",
                });
                if (response.error) {
                    errorHandler("getting items from mix", response.error);
                    return { items: [], total_count: 0 };
                }
                const items = response.song || [];
                return { items, total_count: items.length };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let items = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);
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
            persistenceID: "mix",
        }}
    ></Tabulator>
{/key}
