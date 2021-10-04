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
    import Artwork from '../components/artwork.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGYear from "../../public/images/year.svg";
    import SVGGenre from "../../public/images/label.svg";

    export let id;

    let theme;
    $: theme = $ThemeIsLight ? 'light' : 'dark';
</script>

{#await getAlbum(id)}
    <p>Loading album</p>
{:then album}
    {#if album.id}
        {#if album.useBackground && !$ThemeIsLight}
            <img class="art-background" src="{album.art}&thumb=10" alt="" loading="lazy" in:fade/>
        {/if}

        <div class="container">
            <div class="details-container">
                <div class="details">
                    <div class="cover-container">
                        <Artwork type="album" className="cover" src="{album.art}" thumbSize="32" alt="Image of {album.name}" width="384" height="384" />
                    </div>

                    <div class="info">
                        <h1 class="title">{album.name}</h1>
                        <div class="meta">
                            <span class="date"><Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link></span>
                            <Link to="artists/{album.artist.id}"><SVGArtist class="inline"/> {album.artist.name}</Link>
                        </div>
                        <p>
                            {formatTotalTime(album.time)}
                            &bull;
                            {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}
                        </p>

                        {#if album.genre.length > 0}
                            <ul class="genres">
                                {#each album.genre as genre}
                                    <li><Link to="genres/{genre.id}"><SVGGenre class="inline" /> {genre.name}</Link></li>
                                {/each}
                            </ul>
                        {/if}

                        <div class="inline">
                            <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}" />

                            <ThirdPartyServices data={album} type="album" />
                        </div>

                        <Actions
                            type="album"
                            mode="fullButtons"
                            id="{album.id}"
                            count="{album.songcount}"
                            artistID="{album.artist.id}"
                        />
                    </div>
                </div>
            </div>

            <div class="songs">
                <AlbumSongs id={album.id}/>
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

    .inline {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        flex-wrap: wrap;
    }

    .songs {
        color: var(--color-text-body);
    }

    .cover-container :global(.cover) {
        border-radius: 10px;
    }

    .cover-container {
        margin-bottom: var(--spacing-lg);
        margin-right: var(--spacing-lg);
        flex-shrink: 0;
        max-width: 200px;
    }

    .title {
        text-transform: unset;
        font-size: 40px;
        letter-spacing: -0.02em;
        line-height: 1;
        margin-bottom: 0.2em;
    }

    .date {
        margin-right: var(--spacing-lg);
    }

    .meta {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    .container {
        display: flex;
        flex-direction: column;
    }

    .details {
        display: flex;
    }

    .genres {
        display: flex;
        gap: var(--spacing-lg);
    }

    @media all and (min-width: 1024px) {
        .container {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
            max-width: 1300px;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            padding: 0;
        }

        .cover-container :global(.cover) {
            width: 100%;
            max-width: 300px;
        }

        .cover-container {
            max-width: none;
        }

        .details {
            flex-direction: column;
        }

        .details-container {
            width: 40%;
            overflow-y: auto;
            height: 100%;
            padding: var(--spacing-xxl);
            border-right: 2px solid var(--color-lines);
        }

        .songs {
            width: 60%;
            overflow-y: auto;
            padding: var(--spacing-xxl);
        }
    }
</style>