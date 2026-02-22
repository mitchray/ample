<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { playlistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["myPlaylists"],
            fetchPage: async (offset, limit) => {
                const result = await $API.userPlaylists({ limit, offset });
                if (result.error) {
                    errorHandler("getting my playlists", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.playlist);
                return {
                    items: result.playlist,
                    total_count: result.total_count,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let playlists = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (playlists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={playlistsPreset}
    type="playlists"
    options={{ id: "my-playlists", persistenceID: "my-playlists" }}
></Tabulator>
