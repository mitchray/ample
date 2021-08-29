<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { formatSongLength } from '../logic/helper';
    import { removeFromPlaylist } from '../logic/playlist';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGYear from "../../public/images/year.svg";
    import SVGClose from "../../public/images/close.svg";

    export let songs;
    export let multiArtist = false;
    export let showIndex = false;
    export let showYear = true;
    export let playlist = null;

    function handleRemove(index) {
        if (songs.length > 0) {
            // remove from actual playlist
            let removal = removeFromPlaylist({playlistID: playlist.id, trackNo: index + 1})
                .then((result) => {
                    if (result.success) {
                        // remove from playlist view
                        songs.splice(index, 1);

                        songs = songs;
                    }
                });
        }
    }
</script>

<ul class="c-song-list" in:fade>
    {#each songs as song, i}
        <li>
            {#if playlist && playlist.id}
                <button class="icon remove" on:click|stopPropagation={() => { handleRemove(i) }}><SVGClose /></button>
            {/if}

            {#if showIndex}
                <span class="index">
                    {i + 1}
                </span>
            {/if}

            <span class="thumb">
                <img src="{song.art}&thumb=1" alt=""/>
            </span>

            <span class="details">
                <span class="title">{song.name}</span>
                {#if multiArtist}
                    <span class="artist"><Link to="artists/{song.artist.id}" class="artist"><SVGArtist class="inline"/> {song.artist.name}</Link></span>
                {/if}
                <div>
                    <Link to="albums/{song.album.id}" class="album"><SVGAlbum class="inline"/> {song.album.name}</Link>
                    {#if showYear && song.year.toString().length > 3}
                        <span class="date">
                            <Link to="albums/year/{song.year}"><SVGYear class="inline"/> {song.year}</Link>
                        </span>
                    {/if}
                </div>
            </span>

            <span class="right">
                <span class="actions">
                    <Actions
                        type="song"
                        mode="miniButtons"
                        id="{song.id}"
                        count="1"
                        artistID="{song.artist.id}"
                        albumID="{song.album.id}"
                    />
                </span>
                <span class="time">{formatSongLength(song.time)}</span>
                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />
            </span>
        </li>
    {/each}
</ul>


<style>
    .c-song-list {
        max-width: 800px;
        margin: 0;
    }

    .index {
        min-width: 3ch;
        text-align: right;
        margin-right: var(--spacing-lg);
    }

    .date {
        margin-left: var(--spacing-lg);
    }

    .title {
        color: var(--color-link-primary);
        font-weight: 700;
        margin-right: var(--spacing-lg);
    }

    .remove {
        margin-right: var(--spacing-sm);
    }

    .thumb {
        flex-shrink: 0;
        line-height: 0;
        margin-right: var(--spacing-lg);
    }

    .thumb img {
        height: 40px;
        width: 40px;
        border-radius: 2px;
    }

    li {
        display: flex;
        align-items: center;
        padding: var(--spacing-lg) var(--spacing-md);
    }

    li + li {
        border-top: 1px solid var(--color-lines);
    }

    li:hover {
        background-color: var(--color-tint-50);
    }

    li:hover .actions {
        opacity: 1;
    }

    .right {
        margin-left: auto;
        flex-shrink: 0;
        display: flex;
        align-items: center;
    }

    .time {
        margin-right: var(--spacing-lg);
    }

    .actions {
        display: flex;
        margin-left: var(--spacing-md);
        opacity: 0;
        margin-right: var(--spacing-lg);
    }

    ul {
        margin-top: 0;
    }
</style>