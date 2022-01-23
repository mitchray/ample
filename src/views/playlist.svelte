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

                                    {#if isSmartlist}
                                        <button on:click={handleSongLoad} class="icon-button refresh-button"><SVGRefresh/></button>
                                    {/if}
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
                        <Lister2 bind:data={songs} type="song" id="{playlist.id}" />
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
        letter-spacing: -0.02em;
        line-height: 1.1;
        text-align: center;
        margin-bottom: var(--spacing-sm);
        font-weight: 700;
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

    /* OLD */

    /*!* reassign to variable else local override has no effect *!*/
    /*:global(.site-content-inner) {*/
    /*    color: var(--color-text-primary);*/
    /*}*/

    /*.songs-container {*/
    /*    color: var(--color-text-primary);*/
    /*}*/
    
    /*.cover {*/

    /*}*/

    /*.cover-container {*/
    /*    margin-bottom: var(--spacing-lg);*/
    /*    margin-right: var(--spacing-lg);*/
    /*    flex-shrink: 0;*/
    /*    max-width: 200px;*/
    /*    line-height: 0;*/
    /*    border: 1px solid hsla(0, 0%, 50%, 0.2);*/
    /*    border-radius: 10px;*/
    /*    overflow: hidden;*/
    /*}*/

    /*.title {*/
    /*    font-size: 40px;*/
    /*    letter-spacing: -0.02em;*/
    /*    line-height: 1;*/
    /*    margin-bottom: 0.2em;*/
    /*}*/

    /*.container {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*}*/

    /*.details {*/
    /*    display: flex;*/
    /*}*/

    /*@media all and (min-width: 1800px) {*/
    /*    .container {*/
    /*        flex-direction: row;*/
    /*        justify-content: space-between;*/
    /*        width: 100%;*/
    /*        position: absolute;*/
    /*        top: 0;*/
    /*        bottom: 0;*/
    /*        left: 0;*/
    /*        padding: 0;*/
    /*    }*/

    /*    .cover {*/
    /*        width: 100%;*/
    /*        max-width: 300px;*/
    /*    }*/

    /*    .cover-container {*/
    /*        max-width: none;*/
    /*    }*/

    /*    .details {*/
    /*        flex-direction: column;*/
    /*        position: sticky;*/
    /*        top: 0;*/
    /*    }*/

    /*    .details-container {*/
    /*        width: 450px;*/
    /*        flex-shrink: 0;*/
    /*        overflow-y: auto;*/
    /*        height: 100%;*/
    /*        padding: var(--spacing-xxl);*/
    /*        border-right: 2px solid var(--color-border); !* TODO redo with container queries *!*/
    /*    }*/

    /*    .songs-container {*/
    /*        width: 100%;*/
    /*        overflow-y: auto;*/
    /*        padding: var(--spacing-xxl);*/
    /*    }*/
    /*}*/
</style>