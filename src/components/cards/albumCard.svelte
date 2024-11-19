<script>
    import { formatReleaseType } from "~/logic/formatters.js";
    import Rating from "~/components/rating/rating.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Art from "~/components/art.svelte";
    import Badge from "~/components/badge.svelte";

    let { data = null, type = undefined } = $props();

    let album = $derived(data);
</script>

<div class="album-card card">
    {#if album}
        <div class="image-container">
            <a href="#/album/{album.id}" title={album.name}>
                <Art size="large" data={album} type="album" radius="8px" />
            </a>
        </div>

        <div class="info">
            <div class="top">
                <div class="details">
                    <div class="meta secondary-info">
                        {#if album.year}<span class="year">
                                {album.year}
                            </span>{/if}
                        {#if album.type}
                            <Badge text={formatReleaseType(album.type)} />
                        {/if}
                    </div>
                    <div class="title truncate">
                        <a href="#/album/{album.id}" title={album.name}>
                            {album.name}
                        </a>
                    </div>
                    <div class="artist truncate secondary-info">
                        <a
                            href="#/artist/{album.artist.id}"
                            title={album.artist.name}
                        >
                            {album.artist.name}
                        </a>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div class="rating-container">
                    <Rating type="album" data={album} />
                </div>

                <div class="actions">
                    <Actions
                        item={album}
                        type="album"
                        displayMode="miniButtons"
                        showLinks={true}
                        showShuffle={album.songcount > 1}
                    />
                </div>
            </div>
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md);"
        >
            <sl-skeleton
                style="--border-radius: 5px; aspect-ratio: 1/1"
            ></sl-skeleton>

            <sl-skeleton style="width: 40%;"></sl-skeleton>
            <sl-skeleton style="width: 80%;"></sl-skeleton>
            <sl-skeleton style="width: 60%;"></sl-skeleton>
            <sl-skeleton style="width: 50%;"></sl-skeleton>
            <sl-skeleton style="width: 80%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Album grids should have this on the containing element */
    :global(.album-grid) {
        row-gap: var(--spacing-xxl);
        column-gap: var(--spacing-lg);
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }

    /* allow thinner columns on mobile */
    @media (max-width: 650px) {
        :global(.album-grid) {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
    }

    :global(.album-scroll) {
        /*grid-template-columns: inherit;*/
    }

    :global(.album-scroll) .album-card,
    :global(.album-card-expanded) .album-card {
        width: 190px;
    }

    .album-card {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .image-container {
        font-size: 0;
        position: relative;
        z-index: 1;
        justify-content: center;
        display: flex;
        margin-block-end: var(--spacing-sm);
        aspect-ratio: 1 / 1;
    }

    .image-container :global(img) {
        color: transparent;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .top {
        margin-block-end: var(--spacing-md);
    }

    .bottom {
        padding-block-start: 0;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        margin-block-end: var(--spacing-md);
    }

    .meta {
        display: flex;
        gap: var(--spacing-sm);
    }
</style>
