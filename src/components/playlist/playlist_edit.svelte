<script>
    import { _ } from 'svelte-i18n';
    import { createEventDispatcher  } from "svelte";
    import { API } from "../../stores/api";
    import { DispatchListerEvent } from "../../stores/message";
    import { addAlert } from "../../logic/alert";

    export let playlist = null;
    export let isNew = false;
    export let isVisible; // passed back to parent
    export let nested = false;

    const dispatch = createEventDispatcher();

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
                    addAlert({title: $_("text.playlistExists", { values: { name: playlistName } }), style: 'warning'});
                    return;
                }

                playlist = await $API.playlistCreate({ name: playlistName, type: playlistType });
                isVisible = false;

                addAlert({title: $_('text.playlistCreated'), style: 'success'});

                // informs parent component
                dispatch('created');

                // informs lister
                $DispatchListerEvent = {
                    event: "addedPlaylist",
                    data: playlist,
                    type: "playlist"
                };

                // reset once completed
                playlist = null;
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

                    addAlert({title: $_('text.playlistUpdated'), style: 'success'});

                    $DispatchListerEvent = {
                        event: "editedPlaylist",
                        data: playlist,
                        type: "playlist"
                    };
                } else {
                    addAlert({title: $_('text.playlistGone'), style: 'warning'});

                    $DispatchListerEvent = {
                        event: "deletedPlaylist",
                        data: playlist,
                        type: "playlist"
                    };

                    isVisible = false;
                }
            }
        }
    }

    function handleCancel() {
        dispatch('cancelled');
        isVisible = false;
    }
</script>

<div class="container">
    {#if !nested}
        <div class="new-panel-header">
            <h4 class="panel-title">{isNew ? $_('text.playlistNew') : $_('text.playlistEdit')}</h4>
        </div>
    {/if}

    <input
        placeholder="{$_('text.name')}"
        type="text"
        bind:value={playlistName}
    />

    <div class="types">
        <label>
            {$_('text.public')}
            <input type="checkbox" class="switch type" bind:checked={playlistTypeValue} />
        </label>
    </div>

    <div class="new-panel-footer">
        <button class="button button--tertiary" on:click={handleCancel}>{$_('text.cancel')}</button>

        <button
            class="submit button button--primary"
            on:click={savePlaylist}
        >
            {isNew ? $_('text.create') : $_('text.update')}
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
        margin-inline-start: var(--spacing-sm);
    }
</style>