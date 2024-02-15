<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { API } from "~/stores/state.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import DrawerEdit from "./drawerPlaylistEdit.svelte";

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
    label={$_("text.playlistAddTo")}
    bind:this={drawer}
    on:sl-request-close={keepDrawerOpen}
    on:sl-after-hide
>
    <PlaylistSelector
        type="playlists"
        showSelected={true}
        bind:selectedPlaylist
    />

    <sl-checkbox
        checked={ignoreDuplicates}
        on:sl-change={() => (ignoreDuplicates = !ignoreDuplicates)}
    >
        {$_("text.skipDuplicates")}
    </sl-checkbox>

    <sl-button
        slot="footer"
        variant="primary"
        on:click={() => drawerEdit.show()}
    >
        New Playlist
    </sl-button>

    <sl-button
        slot="footer"
        variant="primary"
        on:click={handleSave}
        disabled={!selectedPlaylist}
    >
        Add
    </sl-button>

    <DrawerEdit
        contained
        bind:this={drawerEdit}
        isNew={true}
        bind:playlist={selectedPlaylist}
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
