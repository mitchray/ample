<script>
    import { onMount, tick } from "svelte";

    import { getSongsFromPlaylist } from "../logic/song";
    import { getPlaylist } from '../logic/playlist';

    import Rating from '../components/rating.svelte';
    import Lister2 from '../components/lister/lister.svelte';
    import PlaylistArt from '../components/playlist/playlist_art.svelte';
    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import PlaylistDelete from '../components/playlist/playlist_delete.svelte';
    import Menu from '../components/menu.svelte';

    import SVGPlaylist from "../../public/images/queue_music.svg";
    import SVGSmartlist from "../../public/images/smartlist.svg";

    import '../../public/css/containerqueries/playlist.css';

    export let id;

    let playlist;
    let songs = [];
    let loading = true;
    let isSmartlist = false;
    let playlistEditIsVisible = false;
    let playlistDeleteIsVisible = false;

    $: songs = songs;

    async function handleEditPlaylist() {
        playlistEditIsVisible = !playlistEditIsVisible;

        await tick();
    }

    async function handleDeletePlaylist() {
        playlistDeleteIsVisible = !playlistDeleteIsVisible;

        await tick();
    }

    onMount(async () => {
        playlist = await getPlaylist(id);

        if (playlist && playlist.id) {
            await handleSongLoad();
            isSmartlist = playlist.id.match(/^smart_/);
        }

        loading = false;
    });

    async function handleSongLoad() {
        songs = await getSongsFromPlaylist({id: id});
    }
</script>

{#if loading}
    <p>Loading playlist</p>
{:else}
    {#if playlist.id}
        <div class="wrapper">
            <div class="container">
                <div class="details-container">
                    <div class="details">
                        <div class="cover-rating">
                            <div class="art-container">
                                <PlaylistArt bind:songs fallback="{playlist.art}" />
                            </div>

                            {#if !isSmartlist}
                                <div class="rating">
                                    <Rating type="playlist" id="{playlist.id}" rating="{playlist.rating}" flag="{playlist.flag}" averageRating="{playlist.averagerating}" />
                                </div>
                            {/if}
                        </div>

                        <div class="info">
                            <div class="type">
                                {#if isSmartlist}
                                    <SVGSmartlist class="inline" /> Smartlist
                                {:else}
                                    <SVGPlaylist class="inline" /> Playlist
                                {/if}
                            </div>

                            <div class="name">
                                <h1 class="title">
                                    {playlist.name}
                                </h1>
                            </div>

                            {#if !isSmartlist}
                                <div class="playlist-actions">
                                    <button class="button button--regular" type="button" id="js-action-playlist_edit_{id}" on:click={handleEditPlaylist} title="Edit">Edit</button>
                                    <button class="button button--danger" type="button" id="js-action-playlist_delete_{id}" on:click={handleDeletePlaylist} title="Delete">Delete</button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="songs-container">
                    <Lister2
                        bind:data={songs}
                        type="playlist_songs"
                        showCheckboxes={!isSmartlist}
                        tableOnly={true}
                        showIndex={true}
                        actionData={{
                            type: "",
                            mode: "fullButtons",
                            showShuffle: songs.length > 1,
                            data: Object.create({songs: songs})
                        }}
                    />
                </div>
            </div>
        </div>

        {#if playlistEditIsVisible}
            <Menu anchor="left-center" toggleSelector={"#js-action-playlist_edit_" + id} bind:isVisible={playlistEditIsVisible}>
                <PlaylistEdit bind:playlist={playlist} bind:isVisible={playlistEditIsVisible} />
            </Menu>
        {/if}

        {#if playlistDeleteIsVisible}
            <Menu anchor="left-center" toggleSelector={"#js-action-playlist_delete_" + id} bind:isVisible={playlistDeleteIsVisible}>
                <PlaylistDelete bind:playlist={playlist} bind:isVisible={playlistDeleteIsVisible} />
            </Menu>
        {/if}
    {:else}
        <p>Unable to find playlist with that ID</p>
    {/if}
{/if}

<style>
    .wrapper {
        container-name: playlist-page-wrapper;
        container-type: size;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .container {
        height: 100%;
        width: 100%;
        will-change: overflow;
    }

    .details-container,
    .songs-container {
        height: auto;
        padding: var(--spacing-xxl);
    }

    .container {
        container-name: playlist-wrapper;
        container-type: inline-size;
    }

    .details-container {
        container-name: playlist-details-wrapper;
        container-type: inline-size;
        padding-bottom: 0;
    }

    .details {
        background-color: var(--color-card-primary);
        border-radius: 10px;
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-md);
        margin-bottom: var(--spacing-xl);
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .art-container {
        width: 240px;
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        font-size: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        margin-bottom: var(--spacing-lg);
    }

    .rating {
        margin-bottom: var(--spacing-lg);
    }

    .info {
        display: flex;
        gap: var(--spacing-lg);
        flex-direction: column;
    }

    .name {
        background-color: var(--color-card-highlight);
        padding: var(--spacing-md);
        border-radius: 5px;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        text-align: center;
        margin-bottom: var(--spacing-sm);
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .playlist-actions {
        display: flex;
        flex-direction: row;
    }

    .type {
        --roboto-opsz: 32;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
</style>