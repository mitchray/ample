<script>
    import { CurrentMedia, FullScreenEnabled } from "../../stores/status";
    import ArtistList from '../../components/artist/artistList.svelte';
    import SVGAlbum from '../../images/album.svg';

    function handleClick(e) {
        // Close fullscreen if we are following a link
        if (e.target.href !== undefined) {
            $FullScreenEnabled = false;
        }
    }
</script>

{#if $CurrentMedia}
    <div class="details" on:click={handleClick}>
        <div class="title card-title" title="{$CurrentMedia.title}"><a href="#/song/{$CurrentMedia.id}">{$CurrentMedia.title}</a></div>

        {#if $CurrentMedia.artists.length > 0}
            <div class="artist secondary-info">
                <ArtistList artists={$CurrentMedia.artists} />
            </div>
        {/if}

        <div class="album secondary-info">
            {#if $CurrentMedia.year > 0}
                <span class="date"><a href="#/albums/year/{$CurrentMedia.year}">{$CurrentMedia.year}</a></span>
            {/if}
            {#if $CurrentMedia.album}
                <span class="album"><SVGAlbum class="inline"/> <a href="#/albums/{$CurrentMedia.album.id}" title="{$CurrentMedia.album.name}">{$CurrentMedia.album.name}</a></span>
            {/if}
        </div>
    </div>
{/if}

<style>
    .details {
        font-stretch: 50%;
        line-height: 1.5;
        overflow: hidden;
    }

    .title {
        margin-block-end: var(--spacing-sm);
    }

    .title,
    .artist,
    .album {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>