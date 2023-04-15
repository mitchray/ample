<script>
    import AlbumCard from '../../components/album/albumCard.svelte';
    import AlbumSongs from '../../components/album/albumSongs.svelte';
    import Visibility from '../../components/visibility.svelte';

    export let data;

    let album;
    $: album = data;
</script>

<div class="album-card-expanded card">
    <div class="info">
        <AlbumCard data="{album}"/>
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
        margin-top: calc(var(--spacing-xxxl) + var(--spacing-xxxl));
    }

    .album-card-expanded {
        container-name: album-card-expanded;
        container-type: inline-size
    }

    .info {
        margin-bottom: var(--spacing-xxl);
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