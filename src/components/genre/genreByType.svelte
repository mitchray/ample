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
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { id, type } = $props();

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["genre", id, type],
            fetchPage: async (offset, limit) => {
                let result = {};
                switch (type) {
                    case "artist":
                        result = await $API.genreArtists({
                            filter: id,
                            limit,
                            offset,
                        });
                        break;
                    case "album":
                        result = await $API.genreAlbums({
                            filter: id,
                            limit,
                            offset,
                        });
                        break;
                    case "song":
                        result = await $API.genreSongs({
                            filter: id,
                            limit,
                            offset,
                        });
                        break;
                    default:
                        break;
                }
                if (result.error) {
                    errorHandler("getting genre type " + type, result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result[type]);
                return {
                    items: result[type],
                    total_count: result.total_count,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let items = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

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
