<script>
    import AlbumCard from "~/components/cards/albumCard.svelte";
    import AlbumSongs from "~/components/album/albumSongs.svelte";
    import Visibility from "~/components/visibility.svelte";

    export let data;
    export let type = undefined; // ignored; workaround for card list component when type is 'generic'

    let album;
    $: album = data;
</script>

<div class="album-card-expanded card">
    <div class="info">
        <AlbumCard data={album} />
    </div>

    <Visibility steps={100} let:percent let:unobserve>
        {#if percent > 0}
            <div class="songs" use:unobserve>
                <AlbumSongs id={album.id} />
            </div>
        {/if}
    </Visibility>
</div>

<style>
    :global(.album-card-expanded + .album-card-expanded) {
        margin-block-start: calc(var(--spacing-xxxl) + var(--spacing-xxxl));
    }

    .album-card-expanded {
        container-name: album-card-expanded;
        container-type: inline-size;
    }

    .info {
        margin-block-end: var(--spacing-xxl);
    }

    @container album-card-expanded (min-width: 320px) {
        .album-card-expanded :global(.album-card) {
            display: flex;
            flex-direction: row;
            width: min-content;
            gap: var(--spacing-md);
        }

        .album-card-expanded :global(.album-card .image-container) {
            height: 150px;
            flex-shrink: 0;
        }
    }
</style>
