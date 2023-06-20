<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import Menu from '../components/menu.svelte';
    import Lister from '../components/lister/lister.svelte';

    let playlists = [];
    let showPlaylistCreation = false;
    let loading = true;

    let title = $_('text.playlists');
    $PageTitle = title;

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

<button id="js-playlistsNew" on:click={handleShowPlaylistCreator} class="new-playlist-button button button--primary">{$_('text.playlistNew')}</button>

{#if showPlaylistCreation}
    <Menu anchor="bottom" toggleSelector={"#js-playlistsNew"} bind:isVisible={showPlaylistCreation} >
        <PlaylistEdit isNew={true} bind:isVisible={showPlaylistCreation} />
    </Menu>
{/if}

<div class="page-main">
    {#if loading}
        <p>{$_('text.loading')}</p>
    {:else}
        {#if playlists?.length > 0}
            <Lister
                bind:data={playlists}
                type="playlist"
                initialSort="name"
                virtualList={true}
                actionData={{
                    disable: true
                }}
            />
        {:else}
            <p>{$_('text.noItemsFound')}</p>
        {/if}
    {/if}
</div>

<style>
    .new-playlist-button {
        margin-block-end: var(--spacing-xxl);
    }
</style>

