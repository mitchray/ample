<script context="module">
    import { writable } from 'svelte/store';

    let isFetching = writable(false);
    let selectedPlaylist = writable(null);
</script>

<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { v4 as uuidv4 } from "uuid";
    import { addAlert } from "../../logic/alert";
    import { API } from "../../stores/api";
    import { MediaPlayer } from "../../stores/player";
    import { NowPlayingIndex, NowPlayingQueue } from "../../stores/status";
    import { AutoPlayEnabled, AutoPlayPlaylist } from "../../stores/status";
    import PlaylistSelector from '../../components/playlist/playlist_selector.svelte';
    import Menu from '../../components/menu.svelte';
    import SVGAutoPlay from "/src/images/queue.svg";

    const uniqueMenuID = "autoPlayMenu_" + uuidv4();
    let isVisible = false;
    let timeout;
    let shouldAdd;

    $: shouldAdd = $NowPlayingQueue.length > 0 && $AutoPlayEnabled && $selectedPlaylist && $NowPlayingIndex > $NowPlayingQueue.length - 10;

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
                        $API.playlistSongs({ filter: $selectedPlaylist.id, limit: 500 })
                            .then((result) => {
                                if (!result.error && result.length > 0) {
                                    result = (Array.isArray(result)) ? result : [result];
                                    $MediaPlayer.playLast(result);
                                    $isFetching = false;
                                    addAlert({title: $_('text.autoplay'), message: $_('text.autoplayAddedItems', { values: { n: result.length, playlist: $selectedPlaylist.name } }), style: 'info'});
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
        localStorage.setItem('AmpleAutoPlayPlaylist', JSON.stringify($selectedPlaylist.id));
        AutoPlayPlaylist.set($selectedPlaylist.id);
    }

    function handleCleared() {
        AutoPlayPlaylist.set(null);
        localStorage.setItem('AmpleAutoPlayPlaylist', JSON.stringify(null));
    }

    function toggleEnabled() {
        let inverted = !$AutoPlayEnabled;
        localStorage.setItem('AmpleAutoPlayEnabled', JSON.stringify(inverted));
        AutoPlayEnabled.set(inverted);
    }

    function toggleMenu() {
        isVisible = !isVisible;
    }

    onMount(async () => {
        // load from localstorage
        if ($AutoPlayPlaylist) {
            $selectedPlaylist = await $API.playlist({ filter: $AutoPlayPlaylist });
        }
    });
</script>

<button
    id="{uniqueMenuID}"
    class="icon-button"
    title="{$_('text.smartlistAutoplay')}"
    on:click={toggleMenu}
>
    <SVGAutoPlay style="transform: scale(0.75);" />
</button>

{#if isVisible}
    <Menu anchor="top" toggleSelector={`#${uniqueMenuID}`} bind:isVisible >
        <div class="new-panel-container">
            <div class="new-panel-header">
                <h4 class="title panel-title">{$_('text.smartlistAutoplay')}</h4>
                <input type="checkbox" class="switch" on:change={toggleEnabled} bind:checked={$AutoPlayEnabled} />
            </div>

            <div class="new-panel-secondary">
                {$_('text.smartlistAutoplayInfo')}
            </div>

            <PlaylistSelector
                type="smartlists"
                showSelected={true}
                bind:selectedPlaylist={$selectedPlaylist}
                on:selected={handleSelected}
                on:cleared={handleCleared}
            />
        </div>
    </Menu>
{/if}

<style>
    .new-panel-container {
        width: 250px;
    }
</style>