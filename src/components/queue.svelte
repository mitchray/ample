<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { dndzone } from 'svelte-dnd-action';
    import { cleanArtURL, waitForElement } from "../logic/helper";
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';
    import {
        NowPlayingQueue,
        NowPlayingIndex,
        QueueIsUpdating,
        CurrentMedia,
        QueueIsOpen,
        QueueIsPinned,
        IsMobile
    } from '../stores/status';
    import { MediaPlayer, SiteQueueBind } from '../stores/player';
    import { serverURL } from "../stores/server";

    import Menu from '../components/menu.svelte';
    import Actions from '../components/action/actions.svelte';
    import ArtistList from '../components/artist/artistList.svelte';

    import SVGClose from '/src/images/close.svg';
    import SVGCurrent from '/src/images/play_circle.svg';
    import SVGMore from '/src/images/more-hori.svg';
    import SVGBin from "/src/images/delete.svg";

    const flipDurationMs = 100;

    let nextMedia;
    let staleTime = Date.now();
    let staleThreshold = 1000 * 60 * 60 * 6; // 6 hours

    let itemMoreMenuID;
    let itemMoreMenuIsOpen = false;
    let dragDisabled = true;
    let queueMoreMenuIsOpen = false;

    $: itemMoreMenuID;
    $: nextMedia = $NowPlayingQueue[$NowPlayingIndex + 1];
    $: staleTime = staleTime;

    // TODO when queue is opened show the current media

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);

        // clickOutsideHandler doesn't respond so manually turn off menus
        itemMoreMenuIsOpen = false;
    }

    function showCurrentMedia({behavior = 'smooth'}) {
        waitForElement('.site-queue .currentlyPlaying').then((selector) => {
            selector.scrollIntoView({
                behavior: behavior,
            });
        });
    }

    function handleRemoveItem(index) {
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

    function handleQueueMoreMenu() {
        queueMoreMenuIsOpen = !queueMoreMenuIsOpen;
    }

    function handleItemMoreMenu(index) {
        itemMoreMenuID = index;
        itemMoreMenuIsOpen = !itemMoreMenuIsOpen;
    }

    function handleClearPlayed() {
        let foundIndex = 0;

        // find next item to remove, that isn't the currently playing media
        while (foundIndex !== -1) {
            foundIndex = $NowPlayingQueue.findIndex((item, index) => index !== $NowPlayingIndex && item.lastPlayed);

            if (foundIndex !== -1) {
                handleRemoveItem(foundIndex);
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
        localStorage.setItem('AmpleQueueIsPinned', JSON.stringify(inverted));
        QueueIsPinned.set(inverted);
    }

    function handleClickOutside() {
        if ($SiteQueueBind.classList.contains("is-drawer")) {
            let status = false;
            localStorage.setItem('AmpleQueueIsOpen', JSON.stringify(status));
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
                    handleRemoveItem(index);
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
    class:is-drawer={$IsMobile || !$QueueIsPinned}
    bind:this={$SiteQueueBind}
    use:clickOutsideDetector={{
        toggle: "#queue-button",
        ignore: '.c-menu'
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="site-queue-inner">
        <div class="header panel-header">
            <h4 class="panel-title">{$_('text.queue')}</h4>
            <button id="queueMoreToggle" class="icon-button" on:click|stopPropagation={handleQueueMoreMenu}><SVGMore /></button>
            <button class="clear-all icon-button button--danger button--mini" on:click={handleClearQueue} title="{$_('text.clearAll')}"><SVGBin style="transform: scale(0.75)" /></button>
        </div>

        {#if queueMoreMenuIsOpen}
            <Menu anchor="left" toggleSelector={'#queueMoreToggle'} bind:isVisible={queueMoreMenuIsOpen}>
                <div class="panel-content">
                    <ul class="menu-list">
                        {#if !$IsMobile}
                            <li>
                                <button on:click|stopPropagation={togglePinned}>
                                    {#if $QueueIsPinned}
                                        {$_('text.queueUnpin')}
                                    {:else}
                                        {$_('text.queuePin')}
                                    {/if}
                                </button>
                            </li>
                        {/if}
                        <li>
                            <button on:click|stopPropagation={showCurrentMedia} title="{$_('text.queueShowCurrent')}">
                                {$_('text.queueShowCurrent')}
                            </button>
                        </li>
                        <li>
                            <button on:click|stopPropagation={handleClearPlayed} title="{$_('text.queueClearPlayed')}">
                                {$_('text.queueClearPlayed')}
                            </button>
                        </li>
                    </ul>
                </div>
            </Menu>
        {/if}

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
            style="display: {$QueueIsUpdating ? 'none' : 'initial'}"
        >
            {#if $NowPlayingQueue && $NowPlayingQueue.length > 0}
                {#each $NowPlayingQueue as media, i (media._id)}
                    <div
                        on:click={(e) => { handleAction(e, i) }}
                        class="queue-item"
                        class:currentlyPlaying={$NowPlayingIndex === i}
                        animate:flip={{duration:flipDurationMs}}
                    >
                        <button class="icon-button remove" on:click|stopPropagation={handleRemoveItem(i)}><SVGClose /></button>

                        <span
                            class="thumb"
                            on:mousedown={startDrag}
                            on:touchstart={startDrag}
                        >
                            <img src="{cleanArtURL(media.art)}&thumb=1"
                                alt=""
                                loading="lazy"
                                data-id="art-album-{media.album?.id}"
                                on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=22' }}
                            />
                        </span>

                        {#if $NowPlayingIndex === i}
                            <span class="current-icon"><SVGCurrent class="icon" /></span>
                        {/if}

                        <span class="details">
                            <div class="queue-title card-title" title="{media.name}">{media.name}</div>

                            {#if media.artists?.length > 0}
                                <ArtistList artists={media.artists} disabled={true} />
                            {/if}
                        </span>

                        <button id="itemMoreToggle-{i}" class="icon-button more" on:click|stopPropagation={handleItemMoreMenu(i)}><SVGMore /></button>

                        {#if itemMoreMenuIsOpen && itemMoreMenuID === i}
                            <Menu anchor="left" toggleSelector={'#itemMoreToggle-' + itemMoreMenuID} bind:isVisible={itemMoreMenuIsOpen}>
                                <div class="panel-content">
                                    <Actions
                                        type="song"
                                        mode="subMenu"
                                        id="{media.id}"
                                        data={Object.create({
                                            album: media.album,
                                            artists: media.artists,
                                            albumArtist: media.albumartist
                                        })}
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
    /*
    Base
    */
    .site-queue {
        background-color: var(--color-background);
        width: var(--size-queue-width);
        max-width: 100%;
        z-index: 30;
        display: flex;
        position: relative;
        inset-inline-end: 0;
        transform: translateX(100%);
        will-change: transform;
        padding-inline-start: var(--spacing-lg);
        padding-inline-end: var(--spacing-lg);
    }

    .site-queue-inner {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: inherit;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .site-queue.is-open {
        transform: translateX(0%);
    }

    /*
    Drawer mode
    */

    .site-queue.is-drawer {
        position: absolute;
        inset-block-start: var(--size-header-height);
        inset-block-end:  var(--size-webplayer-height);
        box-shadow: var(--shadow-xxl);
        transition: transform 0.3s ease-out;
    }

    .site-queue.is-drawer.is-open {
        transform: translateX(0%);
    }

    /*
    Pinned mode
    */

    .site-queue:not(.is-open):not(.is-drawer) {
        display: none;
    }

    /*
    Items
    */

    .header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        padding: 0;
        gap: var(--spacing-md);
        border: 0;
        height: 48px;
    }

    .clear-all {
        margin-inline-start: auto;
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
        background-color: var(--color-interface);
        box-shadow: var(--shadow-lg);
        border-radius: 10px;
        margin-block-end: var(--spacing-lg);
    }

    .queue-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thumb {
        flex-shrink: 0;
        margin-inline-end: var(--spacing-md);
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        line-height: 0;
        cursor: grab;
    }

    .thumb img {
        height: 36px;
        width: 36px;
        border-radius: 2px;
    }

    .queue-item {
        display: flex;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-inline-start: 0;
        line-height: 1;
        align-items: center;
        user-select: none;
        cursor: pointer !important;
        position: relative;
        font-stretch: 50%;
        z-index: 1;
    }

    @media (hover: hover) {
        .queue-item:hover {
            background-color: var(--color-background);
        }
    }

    .queue-item button {
        padding: 0;
    }

    .queue-item :global(.artists a) {
        color: var(--color-text-secondary);
    }

    :global(.queue-dragging) {
        background-color: var(--color-row-hover) !important;
        box-shadow: var(--shadow-lg);
    }

    :global(.queue-dragging) .thumb {
        cursor: grabbing;
    }

    .queue-item + .queue-item {
        margin-block-start: 2px;
    }

    .currentlyPlaying {
        color: var(--color-highlight);
    }

    .currentlyPlaying:before {
        content: '';
        position: absolute;
        inset-inline-start: 0;
        inset-block-start: 0;
        inset-block-end: 0;
        inset-inline-end: 0;
        background-color: var(--color-highlight);
        z-index: -1;
        opacity: 0.12;
    }

    .details {
        display: flex;
        flex-direction: column;
        line-height: initial;
        justify-content: center;
        overflow: hidden;
    }

    .queue-item .remove:not(:hover),
    .queue-item .more:not(:hover) {
        color: var(--color-text-secondary);
    }
    
    .remove {
        margin-inline-start: var(--spacing-md);
        margin-inline-end: var(--spacing-md);
    }

    .queue-item .more {
        margin-inline-start: auto;
    }
</style>