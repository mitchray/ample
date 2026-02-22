<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { newestAlbums } from "~/logic/album";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let title = $_("text.newest");
    $PageTitle = title;
    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["newestAlbums"],
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

            let result = await newestAlbums({
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting newest albums", result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result.album);

            return result.album;
        },
        enabled: $User.isLoggedIn,
    }));

    let albums = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (albums && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

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
            showShuffle={albums.length > 1}
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
