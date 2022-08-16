<script>
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';

    import { getSongsFromPlaylist } from "../logic/song";
    import { getPlaylist } from '../logic/playlist';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGPlaylist from "../../public/images/queue_music.svg";
    import SVGSmartlist from "../../public/images/smartlist.svg";
    import SVGRefresh from "../../public/images/refresh.svg";
    import SVGTrack from "../../public/images/music_note.svg";

    export let id;

    let playlist;
    let songs = [];
    let loading = true;
    let songCount;
    let isSmartlist = false;
    let loadedTime;

    $: songs = songs;
    $: songCount = songs.length;

    onMount(async () => {
        playlist = await getPlaylist(id);

        if (playlist && playlist.id) {
            await handleSongLoad();
            isSmartlist = playlist.id.match(/^smart_/);
        }

        loading = false;
    });

    async function handleSongLoad() {
        songs = await getSongsFromPlaylist(id);
        loadedTime = new Date();
    }
</script>

<svelte:head>
    <link rel="stylesheet" href='/ample/public/css/containerqueries/playlist.css'>
</svelte:head>

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
                                <img class="art" src="{playlist.art}&thumb=32" alt="Image of {playlist.name}" width="384" height="384" />
                            </div>

                            {#if !isSmartlist}
                                <div class="rating">
                                    <Rating type="playlist" id="{playlist.id}" rating="{playlist.rating}" flag="{playlist.flag}" averageRating="{playlist.averagerating}" />
                                </div>
                            {/if}
                        </div>

                        <div class="info">
                            <div class="name">
                                <h1 class="title">
                                    {playlist.name}
                                </h1>
                            </div>

                            <div class="meta">
                                <span>
                                    {#if isSmartlist}
                                        <SVGSmartlist class="inline" /> Smartlist
                                    {:else}
                                        <SVGPlaylist class="inline" /> Playlist
                                    {/if}
                                </span>

                                <span>
                                    <SVGTrack class="inline"/> {songCount} {parseInt(songCount) === 1 ? 'song' : 'songs'}
                                </span>

                                {#if isSmartlist}
                                    <button on:click={handleSongLoad} class="button button--regular refresh-button"><SVGRefresh /> Refresh</button>
                                {/if}
                            </div>

                            <div class="actions">
                                <Actions
                                    type="playlist"
                                    mode="fullButtons"
                                    count="{playlist.items}"
                                    direct={songs}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="songs-container">
                    {#key loadedTime}
                        <Lister2 bind:data={songs} type="playlist_songs" showCheckboxes={!isSmartlist} />
                    {/key}
                </div>
            </div>
        </div>
    {:else}
        <p>Unable to find playlist with that ID</p>
    {/if}
{/if}

<style>
    .wrapper {
        container: size / playlist-page-wrapper;
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
        container: inline-size / playlist-wrapper;
    }

    .details-container {
        container: inline-size / playlist-details-wrapper;
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
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        font-size: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        margin-bottom: var(--spacing-lg);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .rating {
        margin-bottom: var(--spacing-lg);
    }

    .name {
        background-color: var(--color-card-highlight);
        padding: var(--spacing-md);
        border-radius: 5px;
        margin-bottom: var(--spacing-md);
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

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        align-items: center;
    }
</style>