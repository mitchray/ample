<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGYear from "../../public/images/year.svg";

    export let data = null;

    let album;
    $: album = data;
</script>

<div class="album-card">
    {#if album}
        <div class="image-container">
            <img width="160" height="160" class="image" src="{album.art}&thumb=22" alt="Image of {album.name}">
            <img width="160" height="160" class="image-thumb" src="{album.art}&thumb=1" alt="" loading="lazy">

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

    .album-card:hover .image {
        opacity: 0;
    }

    .album-card:hover .actions {
        opacity: 1;
    }

    .image-container {
        line-height: 0;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    .image-container:after {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background-image: linear-gradient(
            to top,
            rgb(var(--color-highlight-rgb)) 0%,
            rgba(var(--color-highlight-rgb), 0.738) 19%,
            rgba(var(--color-highlight-rgb), 0.541) 34%,
            rgba(var(--color-highlight-rgb), 0.382) 47%,
            rgba(var(--color-highlight-rgb), 0.278) 56.5%,
            rgba(var(--color-highlight-rgb), 0.194) 65%,
            rgba(var(--color-highlight-rgb), 0.126) 73%,
            rgba(var(--color-highlight-rgb), 0.075) 80.2%,
            rgba(var(--color-highlight-rgb), 0.042) 86.1%,
            rgba(var(--color-highlight-rgb), 0.021) 91%,
            rgba(var(--color-highlight-rgb), 0.008) 95.2%,
            rgba(var(--color-highlight-rgb), 0.002) 98.2%,
            rgba(var(--color-highlight-rgb), 0) 100%
        );
        z-index: 10;
        opacity: 1;
    }

    .image {
        color: transparent;
        background-color: var(--color-background);
        height: 100%;
        object-fit: cover;
        width: 100%;
        opacity: 1;
        transition: opacity 300ms ease;
        z-index: 20;
        position: relative;
    }

    .image-thumb {
        object-fit: cover;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(5px);
    }

    .actions {
        position: absolute;
        bottom: var(--spacing-md);
        width: 100%;
        display: flex;
        justify-content: center;
        opacity: 0;
        z-index: 30;
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