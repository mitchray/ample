<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import Menu from '../components/menu.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    let newPlaylist;
    let playlists = [];
    let showPlaylistCreation = false;
    let loading = true;

    let title = "Playlists";
    $PageTitle = title;

    $: {
        if (newPlaylist) {
            newPlaylist.isNew = true;

            playlists = [
                newPlaylist,
                ...playlists
            ]

            // reset
            newPlaylist = null;
            showPlaylistCreation = false;
        }

        playlists = playlists;
    }

    function handleShowPlaylistCreator() {
        showPlaylistCreation = !showPlaylistCreation;
    }

    onMount(async () => {
        playlists = await $API.playlists({ hide_search: 1 });
        loading = false;
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<button id="js-playlistsNew" on:click={handleShowPlaylistCreator} class="new-playlist-button button button--primary">New Playlist</button>

{#if showPlaylistCreation}
    <Menu anchor="bottom-center" toggleSelector={"#js-playlistsNew"} bind:isVisible={showPlaylistCreation} >
        <PlaylistEdit isNew={true} bind:playlist={newPlaylist} bind:isVisible={showPlaylistCreation} />
    </Menu>
{/if}

<div class="page-main">
    {#if loading}
        <p>Loading playlists</p>
    {:else}
        {#if playlists && playlists.length > 0}
            <Lister2
                    data={playlists}
                    type="playlist"
                    initialSort="name"
                    actionData={{
                disable: true
            }}
            />
        {:else}
            <p>No playlists found</p>
        {/if}
    {/if}
</div>

<style>
    .new-playlist-button {
        margin-bottom: var(--spacing-xxl);
    }
</style>

