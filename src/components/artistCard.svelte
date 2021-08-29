<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';

    export let data = null;

    let artist;
    $: artist = data;
</script>

<div class="artist-card">
    {#if artist}
        <img class="image" height="400" width="400" src="{artist.art}&thumb=22" alt="Image of {artist.name}" loading="lazy">
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
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    :global(.artist-scroll) {
        gap: 20px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.artist-scroll) .artist-card {
        width: 160px;
    }

    .artist-card {
        background-color: var(--color-card-background);
        padding: var(--spacing-md);
        padding-bottom: var(--spacing-lg);
        border-radius: 10px;
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
    }

    .image {
        color: transparent;
        background-color: var(--color-tint-100);
        width: 100%;
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