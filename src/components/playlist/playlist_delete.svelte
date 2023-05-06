<script>
    import { API } from "../../stores/api";
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

                    addAlert({title: 'Playlist deleted', style: 'success'});
                } else {
                    addAlert({title: 'Failed to delete playlist', message: `${result.error?.errorCode}: ${result.error?.errorMessage}`, style: 'warning'});
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
        <h4 class="panel-title">Confirm playlist removal</h4>
    </div>

    <div class="panel-content">
        <p><em>{playlist.name}</em> will be deleted</p>
    </div>

    <div class="new-panel-footer">
        <button class="button button--tertiary" on:click={handleCancel}>Cancel</button>
        <button class="button button--danger" on:click={handleDelete}><SVGBin /> Delete</button>
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

    p {
        margin: 0 var(--spacing-sm);
    }
</style>