<script>
    import { _ } from "svelte-i18n";
    import { QueueRefill, Saved } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import { API, NowPlayingIndex, NowPlayingQueue } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { addAlert } from "~/logic/alert.js";
    import { prepareForQueue } from "~/logic/helper.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";

    let selectedPlaylist = $QueueRefill.smartlist;
    let isFetching = false;
    let timeout;

    $: shouldAdd =
        $QueueRefill.enabled &&
        $NowPlayingQueue.length > 0 &&
        $NowPlayingIndex > $NowPlayingQueue.length - 10;

    $: {
        if (shouldAdd && !isFetching) {
            clearTimeout(timeout);
            isFetching = true;
            timeout = setTimeout(() => {
                fetchItems().then(() => {
                    isFetching = false;
                });
            }, 10000);
        }
    }

    function fetchItems() {
        return new Promise((resolve, reject) => {
            try {
                let apiCall;

                if ($QueueRefill.mode === "smartlist" && selectedPlaylist) {
                    apiCall = $API.playlistSongs({
                        filter: selectedPlaylist.id,
                        limit: 100,
                    });
                } else if ($QueueRefill.mode === "mix") {
                    let lastItem =
                        $NowPlayingQueue[$NowPlayingQueue.length - 1];
                    let artistID = lastItem.artist?.id;

                    if (artistID) {
                        apiCall = getSongsFromPlaylist({
                            id: artistID,
                            type: "artist_mix",
                        });
                    }
                }

                if (apiCall) {
                    apiCall
                        .then((response) => {
                            if (response.error) {
                                console.error(
                                    "Ample error getting items for queue refill:",
                                    response.error,
                                );
                                return;
                            }

                            let result = Array.isArray(response)
                                ? response
                                : [response];
                            if (result.length > 0) {
                                $MediaPlayer.playLast(prepareForQueue(result));

                                addAlert({
                                    title: $_("text.queueRefill"),
                                    message: $_("text.queueRefillAddedItems", {
                                        values: {
                                            n: result.length,
                                        },
                                    }),
                                    style: "info",
                                });
                            }
                            resolve();
                        })
                        .catch((error) => {
                            console.error(
                                "Error fetching queue refill items:",
                                error,
                            );
                            reject(error);
                        });
                } else {
                    // Resolve immediately if no API call is needed
                    resolve();
                }
            } catch (error) {
                console.error("Error fetching queue refill items:", error);
                reject(error);
            }
        });
    }

    function toggleEnabled() {
        let inverted = !$QueueRefill.enabled;
        QueueRefill.set({ ...$QueueRefill, enabled: inverted });
        $Saved.setItem("QueueRefill", $QueueRefill);
    }

    function handleMode(e) {
        QueueRefill.set({ ...$QueueRefill, mode: e.target.value });
        $Saved.setItem("QueueRefill", $QueueRefill);
    }

    function handleSelectedPlaylist() {
        QueueRefill.set({ ...$QueueRefill, smartlist: selectedPlaylist.id });
        $Saved.setItem("QueueRefill", $QueueRefill);
    }

    function handleClearedPlaylist() {
        QueueRefill.set({ ...$QueueRefill, smartlist: null });
        $Saved.setItem("QueueRefill", $QueueRefill);
    }

    $: {
        // test the saved smartlist does exist
        if ($QueueRefill.smartlist) {
            $API.playlist({
                filter: $QueueRefill.smartlist,
            }).then((result) => {
                if (result.error) {
                    console.error(
                        "Ample error getting playlists:",
                        result.error,
                    );
                    selectedPlaylist = null;
                } else {
                    selectedPlaylist = result;
                }
            });
        }
    }
</script>

<sl-dropdown hoist placement="bottom">
    <sl-button
        class="rating-filter"
        class:is-enabled={$QueueRefill.enabled}
        size="small"
        slot="trigger"
        title={$_("text.queueRefill")}
    >
        <MaterialSymbol
            fill={$QueueRefill.enabled}
            name="play_circle"
            size="13px"
        />
    </sl-button>

    <sl-card>
        <div slot="header">
            {$_("text.queueRefill")}

            <sl-switch
                checked={$QueueRefill.enabled}
                on:sl-change={toggleEnabled}
            ></sl-switch>
        </div>

        <sl-radio-group
            name="mode"
            on:sl-change={handleMode}
            value={$QueueRefill.mode}
        >
            <sl-radio-button value="smartlist">
                <MaterialSymbol name="electric_bolt" slot="prefix" />
                {$_("text.smartlist")}
            </sl-radio-button>
            <sl-radio-button value="mix">
                <MaterialSymbol name="person" slot="prefix" />
                {$_("text.artistMix")}
            </sl-radio-button>
        </sl-radio-group>

        {#if $QueueRefill.mode === "smartlist"}
            <div class="secondary-info">{$_("text.queueRefillSmartlist")}</div>

            <sl-divider></sl-divider>

            <PlaylistSelector
                type="smartlists"
                showSelected={true}
                bind:selectedPlaylist
                on:selected={handleSelectedPlaylist}
                on:cleared={handleClearedPlaylist}
            />
        {:else}
            <div class="secondary-info">{$_("text.queueRefillMix")}</div>
        {/if}
    </sl-card>
</sl-dropdown>

<style>
    sl-card {
        width: 320px;
    }

    sl-card::part(body) {
        max-height: calc(100vh - 250px);
        display: flex;
        flex-direction: column;
        /*gap: var(--spacing-lg);*/
    }

    sl-card [slot="header"] {
        display: flex;
        justify-content: space-between;
    }

    sl-radio-group {
        margin-block-end: var(--spacing-md);
    }

    sl-button :global(.icon) {
        position: relative;
        top: 2px;
    }
</style>
