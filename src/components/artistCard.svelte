<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';
    import Artwork from '../components/artwork.svelte';

    export let data = null;

    let artist;
    $: artist = data;
</script>

<div class="artist-card">
    {#if artist}
        <Artwork type="artist" className="image" src="{artist.art}" thumbSize="22" alt="Image of {artist.name}" width="400" height="400" />
        <div class="title"><Link to="artists/{artist.id}" title="{artist.name}">{artist.name}</Link></div>

        <div class="rating-container">
            <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />
        </div>
    {:else}
        <img class="image" height="400" width="400" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
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
        gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    :global(.artist-scroll) {
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
        padding: var(--spacing-md);
        padding-bottom: var(--spacing-lg);
        border: 2px solid var(--color-card-background);
        border-radius: 10px;
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
    }

    .artist-card:hover {
        border-color: transparent;
        background-color: var(--color-card-background);
    }

    .artist-card :global(.image) {
        width: 100%;
        height: auto;
        border-radius: 999px;
    }

    .title {
        font-weight: 700;
        text-align: center;
        margin: var(--spacing-lg) var(--spacing-sm) var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .rating-container {
        display: flex;
        justify-content: center;
        margin-top: auto;
    }
</style>