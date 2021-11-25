<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { getSongsFromAlbum, groupSongsByDisc } from '../logic/song';
    import { formatSongLength } from '../logic/helper';

    import { CurrentSong } from '../stores/status';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGCurrent from "../../public/images/play_circle.svg";

    export let id;
    let groupedSongs;

    function _groupSongs(songs) {
        groupedSongs = groupSongsByDisc(songs);
        return '';
    }
</script>

{#await getSongsFromAlbum(id)}
    <p class="temp">Loading songs</p>
{:then songs}
    {#if songs.length > 0}
        {_groupSongs(songs)}
        {#if groupedSongs}
            {#each [...groupedSongs] as [key, value], i}
                <section in:fade>
                    {#if groupedSongs.size > 1}
                        <div class="disc-info">
                            <p>Disc {i+1}</p>
                            <span class="disc-actions">
                                <Actions
                                    type="album"
                                    mode="miniButtons"
                                    count="{value.length}"
                                    direct={value}
                                />
                            </span>
                        </div>
                    {/if}
                    <ul class="song-list {value.length > 5 ? 'split' : ''}">
                        {#each value as song}
                            <li class="song-row">
                                <span class="track">{song.track}</span>
                                {#if $CurrentSong && $CurrentSong.id === song.id}
                                    <span class="current-icon">
                                        <SVGCurrent class="icon" />
                                    </span>
                                {/if}
                                <span class="info">
                                    <span class="title">
                                        {song.name}
                                    </span>
                                    {#if song.albumartist.id !== song.artist.id}
                                        <span class="artist"><Link to="artists/{song.artist.id}"><SVGArtist class="inline"/> {song.artist.name}</Link></span>
                                    {/if}
                                </span>
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
                            </li>
                        {/each}
                    </ul>
                </section>
            {/each}
        {/if}
    {:else}
        <p>Unable to find songs</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    .temp {
        height: 500px;
    }

    ul {
        margin: 0;
    }

    li {
        display: flex;
        align-items: center;
        padding: var(--spacing-md) var(--spacing-md);
    }

    .title {
        display: flex;
        align-items: center;
    }

    li {
        border-top: 1px solid var(--color-lines);
    }

    li:hover {
        background-color: var(--color-tint-50);
    }

    :global(.theme-is-light) li:hover {
        background-color: var(--color-shade-50);
    }

    li:hover .actions {
        opacity: 1;
    }

    .track {
        text-align: right;
        min-width: 3ch;
        margin-right: var(--spacing-lg);
    }

    .time {
        margin-right: var(--spacing-lg);
        padding-left: var(--spacing-lg);
    }

    /* fix columns not aligning to top */
    .song-row {
        display: inline-flex;
        width: 100%;
    }

    /* TODO: temporary workaround until grid refactor */
    .song-row :global(.c-rating) {
        min-width: 160px;
    }

    .actions {
        display: flex;
        margin-left: auto;
        opacity: 0;
        flex-shrink: 0;
    }

    .artist {
        font-weight: 700;
        display: block;
    }

    .disc-info {
        display: flex;
        align-items: center;
    }

    .disc-actions {
        margin-left: var(--spacing-lg);
    }
</style>