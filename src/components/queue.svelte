<script>
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';

    import { NowPlayingQueue, NowPlayingIndex, CurrentSong, ShowQueue } from '../stores/status';
    import { MediaPlayer } from '../stores/player';

    import Menu from '../components/menu.svelte';
    import Actions from '../components/actions.svelte';

    import SVGClose from '../../public/images/close.svg';
    import SVGBin from '../../public/images/delete.svg';
    import SVGCurrent from '../../public/images/play_circle.svg';
    import SVGMore from '../../public/images/more-hori.svg';

    const flipDurationMs = 100;

    let nextSong;
    let staleTime = Date.now();
    let staleThreshold = 1000 * 60 * 60 * 6; // 6 hours

    let queueMoreMenuID;
    let queueMoreMenuIsOpen = false;

    $: queueMoreMenuID;
    $: nextSong = $NowPlayingQueue[$NowPlayingIndex + 1];
    $: staleTime = staleTime;

    // TODO when queue is opened show the current song

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);

        // clickOutsideHandler doesn't respond so manually turn off menus
        queueMoreMenuIsOpen = false;
    }

    const checkElement = async selector => {
        while ( document.querySelector(selector) === null) {
            await new Promise( resolve =>  requestAnimationFrame(resolve) )
        }
        return document.querySelector(selector);
    };

    function showCurrentSong({behavior = 'smooth'}) {
        checkElement('.site-queue .currentlyPlaying').then((selector) => {
            selector.scrollIntoView({
                behavior: behavior,
            });
        });
    }

    function handleRemove(index) {
        $NowPlayingQueue.splice(index, 1);

        // If playing song is removed, load new track
        if ($NowPlayingIndex === index) {
            $MediaPlayer.stop();
            $MediaPlayer.start();
        }

        // account for removal of previous items affected NowPlayingIndex
        if ($NowPlayingIndex > index) {
            NowPlayingIndex.set($NowPlayingIndex - 1);
        }

        $NowPlayingQueue = $NowPlayingQueue;
    }

    function handleSongMenu(index) {
        queueMoreMenuID = index;
        queueMoreMenuIsOpen = !queueMoreMenuIsOpen;
    }

    function handleClearPlayed() {
        let foundIndex = 0;

        // find next item to remove, that isn't the currently playing song
        while (foundIndex !== -1) {
            foundIndex = $NowPlayingQueue.findIndex((item, index) => index !== $NowPlayingIndex && item.lastPlayed);

            if (foundIndex !== -1) {
                handleRemove(foundIndex);
            }
        }
    }

    function handleClearQueue() {
        $MediaPlayer.clearQueue();
    }

    function handleSort(e) {
        NowPlayingQueue.set([...e.detail.items]);

        let currentIndex = $NowPlayingQueue.findIndex(item => item._id === $CurrentSong._id);

        if (currentIndex !== -1) {
            NowPlayingIndex.set(currentIndex);
        }
    }

    function transformDraggedElement(draggedEl, data, index) {
        draggedEl.classList.add('queue-dragging');
    }

    onMount(() => {
        // check for stale songs and remove from queue
        const staleTimer = setInterval(() => {
            staleTime = Date.now();

            // remove any stale songs
            let indexes = $NowPlayingQueue.reduce( (a,curr,index) => {
                if (curr.lastPlayed + staleThreshold < staleTime) {
                    a.push(index);
                }

                return a;
            }, []);

            indexes.forEach(function(index) {
                // don't remove an old song being replayed, and preserve the previous 10 songs before current song
                if (index !== $NowPlayingIndex && index < $NowPlayingIndex - 10) {
                    handleRemove(index);
                }
            });
        }, 1000 * 60 * 10); // 10 minutes

        return () => {
            clearInterval(staleTimer);
        };
    });
</script>

<div
    class="site-queue"
    class:visible={$ShowQueue}
>
    <div class="site-queue-inner">
        <div class="header panel-header">
            <h4 on:click={showCurrentSong}>Now Playing</h4>
            <button class="clear-played icon-button" title="Clear played songs" on:click={handleClearPlayed}><SVGClose /></button>
            <button class="clear-all icon-button button--danger" on:click={handleClearQueue} title="Clear all"><SVGBin /></button>
        </div>

        <div
            class="queue-list"
            use:dndzone={{
                items: $NowPlayingQueue,
                dropTargetStyle: {},
                flipDurationMs: flipDurationMs,
                transformDraggedElement
            }}
            on:consider={handleSort}
            on:finalize={handleSort}
        >
            {#if $NowPlayingQueue && $NowPlayingQueue.length > 0}
                {#each $NowPlayingQueue as song, i (song._id)}
                    <div
                        on:click={(e) => { handleAction(e, i) }}
                        class="queue-item"
                        class:currentlyPlaying={$NowPlayingIndex === i}
                        animate:flip={{duration:flipDurationMs}}
                    >
                        <button class="icon-button remove" on:click|stopPropagation={handleRemove(i)}><SVGClose /></button>

                        <span class="thumb">
                            <img src="{song.art}&thumb=1" alt="" loading="lazy"/>
                        </span>

                        {#if $NowPlayingIndex === i}
                            <span class="current-icon"><SVGCurrent class="icon" /></span>
                        {/if}

                        <span class="details">
                            <div class="queue-title" title="{song.name}">{song.name}</div>
                            <div class="queue-artist" title="{song.artist.name}">{song.artist.name}</div>
                        </span>

                        <button id="queueMoreToggle-{i}" class="icon-button more" on:click|stopPropagation={handleSongMenu(i)}><SVGMore /></button>

                        {#if queueMoreMenuIsOpen && queueMoreMenuID === i}
                            <Menu anchor="left-center" toggleElement={document.querySelector('#queueMoreToggle-' + queueMoreMenuID)} bind:isVisible={queueMoreMenuIsOpen}>
                                <div class="panel-content">
                                    <Actions
                                        type="song"
                                        mode="subMenu"
                                        id="{song.id}"
                                        count=1
                                        albumID="{song.album.id}"
                                        artistID="{song.artist.id}"
                                    />
                                </div>
                            </Menu>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

<style>
    .site-queue {
        border-left: 1px solid var(--color-border);
        position: relative;
        width: var(--size-queue-width);
        height: 100%;
        z-index: 10;
        display: none;
    }

    .visible {
        display: block;
    }

    .site-queue-inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: inherit;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        padding-left: var(--spacing-lg);
    }

    .header h4 {
        margin: 0;
        margin-right: var(--spacing-md);
        cursor: pointer;
    }

    button {
        width: unset;
        height: unset;
    }

    .queue-list {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: var(--spacing-md);
        padding-bottom: calc(var(--spacing-md) + var(--size-seekbar-height)); /* account for absolute pos seekbar */
    }

    .queue-list:after {
        content: '';
        padding: 1px;
        padding-top: 0;
        display: block;
    }

    .queue-title {
        font-weight: 700;
    }

    .queue-title,
    .queue-artist {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thumb {
        flex-shrink: 0;
        margin-right: var(--spacing-md);
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        line-height: 0;
    }

    .thumb img {
        height: 45px;
        width: 45px;
        border-radius: 2px;
    }

    .queue-item {
        display: flex;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-left: 0;
        line-height: 1;
        align-items: center;
        user-select: none;
        cursor: pointer !important;
        border-radius: 4px;
        position: relative;
    }

    .queue-item:hover {
        background-color: var(--color-row-hover);
    }

    :global(.queue-dragging) {
        background-color: var(--color-row-hover) !important;
        box-shadow: var(--shadow-lg);
    }

    .queue-item + .queue-item {
        margin-top: 2px;
    }

    .currentlyPlaying {
        background-color: var(--color-card-highlight);
    }

    .details {
        display: flex;
        flex-direction: column;
        line-height: initial;
        justify-content: center;
        overflow: hidden;
    }

    .remove {
        margin-left: var(--spacing-md);
        margin-right: var(--spacing-md);
    }

    .clear-played {
        margin-right: auto;
    }

    .more {
        margin-left: auto;
    }
</style>