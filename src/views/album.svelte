<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { ThemeIsLight } from '../stores/status';

    import { getAlbum } from "../logic/album";
    import { formatTotalTime } from "../logic/helper";

    import AlbumSongs from '../components/albumSongs.svelte';
    import Rating from '../components/rating.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGYear from "../../public/images/year.svg";
    import SVGGenre from "../../public/images/label.svg";
    import SVGTrack from "../../public/images/music_note.svg";
    import SVGClock from "../../public/images/clock.svg";

    export let id;

    let theme;
    $: theme = $ThemeIsLight ? 'light' : 'dark';
</script>

<svelte:head>
    <link rel="stylesheet" href='/ample/public/css/containerqueries/album.css'>
</svelte:head>

{#await getAlbum(id)}
    <p>Loading album</p>
{:then album}
    {#if album.id}
        {#if album.useBackground && !$ThemeIsLight}
            <img class="art-background" src="{album.art}&thumb=10" alt="" loading="lazy" in:fade/>
        {/if}

        <div class="container album-wrapper">
            <div class="album-container">
                <div class="details-container">
                    <div class="details">
                        <div class="cover-rating">
                            <div class="art-container">
                                <img class="art" src="{album.art}&thumb=32" alt="Image of {album.name}" width="384" height="384" />
                            </div>

                            <div class="rating">
                                <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}" />
                            </div>
                        </div>

                        <div class="info">
                            <h1 class="title">{album.name}</h1>
                            <div class="artist">
                                <Link to="artists/{album.artist.id}"><SVGArtist class="inline"/> {album.artist.name}</Link>
                            </div>
                            <div class="meta">
                                <span class="date"><Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link></span>
                                <span><SVGClock class="inline"/> {formatTotalTime(album.time)}</span>
                                <span><SVGTrack class="inline"/> {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}</span>
                            </div>

                            {#if album.genre.length > 0}
                                <ul class="genres">
                                    {#each album.genre as genre}
                                        <li><Link to="genres/{genre.id}"><SVGGenre class="inline" /> {genre.name}</Link></li>
                                    {/each}
                                </ul>
                            {/if}

                            <div class="actions">
                                <Actions
                                    type="album"
                                    mode="fullButtons"
                                    id="{album.id}"
                                    count="{album.songcount}"
                                    artistID="{album.artist.id}"
                                />

                                <ThirdPartyServices data={album} type="album" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="songs-container">
                    <AlbumSongs id={album.id}/>
                </div>
            </div>
        </div>
    {:else}
        <p>Unable to find album with that ID</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    /* reassign to variable else local override has no effect */
    :global(.site-content-inner) {
        color: var(--color-text-body);
    }

    .container {
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        padding: var(--spacing-xxl);
    }

    .album-wrapper {
        container: inline-size / album-wrapper;
    }

    .details-container {
        container: inline-size / album-details-wrapper;
    }

    .details {
        margin-bottom: var(--spacing-xxl);
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid hsla(0, 0%, 50%, 0.1);
        box-shadow: var(--shadow-lg);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        z-index: -1;
        position: relative;
    }

    .rating {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .title {
        text-transform: unset;
        letter-spacing: -0.02em;
        line-height: 1;
        text-align: center;
        margin-bottom: var(--spacing-sm);
    }

    .artist {
        text-align: center;
        margin-bottom: var(--spacing-lg);
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
    }

    .genres {
        display: flex;
        gap: var(--spacing-sm) var(--spacing-lg);
        flex-wrap: wrap;
    }

    .actions {
        display: flex;
        flex-direction: column-reverse;
    }
</style>