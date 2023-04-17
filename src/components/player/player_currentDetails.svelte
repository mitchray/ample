<script>
    import { Link } from 'svelte-routing';
    import { CurrentMedia, FullScreenEnabled } from "../../stores/status";

    import ArtistList from '../../components/artist/artistList.svelte';

    import SVGAlbum from "/src/images/album.svg";
    import SVGYear from "/src/images/year.svg";

    function handleClick(e) {
        // Close fullscreen if we are following a link
        if (e.target.href !== undefined) {
            $FullScreenEnabled = false;
        }
    }
</script>

{#if $CurrentMedia}
    <div class="details" on:click={handleClick}>
        <div class="title card-title" title="{$CurrentMedia.title}"><Link to="song/{$CurrentMedia.id}">{$CurrentMedia.title}</Link></div>

        {#if $CurrentMedia.artists.length > 0}
            <div class="artist">
                <ArtistList artists={$CurrentMedia.artists} />
            </div>
        {/if}

        <div class="album">
            {#if $CurrentMedia.year > 0}
                <span class="date"><Link to="albums/year/{$CurrentMedia.year}"><SVGYear class="inline"/> {$CurrentMedia.year}</Link></span>
            {/if}
            {#if $CurrentMedia.album}
                <Link to="albums/{$CurrentMedia.album.id}" title="{$CurrentMedia.album.name}"><SVGAlbum class="inline"/> {$CurrentMedia.album.name}</Link>
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

    .date {
        margin-right: var(--spacing-md);
    }

    .title {
        margin-bottom: var(--spacing-sm);
    }

    .title,
    .artist,
    .album {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>