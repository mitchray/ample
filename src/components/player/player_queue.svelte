<script>
    import { _ } from 'svelte-i18n';
    import { NowPlayingQueue, NowPlayingIndex, QueueIsOpen } from '../../stores/status';
    import ArtistList from '../../components/artist/artistList.svelte';
    import SVGPlaylistPlay from "/src/images/playlist_play.svg";

    let nextSong;

    $: nextSong = $NowPlayingQueue[$NowPlayingIndex + 1];

    function toggleQueue() {
        let inverted = !$QueueIsOpen;
        localStorage.setItem('AmpleQueueIsOpen', JSON.stringify(inverted));
        QueueIsOpen.set(inverted);
    }
</script>


<div class="container" id="c-queue">
    <div class="queueInfo">
        <h4 class="queue-header panel-title">{$_('text.queue')}</h4>
        {#if $NowPlayingQueue.length > 0}
            <span class="queue-details">{$NowPlayingQueue.length === 0 ? 0 : $NowPlayingIndex + 1} / {$NowPlayingQueue.length}</span>
        {/if}

        {#if nextSong}
            <div class="title card-title">
                <span>{$_('text.next')}:</span>
                <a href="#/song/{nextSong.id}">{nextSong.title}</a>
            </div>

            {#if nextSong.artists.length > 0}
                <div class="artist secondary-info">
                    <ArtistList artists={nextSong.artists} />
                </div>
            {/if}
        {:else}
            <div>{$_('text.queueNoUpcomingSongs')}</div>
            <br>
        {/if}
    </div>

    <button
        id="queue-button"
        class="queue-toggle icon-button button--regular"
        on:click={toggleQueue}
        title="{$_('text.queueToggle')}"
    >
        <SVGPlaylistPlay style="transform: scale(1.3)" />
    </button>
</div>


<style>
    :global(.current-icon) {
        margin-inline-end: var(--spacing-sm);
        flex-shrink: 0;
        color: var(--color-highlight);
    }

    .queue-header {
        display: inline-block;
        margin-block-end: var(--spacing-md);
        color: var(--color-highlight);
    }

    .queue-toggle :global(svg) {
        inset-inline-start: 2px;
        position: relative;
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

    .container {
        display: flex;
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
            width: calc(100% - var(--spacing-lg));
            border-radius: 5px;
        }
    }
</style>