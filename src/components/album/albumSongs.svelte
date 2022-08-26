<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { getSongsFromAlbum } from '../../logic/song';
    import { formatSongLength } from '../../logic/helper';

    import { CurrentSong } from '../../stores/status';

    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/actions.svelte';

    import SVGCurrent from "../../../public/images/play_circle.svg";

    export let id;
</script>

{#await getSongsFromAlbum({id: id, groupByDisc: true})}
    <p class="temp">Loading songs</p>
{:then discs}
    {#if discs.size > 0}
        {#each [...discs] as [key, value], i}
            <section in:fade>
                {#if discs.size > 1}
                    <div class="disc-info">
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
                                <span class="name">
                                    {song.name}
                                </span>
                                {#if song.albumartist.id !== song.artist.id}
                                    <span class="artist"><Link to="artists/{song.artist.id}">{song.artist.name}</Link></span>
                                {/if}
                                </span>
                            <span class="time">{formatSongLength(song.time)}</span>
                            <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />
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
                        </li>
                    {/each}
                </ul>
            </section>
        {/each}
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

    .name {
        display: flex;
        align-items: center;
    }

    .song-row + .song-row {
        border-top: 2px solid var(--color-separator);
    }

    li:hover {
        background-color: var(--color-row-hover);
        box-shadow: var(--shadow-md);
        border-radius: 6px;
    }

    .track {
        text-align: right;
        min-width: 3ch;
        margin-right: var(--spacing-lg);
    }

    .time {
        margin-left: auto;
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
        flex-shrink: 0;
    }

    .artist {
        display: block;
        font-weight: 700;
    }

    .disc-info {
        display: flex;
        align-items: center;
    }

    .disc-actions {
        margin-left: var(--spacing-lg);
    }

    section {
        margin-top: var(--spacing-lg);
    }
</style>