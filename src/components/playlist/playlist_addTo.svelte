<script>
    import { API } from "../../stores/api";

    import PlaylistSelector from '../../components/playlist/playlist_selector.svelte';

    export let songs;
    export let isVisible;

    let selectedPlaylist;
    let ignoreDuplicates = true;
    let showPlaylistCreation = false;

    function handleSelected() {
        songs.forEach(element => {
            $API.playlistAddSong({
                filter: selectedPlaylist.id,
                song: element.id,
                check: ignoreDuplicates ? 1 : 0
            });
        });

        isVisible = false;
    }

    function toggleIgnoreDuplicates() {
        ignoreDuplicates = !ignoreDuplicates;
    }

    function handleNewPlaylist() {
        showPlaylistCreation = !showPlaylistCreation;
    }
</script>

<div class="new-panel-container">
    <div class="new-panel-header">
        <h4 class="panel-title">Add to Playlist</h4>
        <button id="js-playlistsNewFromAdd" on:click={handleNewPlaylist} class="addNew button button--primary">New</button>
    </div>

    <PlaylistSelector
        type="playlists"
        bind:selectedPlaylist
        on:selected={handleSelected}
    />

    <div class="new-panel-secondary">
        <label class="toggle">
            <input type="checkbox" on:change={toggleIgnoreDuplicates} bind:checked={ignoreDuplicates} />
            Skip duplicates
        </label>
    </div>
</div>

<style>
    .new-panel-secondary {
        margin-top: var(--spacing-lg);
    }
</style>