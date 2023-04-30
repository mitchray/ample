<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import Menu from '../components/menu.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    let newPlaylist;
    let playlists = [];
    let showPlaylistCreation = false;
    let loading = true;

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
    <title>Playlists</title>
</svelte:head>

<h1 class="page-title">Playlists</h1>

<button id="js-playlistsNew" on:click={handleShowPlaylistCreator} class="new-playlist-button button button--primary">New</button>

{#if showPlaylistCreation}
    <Menu anchor="bottom-center" toggleSelector={"#js-playlistsNew"} bind:isVisible={showPlaylistCreation} >
        <PlaylistEdit isNew={true} bind:playlist={newPlaylist} bind:isVisible={showPlaylistCreation} />
    </Menu>
{/if}

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

