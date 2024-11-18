<script>
    import { formatTotalTime } from "~/logic/formatters.js";
    import Rating from "~/components/rating/rating.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Art from "~/components/art.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /** @type {{data?: any, type?: any}} */
    let { data = null, type = undefined } = $props();

    let song = $derived(data);
    
</script>

<div class="song-card card">
    {#if song}
        <div class="top">
            <div class="image-container">
                <Art size="medium" data={song} type="song" radius="5px" />
            </div>

            <div class="info">
                <div class="time secondary-info">
                    {formatTotalTime(song.time)}
                </div>
                <div class="title truncate" title={song.name}>
                    <a href="#/song/{song.id}">{song.name}</a>
                </div>
                <div class="artist truncate secondary-info">
                    <a
                        href="#/artist/{song.artist.id}"
                        title={song.artist.name}
                    >
                        {song.artist.name}
                    </a>
                </div>
                <div class="album truncate secondary-info">
                    <a href="#/album/{song.album.id}" title={song.album.name}>
                        <MaterialSymbol name="album" />
                        {song.album.name}
                    </a>
                </div>

                <Rating type="song" data={song} />
            </div>
        </div>

        <div class="actions">
            <Actions
                item={song}
                showLinks={true}
                type="song"
                displayMode="miniButtons"
            />
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md);"
        >
            <div style="display: flex; gap: var(--spacing-md);">
                <sl-skeleton
                    style="--border-radius: 5px; aspect-ratio: 1/1; height: 96px;"
                ></sl-skeleton>

                <div
                    style="--color: red; display: flex; flex-direction: column; gap: var(--spacing-md); width: 100%;"
                >
                    <sl-skeleton style="width: 30%;"></sl-skeleton>
                    <sl-skeleton style="width: 100%;"></sl-skeleton>
                    <sl-skeleton style="width: 70%;"></sl-skeleton>
                    <sl-skeleton style="width: 50%;"></sl-skeleton>
                </div>
            </div>

            <sl-skeleton style="width: 50%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Song grids should have this on the containing element */
    :global(.song-grid) {
        row-gap: var(--spacing-xl);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    }

    :global(.song-scroll) {
        gap: var(--spacing-xxl);
    }

    :global(.song-scroll) .song-card {
        width: 230px;
    }

    .song-card {
        height: 100%; /* equal height with siblings */
    }

    .top {
        display: flex;
    }

    .image-container {
        font-size: 0;
        position: relative;
        height: 96px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        flex-grow: 0;
        overflow: hidden;
        align-self: start;
    }

    .image-container :global(.image) {
        object-fit: cover;
        color: transparent;
        width: 100%;
    }

    .info {
        margin-inline-start: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .album {
        margin-block-end: var(--spacing-sm);
    }

    .actions {
        margin-block-start: var(--spacing-md);
    }
</style>
