<script>
    import { clickOutsideDetector } from "~/actions/clickOutsideDetector.js";
    import { Settings } from "~/stores/settings.js";
    import { QueuePanelBind } from "~/stores/elements.js";
    import Jukebox from "~/components/queue/queue_jukebox.svelte";
    import UserQueue from "~/components/queue/queue_user.svelte";

    let siteQueueBind = $state();

    function handleClickOutside() {
        if (siteQueueBind?.classList.contains("is-drawer")) {
            let status = false;
            $Settings.QueueIsOpen = status;
        }
    }
</script>

<div
    bind:this={siteQueueBind}
    class="site-queue"
    class:is-drawer={!$Settings.QueueIsPinned}
    class:is-open={$Settings.QueueIsOpen}
    onclickedOutside={handleClickOutside}
    use:clickOutsideDetector={{
        toggle: "#queue-button",
        ignore: ".c-menu",
    }}
>
    <div class="site-queue-inner">
        <sl-split-panel
            vertical
            position="100"
            style="--min: 55px; --max: calc(100% - 55px);"
            bind:this={$QueuePanelBind}
        >
            <div class="user-queue panel-section" slot="start">
                <UserQueue />
            </div>

            <div class="jukebox-queue panel-section" slot="end">
                <Jukebox />
            </div>
        </sl-split-panel>
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
        inset-block-start: 0;
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

    .site-queue :global(.header) {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        padding: 0;
        gap: var(--spacing-md);
        border: 0;
        height: 48px;
    }

    :global(.queue-dragging) {
        background-color: var(--color-primary-container) !important;
        color: var(--color-on-primary-container);
        box-shadow: var(--shadow-lg);
    }

    sl-split-panel {
        height: 100%;
    }

    .panel-section {
        overflow-y: hidden;
        display: flex;
        flex-direction: column;
        flex: 1;
        position: relative;
    }
</style>
