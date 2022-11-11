<script>
    import { Link } from 'svelte-routing';
    import { CurrentSong, FullScreenEnabled } from "../../stores/status";

    import SVGAlbum from "../../../public/images/album.svg";
    import SVGYear from "../../../public/images/year.svg";

    function handleClick(e) {
        // Close fullscreen if we are following a link
        if (e.target.href !== undefined) {
            $FullScreenEnabled = false;
        }
    }
</script>

{#if $CurrentSong}
    <div class="details" on:click={handleClick}>
        <div class="title card-title" title="{$CurrentSong.title}"><Link to="song/{$CurrentSong.id}">{$CurrentSong.title}</Link></div>
        <div class="artist" title="{$CurrentSong.artist.name}"><Link to="artists/{$CurrentSong.artist.id}">{$CurrentSong.artist.name}</Link></div>
        <div class="album">
            {#if $CurrentSong.year > 0}
                <span class="date"><Link to="albums/year/{$CurrentSong.year}"><SVGYear class="inline"/> {$CurrentSong.year}</Link></span>
            {/if}
            <Link to="albums/{$CurrentSong.album.id}" title="{$CurrentSong.album.name}"><SVGAlbum class="inline"/> {$CurrentSong.album.name}</Link>
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