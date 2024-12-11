<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { API } from "~/stores/state.js";
    import PlaylistSelector from "~/components/playlist/playlist_selector.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import { onMount, setContext } from "svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { writable } from "svelte/store";

    export const show = () => drawer.show();
    let { songs = $bindable() } = $props();

    let drawer = $state(),
        drawerEdit = $state();
    let newPlaylist = $state(null);
    let playlists = writable([]);
    let selectedPlaylists = writable([]);
    let ignoreDuplicates = $state(false);
    let playlistResponse;
    let contextKey = "playlists";

    // Provide the playlists store to selector
    setContext(contextKey, { playlists, selectedPlaylists });

    $effect(() => {
        if (newPlaylist) {
            playlists.update((arr) => [newPlaylist, ...arr]);
        }
    });

    function handleSave() {
        $selectedPlaylists.forEach((playlist) => {
            songs.forEach((element) => {
                $API.playlistAdd({
                    filter: playlist.id,
                    id: element.id,
                    type: "song",
                });
            });
        });

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
        // not using store version due to updating locally
        let uniquePlaylistPref = await $API.userPreference({
            filter: "unique_playlist",
        });
        ignoreDuplicates = parseInt(uniquePlaylistPref.value) === 1;

        // get playlists
        playlistResponse = await $API.playlists({ hide_search: 1 });

        if (playlistResponse.error) {
            errorHandler(
                `getting playlists in playlist add to`,
                playlistResponse.error,
            );
            return;
        }

        playlists.set(playlistResponse.playlist);
    });
</script>

<sl-drawer
    bind:this={drawer}
    label={$_("text.playlistAddTo")}
    onsl-request-close={keepDrawerOpen}
>
    <PlaylistSelector multiple={true} {contextKey} />

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
