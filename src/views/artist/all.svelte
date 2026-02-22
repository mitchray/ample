<script>
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { songsPreset, track } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { artistID } = $props();

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["allArtistSongs", artistID],
            fetchPage: async (offset, limit) => {
                const result = await $API.artistSongs({
                    filter: artistID,
                    limit,
                    offset,
                });
                if (result.error) {
                    errorHandler("getting all songs for artist", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.song);
                return { items: result.song, total_count: result.total_count };
            },
            enabled: $User.isLoggedIn,
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
    showShuffle={songs.length > 1}
    data={{ getSongs: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={[]}
    columns={[track, ...songsPreset]}
    type="songs"
    options={{ persistence: true, persistenceID: "SongsArtistAll" }}
></Tabulator>
