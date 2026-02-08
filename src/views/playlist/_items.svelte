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
    import { createQuery } from "@tanstack/svelte-query";
    import { _ } from "@rgglez/svelte-i18n";

    let { type, playlist } = $props();

    let tabulator = $state(null);
    let columns = $derived(
        type === "playlist"
            ? [moveHandle, moveHandleDisabled, ...songsPreset]
            : songsPreset,
    );

    const query = createQuery(() => ({
        queryKey: ["playlist_items", playlist.id],
        queryFn: async () => {
            let response = await getSongsFromPlaylist({
                id: playlist.id,
                type: type === "mix" ? "artist_mix" : "playlist",
            });

            if (response.error) {
                errorHandler("getting items from playlist", response.error);
                return [];
            }

            // TODO maybe don't refetch playlists on tab change in case it messes up sort order
            // or only refetch if not in edit mode

            // refresh data on subsequent loads
            tabulator?.replaceData(response.song);

            // TODO return correct object type when playlists eventually have mixed content
            return response.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let items = $derived(query.data || []);

    function setupEvents() {
        if (!tabulator || type !== "playlist") return;

        // hide moveHandle if table has been sorted
        tabulator.on("dataSorting", () => {
            if (tabulator.getSorters().length > 0) {
                tabulator.hideColumn("moveHandle");
                tabulator.showColumn("moveHandleDisabled");
            } else {
                tabulator.hideColumn("moveHandleDisabled");
                tabulator.showColumn("moveHandle");
            }
        });

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

    onDestroy(() => {
        if (!tabulator || type !== "playlist") return;

        tabulator?.off("dataSorting");
        tabulator?.off("rowMoved");
    });
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#key playlist.id}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <Actions
                    type="songs"
                    displayMode="fullButtons"
                    showShuffle={items.length > 1}
                    data={{ getSongs: () => tabulator.getData("active") }}
                />

                {#if type === "playlist"}
                    <PlaylistRemoveFrom
                        bind:tabulator
                        {items}
                        playlistID={playlist.id}
                    />
                {/if}
            </div>

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
        </div>
    {/key}
{/if}
