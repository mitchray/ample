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
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let { type, playlist } = $props();

    let tabulator = $state(null);
    let total = $state(0);
    let columns = $derived(
        type === "playlist"
            ? [moveHandle, moveHandleDisabled, ...songsPreset]
            : songsPreset,
    );

    const query = createInfiniteQuery(() => ({
        queryKey: ["playlist_items", playlist.id + type],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            if (type === "mix") return undefined;

            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        queryFn: async ({ pageParam }) => {
            if (type === "mix") {
                let response = await getSongsFromPlaylist({
                    id: playlist.id,
                    type: "artist_mix",
                });

                if (response.error) {
                    errorHandler("getting items from playlist", response.error);
                    return [];
                }

                return response.song || [];
            }

            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await $API.playlistSongs({
                filter: playlist.id,
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting items from playlist", result.error);
                return [];
            }

            total = result.total_count ?? 0;

            return result.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let items = $derived(query.data?.pages.flat() || []);

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
        data={{ getSongs: () => tabulator.getData("active") }}
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
