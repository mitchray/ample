<script>
    import { Link } from 'svelte-routing';

    import { NowPlayingQueue, NowPlayingIndex, ShowQueue } from '../../stores/status';

    import SVGPlaylistPlay from "../../../public/images/playlist_play.svg";
    import SVGArtist from "../../../public/images/artist.svg";

    let nextSong;

    $: nextSong = $NowPlayingQueue[$NowPlayingIndex + 1];

    function toggleQueue() {
        let inverted = !$ShowQueue;
        localStorage.setItem('ShowQueue', JSON.stringify(inverted));
        ShowQueue.set(inverted);
    }
</script>


<div class="container well" id="c-queue">
    <div class="queueInfo">
        <h4 class="queue-header">Queue</h4>
        {#if $NowPlayingQueue.length > 0}
            <span class="queue-details">{$NowPlayingQueue.length === 0 ? 0 : $NowPlayingIndex + 1} of {$NowPlayingQueue.length}</span>
        {/if}
        {#if $NowPlayingQueue.length < 2}
            <span style="display: block">No upcoming songs</span>
            <br>
        {/if}

        {#if nextSong}
            <div class="title"><span>Next:</span> {nextSong.title}</div>
            <div class="artist"><Link to="artists/{nextSong.artist.id}"><SVGArtist class="inline"/> {nextSong.artist.name}</Link></div>
        {/if}
    </div>

    <button
        class="with-icon queue-toggle"
        on:click={toggleQueue}
        title="Toggle queue"
    >
        <SVGPlaylistPlay style="transform: scale(1.3)" />
    </button>
</div>


<style>
    :global(.current-icon) {
        margin-right: var(--spacing-sm);
        color: var(--color-link-active);
        flex-shrink: 0;
    }

    .queue-header {
        display: inline-block;
        margin-bottom: var(--spacing-md);
        color: var(--color-highlight);
    }

    .queue-toggle {
        height: unset; /* fill height */
        width: auto;
        padding: 0;
        flex-shrink: 0;
    }

    .queue-toggle :global(svg) {
        margin-left: 7px;
    }

    .container {
        display: flex;
        justify-content: space-between;
        padding-right: var(--spacing-sm);
        margin-right: var(--spacing-lg);
    }

    .queueInfo {
        overflow: hidden;
    }

    .title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
</style>