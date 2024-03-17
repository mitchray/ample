<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { DispatchListerEvent } from "~/stores/message.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { createEventDispatcher } from "svelte";

    export let playlist = null;
    export const show = () => drawer.show();

    const dispatch = createEventDispatcher();
    let drawer;

    function handleDelete() {
        $API.playlistDelete({ filter: playlist.id }).then((result) => {
            if (result.success) {
                let playlists = document.querySelectorAll(
                    `[data-id=playlist-${playlist.id}]`,
                );
                playlists.forEach((p) => {
                    p.style.display = "none";
                });

                addAlert({
                    title: $_("text.playlistDeleted"),
                    style: "success",
                });
                $DispatchListerEvent = {
                    event: "deletedPlaylist",
                    data: playlist,
                    type: "playlist",
                };

                dispatch("playlistDeleted", { id: playlist.id });
            } else {
                addAlert({
                    title: $_("text.playlistDeleteFailed"),
                    message: `${result.error?.errorCode}: ${result.error?.errorMessage}`,
                    style: "warning",
                });
            }
        });

        drawer.hide();
    }
</script>

<sl-drawer bind:this={drawer} label={$_("text.playlistConfirmRemoval")}>
    <div>
        {$_("text.playlistConfirmRemovalInfo", {
            values: { name: playlist?.name },
        })}
    </div>

    <sl-button on:click={handleDelete} slot="footer" variant="danger">
        <MaterialSymbol name="delete" slot="prefix" />
        {$_("text.delete")}
    </sl-button>
</sl-drawer>
