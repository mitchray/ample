<script>
    import { newestAlbums } from "~/logic/album.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["newestAlbums"],
            fetchPage: async (offset, limit) => {
                const result = await newestAlbums({ limit, offset });
                if (result.error) {
                    errorHandler("getting newest albums", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.album);
                return {
                    items: result.album,
                    total_count: result.total_count,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let albums = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (albums && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if albums.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Actions
            type="albums"
            displayMode="fullButtons"
            showShuffle={true}
            data={{ getAlbums: () => tabulator?.getData("active") }}
        />

        <Tabulator
            bind:tabulator
            data={[]}
            columns={albumsPreset}
            type="albums"
            options={{ persistenceID: "albums" }}
        ></Tabulator>
    {/if}
{/if}
