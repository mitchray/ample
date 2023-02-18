<script>
    import { API } from "../../stores/api";
    import { addAlert } from "../../logic/alert";

    export let playlist = null;
    export let isNew = false;
    export let isVisible;

    let playlistName = playlist ? playlist.name : '';
    let playlistType = playlist ? playlist.type : 'private';

    async function savePlaylist() {
        playlistName = playlistName.trim();

        if (playlistName) {
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
    <div class="panel-header">
        <h4 class="panel-title">{isNew ? 'New' : 'Edit'} Playlist</h4>
    </div>

    <div class="panel-content">
        <label class="name">
            Name
            <input
                type="text"
                bind:value={playlistName}
            />
        </label>

        <div class="types">
            <label>
                <input type="radio" bind:group={playlistType} value="private" />
                Private
            </label>

            <label>
                <input type="radio" bind:group={playlistType} value="public" />
                Public
            </label>
        </div>
    </div>

    <div class="panel-footer">
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

    .name {
        display: flex;
        flex-shrink: 1;
        align-items: center;
    }

    .name input {
        flex-grow: 1;
    }

    input[type="text"] {
        margin-left: var(--spacing-md);
    }

    .types {
        display: flex;
        gap: var(--spacing-md);
    }

    .message {
        display: none;
    }

    .message.visible {
        display: block;
    }
</style>