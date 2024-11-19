<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { API } from "~/stores/state.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import { onMount } from "svelte";

    export const show = () => drawer.show();
    let { songs } = $props();

    let drawer = $state(),
        drawerEdit = $state();
    let newPlaylist = $state(null);
    let selectedPlaylists = $state();
    let ignoreDuplicates = $state(false);

    function handleSave() {
        if (newPlaylist) {
            selectedPlaylists = [newPlaylist.id];
        }

        selectedPlaylists.forEach((playlistID) => {
            songs.forEach((element) => {
                $API.playlistAdd({
                    filter: playlistID,
                    id: element.id,
                    type: "song",
                });
            });
        });

        selectedPlaylists = [];
        drawer.hide();
    }

    function toggleUniqueItems() {
        $API.preferenceEdit({
            filter: "unique_playlist",
            value: ignoreDuplicates ? "0" : "1",
        }).then((result) => {
            ignoreDuplicates = parseInt(result.value) === 1;
        });
    }

    onMount(async () => {
        let uniquePlaylistPref = await $API.userPreference({
            filter: "unique_playlist",
        });
        ignoreDuplicates = parseInt(uniquePlaylistPref.value) === 1;
    });
</script>

<sl-drawer
    bind:this={drawer}
    label={$_("text.playlistAddTo")}
    onsl-request-close={keepDrawerOpen}
>
    <PlaylistSelector bind:selectedPlaylists multiple={true} type="playlists" />

    <sl-checkbox checked={ignoreDuplicates} onsl-change={toggleUniqueItems}>
        {$_("text.skipDuplicates")}
    </sl-checkbox>

    <sl-button
        onclick={() => drawerEdit.show()}
        slot="footer"
        variant="primary"
    >
        New Playlist
    </sl-button>

    <sl-button
        disabled={selectedPlaylists?.length < 1}
        onclick={handleSave}
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
