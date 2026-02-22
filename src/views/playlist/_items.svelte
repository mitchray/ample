<script>
    import Actions from "~/components/action/actions.svelte";
    import PlaylistRemoveFrom from "~/components/playlist/playlist_removeFrom.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { onDestroy } from "svelte";
    import { getSongsFromPlaylist } from "~/logic/song.js";
    import {
        moveHandle,
        moveHandleDisabled,
        songsPreset,
    } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { _ } from "@rgglez/svelte-i18n";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { type, playlist } = $props();

    let tabulator = $state(null);
    let columns = $derived(
        type === "playlist"
            ? [moveHandle, moveHandleDisabled, ...songsPreset]
            : songsPreset,
    );

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["playlist_items", playlist.id + type],
            noMorePages: type === "mix",
            fetchPage: async (offset, limit) => {
                if (type === "mix") {
                    const response = await getSongsFromPlaylist({
                        id: playlist.id,
                        type: "artist_mix",
                    });
                    if (response.error) {
                        errorHandler(
                            "getting items from playlist",
                            response.error,
                        );
                        return { items: [], total_count: 0 };
                    }
                    const items = response.song || [];
                    return { items, total_count: items.length };
                }
                const result = await $API.playlistSongs({
                    filter: playlist.id,
                    limit,
                    offset,
                });
                if (result.error) {
                    errorHandler(
                        "getting items from playlist",
                        result.error,
                    );
                    return { items: [], total_count: 0 };
                }
                return {
                    items: result.song,
                    total_count: result.total_count ?? 0,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let items = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    const isDataFullyLoaded = $derived(
        type === "mix"
            ? !query.isFetching
            : !query.isFetching && !query.hasNextPage,
    );

    $effect(() => {
        if (
            items.length > 0 &&
            type !== "mix" &&
            query.hasNextPage &&
            !query.isFetchingNextPage
        ) {
            query.fetchNextPage();
        }
    });

    function updateMoveHandleVisibility() {
        if (!tabulator || type !== "playlist") return;

        const isSorted = tabulator.getSorters?.()?.length > 0;
        const showMoveHandle = isDataFullyLoaded && !isSorted;

        if (showMoveHandle) {
            tabulator.hideColumn("moveHandleDisabled");
            tabulator.showColumn("moveHandle");
        } else {
            tabulator.hideColumn("moveHandle");
            tabulator.showColumn("moveHandleDisabled");
        }
    }

    function setupEvents() {
        if (!tabulator || type !== "playlist") return;

        tabulator.on("dataSorting", updateMoveHandleVisibility);

        tabulator.on("rowMoved", async () => {
            let allItems = tabulator.getData();
            let ids = allItems.map((obj) => obj.id);
            let newOrders = Array.from(allItems.keys(), (n) => n + 1);

            let result = await $API.playlistEdit({
                filter: playlist.id,
                items: ids.join(","),
                tracks: newOrders.join(","),
            });

            if (result.error) {
                errorHandler("editing playlist", result.error);
            }
        });
    }

    $effect(() => {
        if (tabulator && type === "playlist") {
            setupEvents();
        }
    });

    $effect(() => {
        updateMoveHandleVisibility();
    });

    onDestroy(() => {
        if (!tabulator || type !== "playlist") return;

        tabulator?.off("dataSorting");
        tabulator?.off("rowMoved");
    });
</script>

{#key playlist.id}
    <Actions
        type="songs"
        displayMode="fullButtons"
        showShuffle={items.length > 1}
        data={{ getSongs: () => tabulator?.getData("active") }}
    />

    <!-- todo move to contextual action bar -->
    {#if type === "playlist"}
        <PlaylistRemoveFrom bind:tabulator {items} playlistID={playlist.id} />
    {/if}

    <Tabulator
        bind:tabulator
        data={items}
        {columns}
        type="songs"
        options={{
            movableRows: true,
            persistenceID: "playlist",
        }}
    ></Tabulator>
{/key}
