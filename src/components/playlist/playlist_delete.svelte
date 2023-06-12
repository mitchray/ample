<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../../stores/api";
    import { DispatchListerEvent } from "../../stores/message";
    import { addAlert } from "../../logic/alert";
    import SVGBin from "/src/images/delete.svg";

    export let playlist = null;
    export let isVisible;

    function handleDelete() {
        $API.playlistDelete({ filter: playlist.id })
            .then(result => {
                if (result.success) {
                    let playlists = document.querySelectorAll(`[data-id=playlist-${playlist.id}]`);
                    playlists.forEach(p => {
                        p.style.display = 'none';
                    })

                    addAlert({title: $_('text.playlistDeleted'), style: 'success'});
                    $DispatchListerEvent = {
                        event: "deletedPlaylist",
                        data: playlist,
                        type: "playlist"
                    };
                } else {
                    addAlert({title: $_('text.playlistDeleteFailed'), message: `${result.error?.errorCode}: ${result.error?.errorMessage}`, style: 'warning'});
                }
            });

        isVisible = false;
    }

    function handleCancel() {
        isVisible = false;
    }
</script>

<div class="container">
    <div class="new-panel-header">
        <h4 class="panel-title">{$_('text.playlistConfirmRemoval')}</h4>
    </div>

    <div class="panel-content">
        {$_("text.playlistConfirmRemovalInfo", { values: { name: playlist.name } })}
    </div>

    <div class="new-panel-footer">
        <button class="button button--tertiary" on:click={handleCancel}>{$_('text.cancel')}</button>
        <button class="button button--danger" on:click={handleDelete}><SVGBin /> {$_('text.delete')}</button>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        width: 250px;
        gap: var(--spacing-md);
    }

    h4 {
        margin: 0;
    }
</style>