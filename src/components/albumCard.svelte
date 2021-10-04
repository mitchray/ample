<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';
    import Artwork from '../components/artwork.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGYear from "../../public/images/year.svg";

    export let data = null;

    let album;
    $: album = data;
</script>

<div class="album-card">
    {#if album}
        <div class="image-container">
            <Artwork type="album" className="image" src="{album.art}" thumbSize="22" alt="Image of {album.name}" width="160" height="160" />

            <div class="actions">
                <Actions
                    type="album"
                    mode="miniButtons"
                    id="{album.id}"
                    count={album.songcount}
                    albumID="{album.id}"
                    artistID="{album.artist.id}"
                />
            </div>
        </div>

        <div class="details">
            <div class="title"><Link to="albums/{album.id}" title="{album.name}">{album.name}</Link></div>
            <div class="artist"><Link to="artists/{album.artist.id}" title="{album.artist.name}"><SVGArtist class="inline"/> {album.artist.name}</Link></div>
            <div class="year">
                {#if album.year > 0}
                    <Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link> &bull;
                {/if}
                {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}
            </div>
        </div>

        <div class="rating-container">
            <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}"/>
        </div>
    {:else}
        <div class="image-container">
            <img width="160" height="160" class="image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
        </div>

        <div class="details">
            <div class="title">Loading</div>
            <div class="artist"><br></div>
            <div class="year"><br></div>
        </div>

        <div class="rating-container">
            <Rating />
        </div>
    {/if}
</div>

<style>
    /* Album grids should have this on the containing element */
    :global(.album-grid) {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    :global(.album-scroll) {
        gap: 20px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.album-scroll) .album-card {
        width: 180px;
    }

    .album-card {
        background-color: var(--color-card-background);
        padding: var(--spacing-md);
        padding-bottom: var(--spacing-sm);
        border-radius: 10px;
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
    }

    .album-card :global(.image) {
        border-radius: 5px;
        overflow: hidden;
    }

    .album-card :global(.container) {
        transition: all 200ms ease;
        position: relative;
        z-index: 20;
        will-change: filter, transform;
    }

    .album-card:hover :global(.container) {
        filter: contrast(80%) drop-shadow(0 15px 10px rgba(0,0,0,0.2));
        transform: perspective(1000px) rotateX(50deg) translateY(-30%);
        pointer-events: none;
    }

    .album-card:hover .actions {
        opacity: 1;
        transition-duration: 1ms;
    }

    .image-container {
        line-height: 0;
        position: relative;
        z-index: 1;
        justify-content: center;
        display: flex;
    }

    .image-container :global(img) {
        color: transparent;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .actions {
        position: absolute;
        bottom: var(--spacing-md);
        display: flex;
        justify-content: center;
        opacity: 0;
        background-color: var(--color-lines);
        padding: var(--spacing-sm);
        border-radius: 999px;
        transition: opacity ease 2s;
    }

    .actions :global(button) {
        --color-button-bg-primary: var(--color-interface);
    }

    .actions :global(button:hover) {
        --color-button-bg-hover: var(--color-interface-hover);
    }

    .details {
        margin: var(--spacing-md) 0;
    }

    .title {
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }

    .title,
    .artist {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: auto;
        margin-bottom: var(--spacing-md);
    }
</style>