<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import Rating from '../../components/rating.svelte';

    export let data = null; // needed for cardList dynamic components

    let artist;
    $: artist = data;
</script>

<div class="artist-card card">
    {#if artist}
        <div class="art-container">
            <Link to="artists/{artist.id}" title="{artist.name}">
                <img class="image"
                    src="{artist.art}&thumb=22"
                    alt="Image of {artist.name}"
                    width="400"
                    height="400"
                    on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                />
            </Link>
        </div>
        <div class="title"><Link to="artists/{artist.id}" title="{artist.name}">{artist.name}</Link></div>

        <div class="rating-container">
            <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />
        </div>
    {:else}
        <div class="art-container">
            <img class="image"
                height="400"
                width="400"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
            >
        </div>
        <div class="title">Loading</div>

        <div class="rating-container">
            <Rating />
        </div>
    {/if}
</div>

<style>
    /* Artist grids should have this on the containing element */
    :global(.artist-grid) {
        display: grid;
        row-gap: var(--spacing-xxl);
        column-gap: var(--spacing-lg);
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    :global(.artist-scroll) {
        border: 2px solid var(--color-separator);
        border-radius: 15px;
        padding: var(--spacing-lg);
        gap: var(--spacing-md);
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.artist-scroll) .artist-card {
        width: 180px;
    }

    .artist-card {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
    }

    .art-container {
        border-radius: 5px;
        overflow: hidden;
        padding-bottom: 100%;
        width: 100%;
        position: relative;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        aspect-ratio: 1 / 1;
        font-size: 0;
    }

    .image {
        height: 100%;
        width: 100%;
        object-fit: cover;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .title {
        margin: var(--spacing-md) 0 var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rating-container {
        display: flex;
    }
</style>