<script>
    import { Link } from 'svelte-routing';
    import { CurrentMedia, FullScreenEnabled } from "../../stores/status";

    import ArtistList from '../../components/artist/artistList.svelte';

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
                <span class="date"><Link to="albums/year/{$CurrentMedia.year}">({$CurrentMedia.year})</Link></span>
            {/if}
            {#if $CurrentMedia.album}
                <span class="album"><Link to="albums/{$CurrentMedia.album.id}" title="{$CurrentMedia.album.name}">{$CurrentMedia.album.name}</Link></span>
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

    .date :global(a),
    .album :global(a) {
        color: var(--color-text-secondary);
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