<script>
    import Rating from "~/components/rating/rating.svelte";
    import Art from "~/components/art.svelte";

    let { data = null, type = undefined } = $props();

    let artist = $derived(data);
</script>

<div class="artist-card card">
    {#if artist}
        <div class="art-container">
            <a href="#/artist/{artist.id}" title={artist.name}>
                <Art size="large" data={artist} type="artist" radius="5px" />
            </a>
        </div>
        <div class="title truncate">
            <a href="#/artist/{artist.id}" title={artist.name}>
                {artist.name}
            </a>
        </div>

        <div class="rating-container">
            <Rating type="artist" data={artist} />
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md);"
        >
            <sl-skeleton
                style="--border-radius: 5px; aspect-ratio: 1/1"
            ></sl-skeleton>

            <sl-skeleton style="width: 80%;"></sl-skeleton>
            <sl-skeleton style="width: 60%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Artist grids should have this on the containing element */
    :global(.artist-grid) {
        row-gap: var(--spacing-xxl);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    :global(.artist-scroll) {
        gap: var(--spacing-md);
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
        overflow: hidden;
        padding-block-end: 100%;
        width: 100%;
        position: relative;
        aspect-ratio: 1 / 1;
        font-size: 0;
    }

    .artist-card :global(.c-art img) {
        height: 100%;
        width: 100%;
        object-fit: cover;
        position: absolute;
        inset-block-start: 0;
        inset-block-end: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
    }

    .title {
        margin: var(--spacing-md) 0 var(--spacing-md);
    }

    .rating-container {
        display: flex;
    }
</style>
