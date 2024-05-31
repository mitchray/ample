<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { API } from "~/stores/state.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";

    export const show = () => drawer.show();
    export let songs;

    let drawer, drawerEdit;
    let newPlaylist = null;
    let selectedPlaylists;
    let ignoreDuplicates = true;

    function handleSave() {
        if (newPlaylist) {
            selectedPlaylists = [newPlaylist.id];
        }

        selectedPlaylists.forEach((playlistID) => {
            songs.forEach((element) => {
                $API.playlistAddSong({
                    filter: playlistID,
                    song: element.id,
                    check: ignoreDuplicates ? 1 : 0,
                });
            });
        });

        drawer.hide();
    }
</script>

<sl-drawer
    bind:this={drawer}
    label={$_("text.playlistAddTo")}
    on:sl-after-hide
    on:sl-request-close={keepDrawerOpen}
>
    <PlaylistSelector bind:selectedPlaylists multiple={true} type="playlists" />

    <sl-checkbox
        checked={ignoreDuplicates}
        on:sl-change={() => (ignoreDuplicates = !ignoreDuplicates)}
    >
        {$_("text.skipDuplicates")}
    </sl-checkbox>

    <sl-button
        on:click={() => drawerEdit.show()}
        slot="footer"
        variant="primary"
    >
        New Playlist
    </sl-button>

    <sl-button
        disabled={selectedPlaylists?.length < 1}
        on:click={handleSave}
        slot="footer"
        variant="primary"
    >
        Add
    </sl-button>

    <DrawerEdit
        bind:playlist={newPlaylist}
        bind:this={drawerEdit}
        contained
        isNew={true}
        on:created={handleSave}
    />
</sl-drawer>

<style>
    sl-drawer::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    sl-drawer::part(footer) {
        display: flex;
        justify-content: space-between;
    }
</style>
