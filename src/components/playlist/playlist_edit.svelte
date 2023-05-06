<script>
    import { API } from "../../stores/api";
    import { addAlert } from "../../logic/alert";

    export let playlist = null;
    export let isNew = false;
    export let isVisible;

    let playlistName = playlist?.name || '';
    let playlistType = playlist?.type || 'private';
    let playlistTypeValue = playlist?.type === "public";

    $: {
        playlistType = playlistTypeValue ? "public" : "private";
    }

    async function savePlaylist() {
        playlistName = playlistName.trim();

        if (playlistName) {
            // TODO: this won't be necessary anymore
            let playlistTest = await $API.playlists({ filter: playlistName, exact: 1, limit: 1, hide_search: 1 });

            if (isNew) {
                if (playlistTest.length > 0 && playlistTest[0].id) {
                    addAlert({title: `Playlist "${playlistName}" already exists`, style: 'warning'});
                    return;
                }

                playlist = await $API.playlistCreate({ name: playlistName, type: playlistType });
                isVisible = false;

                addAlert({title: 'Playlist created', style: 'success'});
            } else {
                if (playlistTest?.id && playlistTest?.id !== playlist.id) {
                    return;
                }

                let result = await $API.playlistEdit({ filter: playlist.id, name: playlistName, type: playlistType });

                if (result.success) {
                    let tempPlaylist = await $API.playlist({ filter: playlist.id });
                    if (playlist.isNew) {
                        tempPlaylist.isNew = true;
                    }
                    playlist = tempPlaylist;
                    isVisible = false;

                    addAlert({title: 'Playlist updated', style: 'success'});
                }
            }
        }
    }

    function handleCancel() {
        isVisible = false;
    }
</script>

<div class="container">
    <div class="new-panel-header">
        <h4 class="panel-title">{isNew ? 'New' : 'Edit'} Playlist</h4>
    </div>

    <input
        placeholder="Name"
        type="text"
        bind:value={playlistName}
    />

    <div class="types">
        <label>
            Public
            <input type="checkbox" class="switch type" bind:checked={playlistTypeValue} />
        </label>
    </div>

    <div class="new-panel-footer">
        <button class="button button--tertiary" on:click={handleCancel}>Cancel</button>

        <button
            class="submit button button--primary"
            on:click={savePlaylist}
        >
            {isNew ? 'Create' : 'Update'}
        </button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 250px;
        gap: var(--spacing-md);
    }

    .type {
        margin-left: var(--spacing-sm);
    }
</style>