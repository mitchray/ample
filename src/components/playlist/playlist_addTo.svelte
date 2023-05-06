<script>
    import { API } from "../../stores/api";

    import PlaylistSelector from '../../components/playlist/playlist_selector.svelte';
    import PlaylistEdit from '../../components/playlist/playlist_edit.svelte';

    export let songs;
    export let isVisible;

    let selectedPlaylist;
    let ignoreDuplicates = true;

    let currentTab = 1;
    let tabItems = [
        { label: "Add To Playlist", value: 1 },
        { label: "New Playlist",    value: 2 }
    ];

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
</script>

<div class="new-panel-container">
    <div class="add-to-view" style="display: {currentTab === 1 ? 'block' : 'none'}">
        <div class="header new-panel-header">
            <h4 class="title panel-title">Add To Playlist</h4>
            <button class="button button--primary" on:click={e => currentTab = 2}>New</button>
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

    <div class="new-playlist-view" style="display: {currentTab === 2 ? 'block' : 'none'}">
        <div class="header new-panel-header">
            <h4 class="title panel-title">New Playlist</h4>
            <button class="button button--regular" on:click={e => currentTab = 1}>Back</button>
        </div>

        <PlaylistEdit
            isNew={true}
            nested={true}
            bind:playlist={selectedPlaylist}
            on:created={handleSelected}
            on:cancelled={e => currentTab = 1}
        />
    </div>
</div>

<style>
    .new-panel-secondary {
        margin-top: var(--spacing-lg);
    }
</style>