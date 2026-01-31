<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import {
        API,
        NowPlayingIndex,
        NowPlayingQueue,
        JukeboxQueue,
        CurrentMedia,
        User,
    } from "~/stores/state.js";
    import { MediaPlayer, QueuePanelBind } from "~/stores/elements.js";
    import {
        debugHelper,
        errorHandler,
        prepareForQueue,
    } from "~/logic/helper.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";
    import { onMount, setContext } from "svelte";
    import { writable } from "svelte/store";
    import QueueList from "~/components/queue/queue_list.svelte";
    import { updateQueue } from "~/logic/ui.js";

    let playlists = writable([]);
    let selectedPlaylists = writable([]);
    let activePlaylist = $state();
    let isFetching = $state(false);
    let timeout = $state();
    let playlistResponse;
    let contextKey = "smartlists";

    // Provide the playlists store to selector
    setContext(contextKey, { playlists, selectedPlaylists });

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
                    activePlaylist
                ) {
                    apiCall = $API.playlistSongs({
                        filter: activePlaylist,
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
                        .then(async (response) => {
                            if (response.error) {
                                errorHandler(
                                    "getting items for queue refill",
                                    response.error,
                                );
                                return;
                            }

                            let result = response.song || [response];

                            if (result.length > 0 && shouldRefillJukebox) {
                                const prepared = await prepareForQueue(result);
                                $MediaPlayer.jukeboxPlayLast(prepared);
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

    async function handleRefresh() {
        $JukeboxQueue = [];
        await updateQueue();
    }

    async function clearQueue() {
        $JukeboxQueue = [];
        await updateQueue();
    }

    async function moveToQueue() {
        const index = $JukeboxQueue.findIndex((item) =>
            $MediaPlayer?.isEligibleToPlay(item),
        );

        if (index === -1) {
            debugHelper("could not find an eligible item in jukebox");
            return;
        }

        // remove ineligible items from array
        $JukeboxQueue = $JukeboxQueue.slice(index);

        let [item] = $JukeboxQueue.splice(0, 1); // first item is now eligible
        $MediaPlayer.playLast([item]);
        await updateQueue();
    }

    function expandPanel() {
        $QueuePanelBind.position = 0;
    }

    let shouldAddToQueue = $derived(
        $Settings.QueueRefill.enabled && // jukebox is enabled
            $JukeboxQueue.length > 0 && // there are jukebox items to play
            $CurrentMedia && // just to trigger reactivity
            !$MediaPlayer?.findViableItem("next"), // need another eligible item
    );

    let shouldRefillJukebox = $derived(
        $Settings.QueueRefill.enabled && // jukebox is enabled
            $NowPlayingQueue.length > 0 && // items are in queue
            $NowPlayingIndex > $NowPlayingQueue.length - 5 && // approaching end of queue
            $JukeboxQueue.length < 10, // not many items in jukebox
    );

    $effect(() => {
        // when selected playlist changes, save to store
        if ($selectedPlaylists[0]?.id) {
            $Settings.QueueRefill.smartlist = $selectedPlaylists[0].id;
        }
    });

    $effect(() => {
        if (!$Settings.QueueRefill.enabled || $Settings.QueueRefill.mode) {
            clearQueue();
        }
    });

    $effect(() => {
        // test the saved smartlist does exist
        if ($User.isLoggedIn && $Settings.QueueRefill.smartlist) {
            $API.playlist({
                filter: $Settings.QueueRefill.smartlist,
            }).then((result) => {
                if (result.error) {
                    errorHandler(
                        "getting playlists for queue refill",
                        result.error,
                    );
                    activePlaylist = null;
                } else {
                    activePlaylist = result.id;
                }
            });
        }
    });

    $effect(() => {
        if (shouldRefillJukebox && !isFetching) {
            clearTimeout(timeout);
            startFetching();
        }
    });

    $effect(() => {
        if (shouldAddToQueue) {
            moveToQueue();
        }
    });

    $effect.pre(() => {
        if ($User.isLoggedIn) {
            init();
        }
    });

    async function init() {
        // get playlists
        playlistResponse = await $API.smartlists();

        if (playlistResponse.error) {
            errorHandler(
                `getting smartlists in queue refill`,
                playlistResponse.error,
            );
            return;
        }

        playlists.set(playlistResponse.playlist);

        let initialIndex = $playlists.findIndex(
            (p) => p.id === $Settings.QueueRefill.smartlist,
        );

        if (initialIndex !== -1) {
            selectedPlaylists.set([$playlists[initialIndex]]);
        }
    }
</script>

<div class="header panel-header">
    <h4 onclick={() => expandPanel()}>Jukebox</h4>

    <sl-switch
        checked={$Settings.QueueRefill.enabled}
        onsl-change={toggleEnabled}
    ></sl-switch>

    <sl-button-group>
        <sl-dropdown hoist placement="top">
            <sl-button
                size="small"
                slot="trigger"
                title={$_("text.queueRefill")}
            >
                <MaterialSymbol name="settings" size="13px" />
            </sl-button>

            <sl-card>
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
                    <div class="secondary-info">
                        {$_("text.queueRefillSmartlist")}
                    </div>

                    <sl-divider></sl-divider>

                    <PlaylistSelector {contextKey} />
                {:else}
                    <div class="secondary-info">
                        {$_("text.queueRefillMix")}
                    </div>
                {/if}
            </sl-card>
        </sl-dropdown>

        <sl-button onclick={() => handleRefresh()} size="small">
            <MaterialSymbol name="refresh" size="13px" />
        </sl-button>
    </sl-button-group>
</div>

<QueueList queueType="jukebox" />

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

    .header h4 {
        cursor: pointer;
    }
</style>
