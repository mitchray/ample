<script>
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { waitForElement } from "../logic/helper";
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';
    import {
        NowPlayingQueue,
        NowPlayingIndex,
        CurrentMedia,
        QueueIsOpen,
        QueueIsPinned
    } from '../stores/status';
    import { MediaPlayer, SiteQueueBind } from '../stores/player';
    import { serverURL } from "../stores/server";

    import Menu from '../components/menu.svelte';
    import Actions2 from '../components/action/actions.svelte';

    import SVGClose from '/src/images/close.svg';
    import SVGBin from '/src/images/delete.svg';
    import SVGCurrent from '/src/images/play_circle.svg';
    import SVGMore from '/src/images/more-hori.svg';
    import SVGLock from "/src/images/lock.svg";
    import SVGUnlock from "/src/images/lock_open.svg";

    const flipDurationMs = 100;

    let nextMedia;
    let staleTime = Date.now();
    let staleThreshold = 1000 * 60 * 60 * 6; // 6 hours

    let queueMoreMenuID;
    let queueMoreMenuIsOpen = false;
    let dragDisabled = true;

    $: queueMoreMenuID;
    $: nextMedia = $NowPlayingQueue[$NowPlayingIndex + 1];
    $: staleTime = staleTime;

    // TODO when queue is opened show the current media

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);

        // clickOutsideHandler doesn't respond so manually turn off menus
        queueMoreMenuIsOpen = false;
    }

    function showCurrentMedia({behavior = 'smooth'}) {
        waitForElement('.site-queue .currentlyPlaying').then((selector) => {
            selector.scrollIntoView({
                behavior: behavior,
            });
        });
    }

    function handleRemove(index) {
        $NowPlayingQueue.splice(index, 1);

        // If playing media is removed, load new media
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

    function handleMoreMenu(index) {
        queueMoreMenuID = index;
        queueMoreMenuIsOpen = !queueMoreMenuIsOpen;
    }

    function handleClearPlayed() {
        let foundIndex = 0;

        // find next item to remove, that isn't the currently playing media
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

        let currentIndex = $NowPlayingQueue.findIndex(item => item._id === $CurrentMedia._id);

        if (currentIndex !== -1) {
            NowPlayingIndex.set(currentIndex);
        }

        dragDisabled = true;
    }

    function startDrag(e) {
        // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
        e.preventDefault();
        dragDisabled = false;
    }

    function transformDraggedElement(draggedEl, data, index) {
        draggedEl.classList.add('queue-dragging');
    }

    function togglePinned() {
        let inverted = !$QueueIsPinned;
        localStorage.setItem('QueueIsPinned', JSON.stringify(inverted));
        QueueIsPinned.set(inverted);
    }

    function handleClickOutside() {
        if (!$QueueIsPinned) {
            let status = false;
            localStorage.setItem('QueueIsOpen', JSON.stringify(status));
            QueueIsOpen.set(status);
        }
    }

    onMount(() => {
        // check for stale media and remove from queue
        const staleTimer = setInterval(() => {
            staleTime = Date.now();

            // remove any stale media
            let indexes = $NowPlayingQueue.reduce( (a,curr,index) => {
                if (curr.lastPlayed + staleThreshold < staleTime) {
                    a.push(index);
                }

                return a;
            }, []);

            indexes.forEach(function(index) {
                // don't remove an old media being replayed, and preserve the previous 10 media before current media
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
    class:is-open={$QueueIsOpen}
    class:is-pinned={$QueueIsPinned}
    bind:this={$SiteQueueBind}
    use:clickOutsideDetector={{
        toggle: "#queue-button",
        ignore: '.site-queue'
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="site-queue-inner">
        <div class="header panel-header">
            <h4 class="panel-title">Now Playing</h4>
            <button class="clear-all icon-button button--danger" on:click={handleClearQueue} title="Clear all"><SVGBin /></button>
        </div>

        <div class="panel-actions">
            <button class="panel-action" on:click={togglePinned}>
                {#if $QueueIsPinned}
                    <SVGLock style="transform: scale(0.8)" />
                {:else}
                    <SVGUnlock style="transform: scale(0.8)" />
                {/if}
            </button>

            <button class="panel-action" on:click={showCurrentMedia} title="Show current item">
                Current
            </button>

            <button class="panel-action" on:click={handleClearPlayed} title="Clear played items">
                Clear played
            </button>
        </div>

        <div
            class="queue-list"
            use:dndzone={{
                items: $NowPlayingQueue,
                dropTargetStyle: {},
                flipDurationMs: flipDurationMs,
                transformDraggedElement,
                dragDisabled
            }}
            on:consider={handleSort}
            on:finalize={handleSort}
        >
            {#if $NowPlayingQueue && $NowPlayingQueue.length > 0}
                {#each $NowPlayingQueue as media, i (media._id)}
                    <div
                        on:click={(e) => { handleAction(e, i) }}
                        class="queue-item"
                        class:currentlyPlaying={$NowPlayingIndex === i}
                        animate:flip={{duration:flipDurationMs}}
                    >
                        <button class="icon-button remove" on:click|stopPropagation={handleRemove(i)}><SVGClose /></button>

                        <span
                            class="thumb"
                            on:mousedown={startDrag}
                            on:touchstart={startDrag}
                        >
                            <img src="{media.art}&thumb=1"
                                alt=""
                                loading="lazy"
                                on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=22' }}
                            />
                        </span>

                        {#if $NowPlayingIndex === i}
                            <span class="current-icon"><SVGCurrent class="icon" /></span>
                        {/if}

                        <span class="details">
                            <div class="queue-title card-title" title="{media.name}">{media.name}</div>

                            {#if media.artist}
                                <div class="queue-artist" title="{media.artist.name}">{media.artist.name}</div>
                            {/if}
                        </span>

                        <button id="queueMoreToggle-{i}" class="icon-button more" on:click|stopPropagation={handleMoreMenu(i)}><SVGMore /></button>

                        {#if queueMoreMenuIsOpen && queueMoreMenuID === i}
                            <Menu anchor="left-center" toggleSelector={'#queueMoreToggle-' + queueMoreMenuID} bind:isVisible={queueMoreMenuIsOpen}>
                                <div class="panel-content">
                                    {#if media.artist}
                                        <Actions2
                                            type="song"
                                            mode="subMenu"
                                            id="{media.id}"
                                            data={Object.create({albumID: media.album.id, artistID: media.artist.id})}
                                        />
                                    {/if}
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
        background-color: var(--color-interface);
        border-left: 1px solid var(--color-border);
        position: absolute;
        width: var(--size-queue-width);
        z-index: 10;
        display: flex;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        will-change: transform;
    }

    .site-queue:not(.is-pinned) {
        top: var(--size-header-height);
        bottom: var(--size-webplayer-height);
    }

    .site-queue.is-open {
        transform: none;
    }

    .site-queue.is-pinned {
        position: relative;
        transition-duration: 0s;
    }

    .site-queue.is-pinned:not(.is-open) {
        display: none;
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
        cursor: grab;
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
        font-stretch: 50%;
    }

    @media (hover: hover) {
        .queue-item:hover {
            background-color: var(--color-background);
        }
    }

    :global(.queue-dragging) {
        background-color: var(--color-row-hover) !important;
        box-shadow: var(--shadow-lg);
    }

    :global(.queue-dragging) .thumb {
        cursor: grabbing;
    }

    .queue-item + .queue-item {
        margin-top: 2px;
    }

    .currentlyPlaying {
        box-shadow: inset 0 0 0 1px var(--color-highlight);
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

    .more {
        margin-left: auto;
    }
</style>