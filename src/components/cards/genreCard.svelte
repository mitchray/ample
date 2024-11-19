<script>
    import { run } from "svelte/legacy";

    import { onMount } from "svelte";
    import Actions from "~/components/action/actions.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { data = null, type = undefined } = $props();

    let angle = $state(50);
    let genre = $state();
    run(() => {
        genre = data;
    });

    onMount(() => {
        // each char has a unique integer associated with it, use the sum of these as the degree angle
        for (let i = 0; i < genre?.name.length; i++) {
            angle += genre?.name.charCodeAt(i);
        }
    });
</script>

<div
    class="genre-card card"
    data-name="genre-{genre?.name?.replace(/\s+/g, '-').toLowerCase()}"
    style="--angle: {angle}deg"
>
    {#if genre}
        <div class="info">
            <div class="title genre-title truncate" title={genre.name}>
                <a href="#/genre/{genre.id}">{genre.name}</a>
            </div>

            <div class="meta">
                <a href="#/genre/{genre.id}">
                    <MaterialSymbol name="artist" />
                    {genre.artists}
                </a>
                <a href="#/genre/{genre.id}">
                    <MaterialSymbol name="album" />
                    {genre.albums}
                </a>
                <a href="#/genre/{genre.id}">
                    <MaterialSymbol name="music_note" />
                    {genre.songs}
                </a>
            </div>

            <div class="bottom">
                <div class="actions">
                    <Actions
                        item={genre}
                        type="artistGenre"
                        displayMode="miniButtons"
                        data={Object.create({ name: genre.name })}
                    />
                </div>
            </div>
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md); width: 100%; padding: var(--spacing-md);"
        >
            <sl-skeleton
                style="width: 80%; padding-block-end: var(--spacing-lg);"
            ></sl-skeleton>
            <sl-skeleton style="width: 60%;"></sl-skeleton>
            <sl-skeleton style="width: 40%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Genre grids should have this on the containing element */
    :global(.genre-grid) {
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    :global(.genre-scroll) .genre-card {
        width: 250px;
    }

    .genre-card {
        padding: var(--spacing-md);
        height: 100%; /* equal height with siblings */
        display: flex;
        position: relative;
        z-index: 1;
        overflow: hidden;
        background-color: var(--color-surface-container);
        border-radius: 5px;
    }

    .info {
        margin-inline-start: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .title.genre-title {
        --roboto-opsz: 50;
        line-height: 1.1;
        margin: var(--spacing-md) 0 var(--spacing-md);
        font-weight: 300;
        font-size: 20px;
    }

    .meta {
        display: flex;
        gap: var(--spacing-lg);
    }

    .bottom {
        display: flex;
        flex-direction: column;
    }

    .actions {
        margin-block-start: var(--spacing-md);
    }

    /*  COLORS  */
    :global(.genre-card[data-name]:after) {
        content: "";
        background-color: hsla(0, 0%, 50%, 0.3);
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-start: 0;
        inset-block-end: 0;
        z-index: -1;
        mask-image: linear-gradient(
            var(--angle),
            transparent 30%,
            hsla(0, 0%, 0%, 1) 30.5%,
            hsla(0, 0%, 0%, 0.7) 50%,
            hsla(0, 0%, 0%, 0.3) 80%,
            hsla(0, 0%, 0%, 0) 100%
        );
        opacity: 0.2;
    }

    :global(.sl-theme-light .genre-card[data-name]:after) {
        opacity: 0.15;
    }

    :global(.genre-card[data-name*="rock"]:after),
    :global(.genre-card[data-name*="grunge"]:after) {
        background-color: red;
    }

    :global(.genre-card[data-name*="easy"]:after),
    :global(.genre-card[data-name*="classical"]:after),
    :global(.genre-card[data-name*="piano"]:after) {
        background-color: darkorange;
    }

    :global(.genre-card[data-name*="electr"]:after),
    :global(.genre-card[data-name*="house"]:after),
    :global(.genre-card[data-name*="drum"]:after) {
        background-color: yellow;
    }

    :global(.genre-card[data-name*="rap"]:after),
    :global(.genre-card[data-name*="hip"]:after),
    :global(.genre-card[data-name*="reggae"]:after) {
        background-color: lime;
    }

    :global(.genre-card[data-name*="indie"]:after),
    :global(.genre-card[data-name*="indy"]:after),
    :global(.genre-card[data-name*="folk"]:after) {
        background-color: olivedrab;
    }

    :global(.genre-card[data-name*="blues"]:after),
    :global(.genre-card[data-name*="country"]:after),
    :global(.genre-card[data-name*="jazz"]:after),
    :global(.genre-card[data-name*="soul"]:after) {
        background-color: cyan;
    }

    :global(.genre-card[data-name*="metal"]:after),
    :global(.genre-card[data-name*="thrash"]:after) {
        background-color: steelblue;
    }

    :global(.genre-card[data-name*="posthardcore"]:after),
    :global(.genre-card[data-name*="post-hardcore"]:after),
    :global(.genre-card[data-name*="punk"]:after),
    :global(.genre-card[data-name*="emo"]:after) {
        background-color: magenta;
    }
</style>
