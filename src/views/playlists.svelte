<script>
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    import { getPlaylists } from "../logic/playlist";

    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import PlaylistCard from '../components/playlist/playlistCard.svelte';
    import Menu from '../components/menu.svelte';

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
        playlists = await getPlaylists();
        loading = false;
    });
</script>

<h1 class="page-title">Playlists</h1>

<button id="js-playlistsNew" on:click={handleShowPlaylistCreator} class="button button--primary">New playlist</button>

{#if showPlaylistCreation}
    <Menu anchor="bottom-center" toggleSelector={"#js-playlistsNew"} bind:isVisible={showPlaylistCreation} >
        <PlaylistEdit isNew={true} bind:playlist={newPlaylist} bind:isVisible={showPlaylistCreation} />
    </Menu>
{/if}

{#if loading}
    <p>Loading playlists</p>
{:else}
    {#if playlists && playlists.length > 0}
        <ul class="playlist-grid" in:fade>
            {#each playlists as playlist (playlist.id)}
                <li class:highlight={playlist.isNew} class:hide={playlist.isDeleted}>
                    <PlaylistCard bind:data={playlist} />
                </li>
            {/each}
        </ul>
    {:else}
        <p>No playlists found</p>
    {/if}
{/if}

<style>
    .hide {
        display: none;
    }
</style>

