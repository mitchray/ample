<script>
    import { serverURL } from "../../stores/server";
    import { cleanArtURL } from "../../logic/helper";

    export let album;
</script>

{#if album.id}
    <a href="#/albums/{album.id}" title="{album.name}" class="album-card-mini card">
        <div class="image-container">
            <img class="image"
                 src="{cleanArtURL(album.art)}&thumb=11"
                 alt="Image of {album.name}"
                 width="40"
                 height="40"
                 data-id="art-album-{album.id}"
                 on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=11' }}
            />
        </div>

        <div class="info">
            <div class="top">
                {#if album.year}
                    <div class="date">{album.year}</div>
                {/if}

                {#if album.type}
                    <div class="release-type-label">{album.type}</div>
                {/if}
            </div>

            <div class="bottom">
                <div class="title">{album.name}</div>
            </div>
        </div>
    </a>
{/if}

<style>
    :global(.album-card-mini) {
        display: flex;
        width: 100%;
        max-width: 300px;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        border-radius: 3px;
        box-shadow: var(--shadow-sm);
        background-color: var(--color-card-primary);
    }

    @media (hover: hover) {
        :global(.album-card-mini:hover) {
            box-shadow: var(--shadow-md);
            background-color: var(--color-card-hover);
        }
    }

    .image-container {
        font-size: 0;
        border-radius: 2px;
        overflow: hidden;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        aspect-ratio: 1 / 1;
        height: 34px;
        flex-shrink: 0;
    }

    .image-container :global(img) {
        color: transparent;
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
        color: var(--color-text-secondary);
        align-items: center;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>