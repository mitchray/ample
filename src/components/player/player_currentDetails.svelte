<script>
    import { CurrentMedia } from "~/stores/state.js";
    import ArtistList from "~/components/artist/artistList.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

{#if $CurrentMedia}
    <div class="details">
        <div class="title truncate" title={$CurrentMedia.title}>
            <a href="#/song/{$CurrentMedia.id}">{$CurrentMedia.title}</a>
        </div>

        {#if $CurrentMedia.artists.length > 0}
            <div class="artist secondary-info">
                <ArtistList data={$CurrentMedia} />
            </div>
        {/if}

        <div class="album truncate secondary-info">
            {#if $CurrentMedia.year > 0}
                <span class="date">
                    <a href="#/album/year/{$CurrentMedia.year}">
                        {$CurrentMedia.year}
                    </a>
                </span>
            {/if}
            {#if $CurrentMedia.album}
                <span class="album truncate">
                    <MaterialSymbol name="album" />
                    <a
                        href="#/album/{$CurrentMedia.album.id}"
                        title={$CurrentMedia.album.name}
                    >
                        {$CurrentMedia.album.name}
                    </a>
                </span>
            {/if}
        </div>
    </div>
{/if}

<style>
    .details {
        line-height: 1.5;
        overflow: hidden;
    }

    .title {
        margin-block-end: var(--spacing-sm);
    }
</style>
