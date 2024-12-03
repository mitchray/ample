<script>
    import { _ } from "svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import { API, NowPlayingIndex, NowPlayingQueue } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { addAlert } from "~/logic/alert.js";
    import { errorHandler, prepareForQueue } from "~/logic/helper.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";

    let selectedPlaylist = $state();
    let playlistsArray = $state([]);
    let isFetching = $state(false);
    let timeout = $state();

    async function startFetching() {
        isFetching = true;
        timeout = setTimeout(async () => {
            await fetchItems();
            isFetching = false;
        }, 10000);
    }

    function fetchItems() {
        return new Promise((resolve, reject) => {
            try {
                let apiCall;

                if (
                    $Settings.QueueRefill.mode === "smartlist" &&
                    selectedPlaylist
                ) {
                    apiCall = $API.playlistSongs({
                        filter: selectedPlaylist,
                        limit: 100,
                    });
                } else if ($Settings.QueueRefill.mode === "mix") {
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
                                errorHandler(
                                    "getting items for queue refill",
                                    response.error,
                                );
                                return;
                            }

                            let result = response.song || [response];

                            if (result.length > 0 && shouldAdd) {
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
        $Settings.QueueRefill.enabled = !$Settings.QueueRefill.enabled;
    }

    function handleMode(e) {
        $Settings.QueueRefill.mode = e.target.value;
    }

    function handleSelectedPlaylist() {
        selectedPlaylist = playlistsArray[0];
        $Settings.QueueRefill.smartlist = selectedPlaylist;
    }

    function handleClearedPlaylist() {
        $Settings.QueueRefill.smartlist = null;
    }

    $effect(() => {
        // test the saved smartlist does exist
        if ($Settings.QueueRefill.smartlist) {
            $API.playlist({
                filter: $Settings.QueueRefill.smartlist,
            }).then((result) => {
                if (result.error) {
                    errorHandler("getting playlists", result.error);
                    selectedPlaylist = null;
                } else {
                    selectedPlaylist = result.id;
                }
            });
        }
    });

    // when selected playlist changes, pass it back up to the selector component
    $effect(() => {
        selectedPlaylist, (playlistsArray = [selectedPlaylist]);
    });

    let shouldAdd = $derived(
        $Settings.QueueRefill.enabled &&
            $NowPlayingQueue.length > 0 &&
            $NowPlayingIndex > $NowPlayingQueue.length - 10,
    );

    $effect(() => {
        if (shouldAdd && !isFetching) {
            clearTimeout(timeout);
            startFetching();
        }
    });
</script>

<sl-dropdown hoist placement="bottom">
    <sl-button
        class="rating-filter"
        class:is-enabled={$Settings.QueueRefill.enabled}
        size="small"
        slot="trigger"
        title={$_("text.queueRefill")}
    >
        <MaterialSymbol
            fill={$Settings.QueueRefill.enabled}
            name="play_circle"
            size="13px"
        />
    </sl-button>

    <sl-card>
        <div slot="header">
            {$_("text.queueRefill")}

            <sl-switch
                checked={$Settings.QueueRefill.enabled}
                onsl-change={toggleEnabled}
            ></sl-switch>
        </div>

        <sl-radio-group
            name="mode"
            onsl-change={handleMode}
            value={$Settings.QueueRefill.mode}
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

        {#if $Settings.QueueRefill.mode === "smartlist"}
            <div class="secondary-info">{$_("text.queueRefillSmartlist")}</div>

            <sl-divider></sl-divider>

            <PlaylistSelector
                type="smartlists"
                bind:selectedPlaylists={playlistsArray}
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
