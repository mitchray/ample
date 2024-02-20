<script>
    import Art from "~/components/art.svelte";
    import ReleaseType from "~/components/releaseType.svelte";

    export let data = null;
    export let type = undefined; // ignored; workaround for card list component when type is 'generic'

    let album;
    $: album = data;
</script>

{#if album}
    <a
        href="#/album/{album.id}"
        title={album.name}
        class="album-card-mini card"
    >
        <div class="image-container">
            <Art size="small" data={album} type="album" radius="2px" />
        </div>

        <div class="info">
            <div class="top">
                {#if album.year}
                    <div class="date">{album.year}</div>
                {/if}

                {#if album.type}
                    <ReleaseType type={album.type} />
                {/if}
            </div>

            <div class="bottom">
                <div class="title truncate">{album.name}</div>
            </div>
        </div>
    </a>
{:else}
    <div
        style="display: flex; gap: var(--spacing-md); outline: 1px solid red; padding: var(--spacing-md);"
    >
        <sl-skeleton
            style="--border-radius: 5px; aspect-ratio: 1/1; height: 34px;"
        ></sl-skeleton>

        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-md); width: 80%;"
        >
            <sl-skeleton style="width: 40%;"></sl-skeleton>
            <sl-skeleton style="width: 80%;"></sl-skeleton>
        </div>
    </div>
{/if}

<style>
    :global(.album-card-mini) {
        display: flex;
        width: 100%;
        max-width: 300px;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: 3px;
        background-color: var(--color-surface-container);
    }

    .image-container {
        font-size: 0;
        overflow: hidden;
        aspect-ratio: 1 / 1;
        height: 34px;
        flex-shrink: 0;
    }

    .image-container :global(img) {
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .info {
        display: flex;
        flex-direction: column;
        width: 100%;
        overflow: hidden;
    }

    .top {
        display: flex;
        width: 100%;
        gap: var(--spacing-sm);
        color: var(--color-on-surface-variant);
        align-items: center;
    }
</style>
