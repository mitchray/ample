<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../../stores/api";
    import PlaylistSelector from '../../components/playlist/playlist_selector.svelte';
    import PlaylistEdit from '../../components/playlist/playlist_edit.svelte';

    export let songs;
    export let isVisible;

    let selectedPlaylist;
    let ignoreDuplicates = true;

    let currentTab = 1;
    let tabItems = [
        { label: $_('text.playlistAddTo'), value: 1 },
        { label: $_('text.playlistNew'),   value: 2 }
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
            <h4 class="title panel-title">{$_('text.playlistAddTo')}</h4>
            <button class="button button--primary" on:click={e => currentTab = 2}>{$_('text.new')}</button>
        </div>

        <PlaylistSelector
            type="playlists"
            bind:selectedPlaylist
            on:selected={handleSelected}
        />

        <div class="new-panel-secondary">
            <label class="toggle">
                <input type="checkbox" on:change={toggleIgnoreDuplicates} bind:checked={ignoreDuplicates} />
                {$_('text.skipDuplicates')}
            </label>
        </div>
    </div>

    <div class="new-playlist-view" style="display: {currentTab === 2 ? 'block' : 'none'}">
        <div class="header new-panel-header">
            <h4 class="title panel-title">{$_('text.newPlaylist')}</h4>
            <button class="button button--regular" on:click={e => currentTab = 1}>{$_('text.back')}</button>
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
        margin-block-start: var(--spacing-lg);
    }
</style>