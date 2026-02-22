<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { newestArtists } from "~/logic/artist";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["newestArtists"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await newestArtists({
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting newest artists", result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result.artist);

            return result.artist;
        },
        enabled: $User.isLoggedIn,
    }));

    let artists = $derived(query.data?.pages.flat() || []);

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
