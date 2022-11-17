<script>
    import { Link } from 'svelte-routing';

    import { NowPlayingQueue, NowPlayingIndex, QueueIsOpen } from '../../stores/status';

    import SVGPlaylistPlay from "/src/images/playlist_play.svg";
    import SVGArtist from "/src/images/artist.svg";

    let nextSong;

    $: nextSong = $NowPlayingQueue[$NowPlayingIndex + 1];

    function toggleQueue() {
        let inverted = !$QueueIsOpen;
        localStorage.setItem('QueueIsOpen', JSON.stringify(inverted));
        QueueIsOpen.set(inverted);
    }
</script>


<div class="container" id="c-queue">
    <div class="queueInfo">
        <h4 class="queue-header panel-title">Queue</h4>
        {#if $NowPlayingQueue.length > 0}
            <span class="queue-details">{$NowPlayingQueue.length === 0 ? 0 : $NowPlayingIndex + 1} of {$NowPlayingQueue.length}</span>
        {/if}

        {#if nextSong}
            <div class="title card-title"><span>Next:</span> <Link to="song/{nextSong.id}">{nextSong.title}</Link></div>
            <div class="artist"><Link to="artists/{nextSong.artist.id}"><SVGArtist class="inline"/> {nextSong.artist.name}</Link></div>
        {:else}
            <div>No upcoming songs</div>
            <br>
        {/if}
    </div>

    <button
        id="queue-button"
        class="queue-toggle icon-button button--regular"
        on:click={toggleQueue}
        title="Toggle queue"
    >
        <SVGPlaylistPlay style="transform: scale(1.3)" />
    </button>
</div>


<style>
    :global(.current-icon) {
        margin-right: var(--spacing-sm);
        flex-shrink: 0;
    }

    .queue-header {
        display: inline-block;
        margin-bottom: var(--spacing-md);
        color: var(--color-highlight);
    }

    .queue-toggle {
        width: auto;
        padding: 0;
        flex-shrink: 0;
        margin-right: var(--spacing-sm);
    }

    .queue-toggle :global(svg) {
        margin-left: 6px;
    }

    .container {
        border-radius: 5px;
        display: flex;
        padding-bottom: var(--spacing-md);
        width: calc(100% - var(--spacing-lg));
    }

    .queueInfo {
        overflow: hidden;
        display: none;
    }

    .title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .artist {
        font-stretch: 50%;
    }

    @media all and (min-width: 680px) {
        .container {
            padding: var(--spacing-md);
        }
    }

    @media all and (min-width: 1000px) {
        .queueInfo {
            display: block;
        }

        .queue-toggle {
            height: unset;
        }

        .container {
            background-color: var(--color-card-primary);
            box-shadow: var(--shadow-sm);
            justify-content: space-between;
            margin: 10px;
        }
    }
</style>