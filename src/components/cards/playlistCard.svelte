<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Rating from "~/components/rating/rating.svelte";
    import Art from "~/components/art.svelte";

    let { data = null, type = undefined, isSmartlist = false } = $props();

    let playlist = $derived(data);
    let parentUrl = $derived(isSmartlist ? "smartlists" : "playlists");
</script>

<div class="playlist-card card">
    {#if playlist}
        <div class="top">
            <div class="title truncate">
                <a href="#/{parentUrl}/{playlist.id}" title={playlist.name}>
                    {playlist.name}
                </a>
            </div>
        </div>

        <div class="image-container">
            {#if playlist.type === "private"}
                <sl-badge variant="danger">
                    {$_("text.private")}
                </sl-badge>
            {/if}

            <a href="#/{parentUrl}/{playlist.id}" title={playlist.name}>
                <Art
                    size="large"
                    data={playlist}
                    type="playlist"
                    radius="8px"
                />
            </a>
        </div>

        <div class="details">
            {#if !isSmartlist}
                <div class="count secondary-info">
                    {$_("text.songsCount", {
                        values: { count: parseInt(playlist.items) },
                    })}
                </div>

                <div class="rating-container">
                    <Rating type="playlist" data={playlist} />
                </div>
            {/if}

            <div class="actions">
                <Actions
                    items={[playlist]}
                    type="playlist"
                    displayMode="miniButtons"
                    showShuffle={playlist.items > 1}
                />
            </div>
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md); align-items: center"
        >
            <sl-skeleton
                style="width: 80%; padding-block: var(--spacing-md);"
            ></sl-skeleton>

            <sl-skeleton
                style="--border-radius: 5px; aspect-ratio: 1/1; width: 100%;"
            ></sl-skeleton>

            <sl-skeleton style="width: 30%;"></sl-skeleton>
            <sl-skeleton style="width: 50%;"></sl-skeleton>
            <sl-skeleton style="width: 80%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Playlist grids should have this on the containing element */
    :global(.playlist-grid) {
        column-gap: var(--spacing-lg);
        row-gap: var(--spacing-xl);
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }

    :global(.playlist-scroll) .playlist-card {
        width: 220px;
    }

    :global(.playlist-card) {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    :global(.highlight .playlist-card) {
        border: 2px solid var(--color-primary);
    }

    .image-container {
        overflow: hidden;
        position: relative;
    }

    .image-container :global(a) {
        display: flex; /* white space removal */
    }

    .details {
        padding: var(--spacing-md);
        padding-block-end: 0;
        text-align: center;
    }

    .title {
        text-align: center;
    }

    .title :global(a) {
        display: block;
        padding: var(--spacing-md);
        font-size: 16px;
    }

    .count {
        margin-block-start: var(--spacing-sm);
        margin-block-end: var(--spacing-sm);
    }

    .private {
        z-index: 20;
        position: absolute;
        inset-block-end: 5px;
        inset-inline-end: 5px;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.8em;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--color-background);
        pointer-events: none;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--spacing-md);
    }

    .actions {
        display: flex;
        justify-content: center;
    }
</style>
