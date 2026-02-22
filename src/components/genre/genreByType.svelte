<script>
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        albumsPreset,
        artistsPreset,
        songsPreset,
    } from "~/components/lister/columns.js";
    import { _ } from "@rgglez/svelte-i18n";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let { id, type } = $props();

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["genre", id, type],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        // pageParam is based on offset total
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = {};

            switch (type) {
                case "artist":
                    result = await $API.genreArtists({
                        filter: id,
                        limit,
                        offset: pageParam,
                    });
                    break;
                case "album":
                    result = await $API.genreAlbums({
                        filter: id,
                        limit,
                        offset: pageParam,
                    });
                    break;
                case "song":
                    result = await $API.genreSongs({
                        filter: id,
                        limit,
                        offset: pageParam,
                    });
                    break;
                default:
                    break;
            }

            if (result.error) {
                errorHandler("getting genre type " + type, result.error);
                return [];
            }

            total = result.total_count;

            tabulator?.addData(result[type]);

            return result[type];
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let items = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (items && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if items?.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#if type === "artist"}
            <Actions
                type="artistGenre"
                displayMode="fullButtons"
                showShuffle={true}
                data={{ id: id }}
            />

            <Tabulator
                bind:tabulator
                data={[]}
                columns={artistsPreset}
                type="artists"
                options={{
                    persistenceID: "artists",
                }}
            ></Tabulator>
        {/if}

        {#if type === "album"}
            <Actions
                type="albumGenre"
                displayMode="fullButtons"
                showShuffle={true}
                data={{ id: id }}
            />

            <Tabulator
                bind:tabulator
                data={[]}
                columns={albumsPreset}
                type="albums"
                options={{
                    persistenceID: "albums",
                }}
            ></Tabulator>
        {/if}

        {#if type === "song"}
            <Actions
                type="songGenre"
                displayMode="fullButtons"
                showShuffle={true}
                data={{ id: id }}
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
        {/if}
    {/if}
{/if}
