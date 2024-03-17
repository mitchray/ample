<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { API } from "~/stores/state.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";

    export const show = () => drawer.show();
    export let songs;

    let drawer, drawerEdit;
    let selectedPlaylist;
    let ignoreDuplicates = true;

    function handleSave() {
        songs.forEach((element) => {
            $API.playlistAddSong({
                filter: selectedPlaylist.id,
                song: element.id,
                check: ignoreDuplicates ? 1 : 0,
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
    <PlaylistSelector
        bind:selectedPlaylist
        showSelected={true}
        type="playlists"
    />

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
        disabled={!selectedPlaylist}
        on:click={handleSave}
        slot="footer"
        variant="primary"
    >
        Add
    </sl-button>

    <DrawerEdit
        bind:playlist={selectedPlaylist}
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
