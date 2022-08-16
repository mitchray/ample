<script>
    import { addToPlaylist } from '../../logic/playlist';

    import PlaylistSelector from '../../components/playlist/playlist_selector.svelte';

    export let songs;
    export let isVisible;

    let selectedPlaylist;
    let ignoreDuplicates = true;

    function handleSelected() {
        songs.forEach(element => {
            addToPlaylist({
                playlistID: selectedPlaylist.id,
                songID: element.id,
                ignoreDuplicates: ignoreDuplicates ? 1 : 0
            });
        });

        isVisible = false;
    }

    function toggleIgnoreDuplicates() {
        ignoreDuplicates = !ignoreDuplicates;
    }
</script>


<div class="panel-header">
    <h4 class="panel-title">Add to Playlist</h4>
</div>

<div class="panel-content">
    <label class="toggle">
        <input type="checkbox" on:change={toggleIgnoreDuplicates} bind:checked={ignoreDuplicates} />
        Skip duplicates
    </label>

    <PlaylistSelector
        type="playlists"
        bind:selectedPlaylist
        on:selected={handleSelected}
    />
</div>


<style>

</style>