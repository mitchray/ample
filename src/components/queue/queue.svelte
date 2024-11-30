<script>
    import { _ } from "svelte-i18n";
    import { createVirtualizer } from "@tanstack/svelte-virtual";
    import { showQueueItemAtIndex, updateQueue } from "~/logic/ui.js";
    import { clickOutsideDetector } from "~/actions/clickOutsideDetector.js";
    import { Settings } from "~/stores/settings.js";
    import {
        IsMobile,
        NowPlayingIndex,
        NowPlayingQueue,
    } from "~/stores/state.js";
    import { MediaPlayer, QueueVirtualListBind } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import QueueItem from "~/components/queue/queue_item.svelte";
    import SkipBelowButton from "~/components/queue/queue_skipBelow.svelte";
    import RefillButton from "~/components/queue/queue_refill.svelte";

    let siteQueueBind = $state();

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);
    }

    async function handleClearPrevious() {
        $NowPlayingQueue.splice(0, $NowPlayingIndex);
        await updateQueue();
        $NowPlayingIndex = 0;
        virtualListEl.scrollTop = 0;
    }

    function handleClearQueue() {
        $MediaPlayer.clearQueue();
    }

    function togglePinned() {
        let inverted = !$Settings.QueueIsPinned;
        $Settings.QueueIsPinned = inverted;
    }

    function handleClickOutside() {
        if (siteQueueBind?.classList.contains("is-drawer")) {
            let status = false;
            $Settings.QueueIsOpen = status;
        }
    }

    let virtualListEl = $state();
    let virtualizer = $derived(
        createVirtualizer({
            count: $NowPlayingQueue.length,
            getScrollElement: () => virtualListEl,
            estimateSize: () => 46,
            overscan: 10,
        }),
    );
    let items = $derived($virtualizer.getVirtualItems());

    $effect(() => {
        $QueueVirtualListBind = $virtualizer;
    });
</script>

<div
    bind:this={siteQueueBind}
    class="site-queue"
    class:is-drawer={$IsMobile || !$Settings.QueueIsPinned}
    class:is-open={$Settings.QueueIsOpen}
    onclickedOutside={handleClickOutside}
    use:clickOutsideDetector={{
        toggle: "#queue-button",
        ignore: ".c-menu",
    }}
>
    <div class="site-queue-inner">
        <div class="header panel-header">
            <h4>{$_("text.queue")}</h4>

            <sl-button-group>
                <sl-button
                    class="show-current"
                    onclick={showQueueItemAtIndex($NowPlayingIndex)}
                    size="small"
                    title={$_("text.queueShowCurrent")}
                >
                    <MaterialSymbol name="visibility" />
                </sl-button>

                <SkipBelowButton />

                <RefillButton />

                <sl-dropdown>
                    <sl-button size="small" slot="trigger">
                        <MaterialSymbol name="more_horiz" />
                    </sl-button>

                    <sl-menu>
                        {#if !$IsMobile}
                            <sl-menu-item
                                onclick={(e) => {
                                    e.stopPropagation();
                                    togglePinned();
                                }}
                            >
                                {#if $Settings.QueueIsPinned}
                                    {$_("text.queueUnpin")}
                                {:else}
                                    {$_("text.queuePin")}
                                {/if}
                            </sl-menu-item>
                        {/if}

                        <sl-menu-item onclick={handleClearPrevious}>
                            {$_("text.queueClearPrevious")}
                        </sl-menu-item>
                    </sl-menu>
                </sl-dropdown>
            </sl-button-group>

            <sl-button
                circle
                class="clear-all"
                onclick={handleClearQueue}
                size="small"
                title={$_("text.clearAll")}
                variant="danger"
            >
                <MaterialSymbol name="delete" />
            </sl-button>
        </div>

        <div class="queue-list">
            <div
                bind:this={virtualListEl}
                style="overflow-y: auto; position: absolute; inset: 0;"
            >
                <div style="height: {$virtualizer.getTotalSize()}px;">
                    {#each items as item (item)}
                        <div
                            onclick={(e) => {
                                handleAction(e, item.index);
                            }}
                            style="top: {item.start}px; position: absolute; left: 0; width: 100%;"
                            data-index={item.index}
                        >
                            <QueueItem media={$NowPlayingQueue[item.index]} />
                        </div>
                    {/each}
                </div>
            </div>
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
        position: relative;
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
