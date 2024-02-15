<script context="module">
    import { writable } from "svelte/store";

    let isFetching = writable(false);
    let selectedPlaylist = writable(null);
</script>

<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { addAlert } from "~/logic/alert.js";
    import { API, NowPlayingQueue, NowPlayingIndex } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import {
        Saved,
        AutoPlayEnabled,
        AutoPlayPlaylist,
    } from "~/stores/settings.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    const uniqueMenuID = "autoPlayMenu_" + uuidv4();
    let timeout;
    let shouldAdd;

    $: shouldAdd =
        $NowPlayingQueue.length > 0 &&
        $AutoPlayEnabled &&
        $selectedPlaylist &&
        $NowPlayingIndex > $NowPlayingQueue.length - 10;

    $: {
        // load more items into queue from AutoPlay
        if (shouldAdd) {
            // when we reach less than 10 items remaining
            if (!$isFetching) {
                $isFetching = true;
                clearTimeout(timeout);

                // 10 seconds grace in case more items are manually queued
                timeout = setTimeout(() => {
                    if (shouldAdd) {
                        $API.playlistSongs({
                            filter: $selectedPlaylist.id,
                            limit: 500,
                        }).then((result) => {
                            if (result.error) {
                                console.error(
                                    "Ample error getting playlist songs:",
                                    result.error,
                                );
                            }

                            if (!result.error && result.length > 0) {
                                result = Array.isArray(result)
                                    ? result
                                    : [result];
                                $MediaPlayer.playLast(result);
                                $isFetching = false;
                                addAlert({
                                    title: $_("text.autoplay"),
                                    message: $_("text.autoplayAddedItems", {
                                        values: {
                                            n: result.length,
                                            playlist: $selectedPlaylist.name,
                                        },
                                    }),
                                    style: "info",
                                });
                            }
                        });
                    } else {
                        $isFetching = false;
                    }
                }, 10000);
            }
        }
    }

    function handleSelected() {
        $Saved.setItem("AutoPlayPlaylist", $selectedPlaylist.id);
        AutoPlayPlaylist.set($selectedPlaylist.id);
    }

    function handleCleared() {
        AutoPlayPlaylist.set(null);
        $Saved.setItem("AutoPlayPlaylist", null);
    }

    function toggleEnabled() {
        let inverted = !$AutoPlayEnabled;
        $Saved.setItem("AutoPlayEnabled", inverted);
        AutoPlayEnabled.set(inverted);
    }

    onMount(async () => {
        // load from localstorage
        if ($AutoPlayPlaylist) {
            let result = await $API.playlist({
                filter: $AutoPlayPlaylist,
            });

            if (result.error) {
                console.error("Ample error getting playlists:", result.error);
                return;
            }

            $selectedPlaylist = result;
        }
    });
</script>

<sl-dropdown>
    <sl-button
        slot="trigger"
        id={uniqueMenuID}
        title={$_("text.smartlistAutoplay")}
    >
        <MaterialSymbol name="queue" />
    </sl-button>

    <sl-card>
        <div slot="header">
            {$_("text.smartlistAutoplay")}

            <sl-checkbox
                on:sl-change={toggleEnabled}
                checked={$AutoPlayEnabled}
            ></sl-checkbox>
        </div>

        {$_("text.smartlistAutoplayInfo")}

        <PlaylistSelector
            type="smartlists"
            showSelected={true}
            bind:selectedPlaylist={$selectedPlaylist}
            on:selected={handleSelected}
            on:cleared={handleCleared}
        />
    </sl-card>
</sl-dropdown>
