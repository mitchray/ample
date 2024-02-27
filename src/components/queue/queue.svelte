<script>
    import { _ } from "svelte-i18n";
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import { waitForElement } from "~/logic/helper.js";
    import { showCurrentMedia } from "~/logic/ui.js";
    import { clickOutsideDetector } from "~/actions/clickOutsideDetector.js";
    import { Saved, QueueIsOpen, QueueIsPinned } from "~/stores/settings.js";
    import {
        IsMobile,
        CurrentMedia,
        NowPlayingQueue,
        QueueIsUpdating,
        NowPlayingIndex,
    } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import QueueItem from "~/components/queue/queue_item.svelte";
    import SkipBelowButton from "~/components/queue/queue_skipBelow.svelte";
    import RefillButton from "~/components/queue/queue_refill.svelte";

    const flipDurationMs = 100;

    let dragDisabled = true;
    let siteQueueBind;

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);
    }

    function handleClearPrevious() {
        $NowPlayingQueue.splice(0, $NowPlayingIndex);
        $NowPlayingQueue = $NowPlayingQueue;
        $NowPlayingIndex = 0;

        waitForElement(".queue-list").then((selector) => {
            selector.scrollTop = 0;
        });
    }

    function handleClearQueue() {
        $MediaPlayer.clearQueue();
    }

    function handleSort(e) {
        NowPlayingQueue.set([...e.detail.items]);

        let currentIndex = $NowPlayingQueue.findIndex(
            (item) => item._id === $CurrentMedia._id,
        );

        if (currentIndex !== -1) {
            NowPlayingIndex.set(currentIndex);
        }

        dragDisabled = true;
    }

    function transformDraggedElement(draggedEl) {
        draggedEl.classList.add("queue-dragging");
    }

    function togglePinned() {
        let inverted = !$QueueIsPinned;
        $Saved.setItem("QueueIsPinned", inverted);
        QueueIsPinned.set(inverted);
    }

    function handleClickOutside() {
        if (siteQueueBind?.classList.contains("is-drawer")) {
            let status = false;
            $Saved.setItem("QueueIsOpen", status);
            QueueIsOpen.set(status);
        }
    }
</script>

<div
    class="site-queue"
    class:is-open={$QueueIsOpen}
    class:is-drawer={$IsMobile || !$QueueIsPinned}
    bind:this={siteQueueBind}
    use:clickOutsideDetector={{
        toggle: "#queue-button",
        ignore: ".c-menu",
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="site-queue-inner">
        <div class="header panel-header">
            <h4>{$_("text.queue")}</h4>

            <sl-button-group>
                <sl-button
                    class="show-current"
                    size="small"
                    title={$_("text.queueShowCurrent")}
                    on:click={showCurrentMedia}
                >
                    <MaterialSymbol name="visibility" />
                </sl-button>

                <SkipBelowButton />

                <RefillButton />

                <sl-dropdown>
                    <sl-button slot="trigger" size="small">
                        <MaterialSymbol name="more_horiz" />
                    </sl-button>

                    <sl-menu>
                        {#if !$IsMobile}
                            <sl-menu-item
                                on:click|stopPropagation={togglePinned}
                            >
                                {#if $QueueIsPinned}
                                    {$_("text.queueUnpin")}
                                {:else}
                                    {$_("text.queuePin")}
                                {/if}
                            </sl-menu-item>
                        {/if}

                        <sl-menu-item on:click={handleClearPrevious}>
                            {$_("text.queueClearPrevious")}
                        </sl-menu-item>
                    </sl-menu>
                </sl-dropdown>
            </sl-button-group>

            <sl-button
                size="small"
                variant="danger"
                class="clear-all"
                circle
                on:click={handleClearQueue}
                title={$_("text.clearAll")}
            >
                <MaterialSymbol name="delete" />
            </sl-button>
        </div>

        <div
            class="queue-list"
            use:dndzone={{
                items: $NowPlayingQueue,
                dropTargetStyle: {},
                flipDurationMs: flipDurationMs,
                transformDraggedElement,
                dragDisabled,
            }}
            on:consider={handleSort}
            on:finalize={handleSort}
            style="display: {$QueueIsUpdating ? 'none' : null}"
        >
            {#if $NowPlayingQueue && $NowPlayingQueue.length > 0}
                {#each $NowPlayingQueue as media, i (media)}
                    <div
                        on:click={(e) => {
                            handleAction(e, i);
                        }}
                        animate:flip={{ duration: flipDurationMs }}
                    >
                        <QueueItem {media} bind:dragDisabled />
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
        background-color: var(--color-surface-container);
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
        inset-block-end: var(--size-player-height);
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

    .queue-list {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        background-color: var(--color-background);
        border-radius: 15px;
        margin-block-end: var(--spacing-lg);
    }

    :global(.queue-dragging) {
        background-color: var(--color-primary-container) !important;
        color: var(--color-on-primary-container);
        box-shadow: var(--shadow-lg);
    }

    .show-current :global(.icon) {
        position: relative;
        top: 1px;
    }
</style>
