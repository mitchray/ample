<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { newestArtists } from "~/logic/artist";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["newestArtists"],
            fetchPage: async (offset, limit) => {
                const result = await newestArtists({ limit, offset });
                if (result.error) {
                    errorHandler("getting newest artists", result.error);
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

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if artists.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
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
    {/if}
{/if}
