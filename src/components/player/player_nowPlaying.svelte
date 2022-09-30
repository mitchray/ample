<script>
    import { Link } from 'svelte-routing';

    import { CurrentSong } from "../../stores/status";

    import SVGAlbum from "../../../public/images/album.svg";
    import SVGYear from "../../../public/images/year.svg";
</script>

<div class="container">
    {#if $CurrentSong}
        <img class="nowPlayingArtwork" src="{$CurrentSong.art}&thumb=22" alt="" />
        <div class="details">
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
</div>

<style>
    .container {
        display: flex;
        height: 100%;
        align-items: center;
        overflow: hidden;
        font-stretch: 50%;
        line-height: 1.5;
    }

    .details {
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

    .nowPlayingArtwork {
        height: 85%;
        aspect-ratio: 1 / 1;
        border-radius: 3px;
        margin-right: var(--spacing-md);
        display: none;
        outline: 1px solid hsla(0, 0%, 50%, 0.2);
        outline-offset: -1px;
    }

    @media all and (min-width: 800px) {
        .nowPlayingArtwork {
            display: block;
        }
    }
</style>