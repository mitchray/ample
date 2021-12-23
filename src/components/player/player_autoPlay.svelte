<script>
    import { onMount } from 'svelte';

    import { MediaPlayer } from "../../stores/player";
    import { NowPlayingIndex, NowPlayingQueue } from "../../stores/status";
    import { AutoPlayEnabled, AutoPlayPlaylist } from "../../stores/status";

    import { getPlaylist } from "../../logic/playlist";
    import { getSongsFromPlaylist } from "../../logic/song";

    import PlaylistSelector from '../../components/playlists/playlist_selector.svelte';
    import Menu from '../../components/menu.svelte';

    import SVGAutoPlay from "../../../public/images/queue.svg";

    let isVisible = false;
    let selectedPlaylist;

    $: {
        // load more songs into queue from AutoPlay
        if ($NowPlayingQueue.length > 0 && $AutoPlayEnabled && selectedPlaylist) {
            // when we reach less than 10 songs remaining
            if ($NowPlayingIndex > $NowPlayingQueue.length - 10) {
                getSongsFromPlaylist(selectedPlaylist.id)
                    .then((result) => {
                        if (!result.error && result.length > 0) {
                            result = (Array.isArray(result)) ? result : [result];
                            $MediaPlayer.playLast(result);
                        }
                    });
            }
        }
    }

    function handleSelected() {
        localStorage.setItem('AutoPlayPlaylist', JSON.stringify(selectedPlaylist.id));
        AutoPlayPlaylist.set(selectedPlaylist.id);
    }

    function handleCleared() {
        AutoPlayPlaylist.set(null);
        localStorage.setItem('AutoPlayPlaylist', JSON.stringify(null));
    }

    function toggleEnabled() {
        let inverted = !$AutoPlayEnabled;
        localStorage.setItem('AutoPlayEnabled', JSON.stringify(inverted));
        AutoPlayEnabled.set(inverted);
    }

    function toggleMenu() {
        isVisible = !isVisible;
    }

    onMount(async () => {
        // load from localstorage
        if ($AutoPlayPlaylist) {
            selectedPlaylist = await getPlaylist($AutoPlayPlaylist);
        }
    });
</script>

<button
    id="autoPlayMenu"
    class="icon-button"
    title="Smartlist AutoPlay"
    on:click={toggleMenu}
>
    <SVGAutoPlay style="transform: scale(0.75);" />
</button>

{#if isVisible}
    <Menu anchor="top-center" toggleElement={document.querySelector("#autoPlayMenu")} bind:isVisible >
        <div class="header panel-header">
            <h4 class="title">Smartlist AutoPlay</h4>

            <label class="toggle">
                <input type="checkbox" on:change={toggleEnabled} bind:checked={$AutoPlayEnabled} />
                Enable
            </label>
        </div>

        <div class="panel-content">
            <PlaylistSelector
                type="smartlists"
                bind:selectedPlaylist
                on:selected={handleSelected}
                on:cleared={handleCleared}
            />
        </div>
    </Menu>
{/if}

<style>
    
</style>