<script>
    import { Link } from 'svelte-routing';

    import { Theme } from '../stores/status';

    import { getAlbum } from "../logic/album";
    import { formatTotalTime } from "../logic/helper";

    import Rating from '../components/rating.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions2 from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGYear from "../../public/images/year.svg";
    import SVGTrack from "../../public/images/music_note.svg";
    import SVGClock from "../../public/images/clock.svg";

    export let id;

    let theme;
    $: theme = $Theme;
</script>

<svelte:head>
    <link rel="stylesheet" href='/ample/public/css/containerqueries/album.css'>
</svelte:head>

{#await getAlbum({id: id, withTracks: true})}
    <p>Loading album</p>
{:then album}
    {#if album.id}
        <div class="wrapper">
            <div class="container">
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
                            <div class="name">
                                <h1 class="title">{album.name}</h1>
                                <div class="artist">
                                    <Link to="artists/{album.artist.id}">{album.artist.name}</Link>
                                </div>
                            </div>

                            <Actions2
                                type="album"
                                mode="fullButtons"
                                id="{album.id}"
                                showShuffle={album.songcount > 1}
                                data={Object.create({artistID: album.artist.id})}
                            />

                            <div class="meta">
                                <span class="date"><Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link></span>
                                <span><SVGClock class="inline"/> {formatTotalTime(album.time)}</span>
                                <span><SVGTrack class="inline"/> {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}</span>
                                <ThirdPartyServices data={album} type="album" />
                            </div>

                            <Genres genres="{album.genre}" />
                        </div>
                    </div>
                </div>
                <div class="songs-container">
                    <div class="songs">
                        {#each [...album.ampleSongs] as [key, value]}
                            <Lister2
                                data={value}
                                type="song"
                                tableOnly={true}
                                zone="album-contents"
                                actionData={{
                                    type: "album",
                                    mode: "miniButtons",
                                    showShuffle: value.length > 1,
                                    data: Object.create({songs: value})
                                }}
                            />
                        {/each}
                    </div>
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
    .wrapper {
        container: size / album-page-wrapper;
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
        overflow: auto;
        height: auto;
        padding: var(--spacing-xxl);
    }

    .container {
        container: inline-size / album-wrapper;
    }

    .details-container {
        container: inline-size / album-details-wrapper;
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
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .rating {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .name {
        background-color: var(--color-card-highlight);
        padding: var(--spacing-md);
        border-radius: 5px;
        margin-bottom: var(--spacing-lg);
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        text-align: center;
        margin-bottom: var(--spacing-sm);
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
    }

    .artist {
        text-align: center;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
        align-items: center;
    }
</style>