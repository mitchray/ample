<script>
    import { _ } from "svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { showQueueItemAtIndex } from "~/logic/ui.js";
    import { NowPlayingIndex, ShowVisualizer } from "~/stores/state.js";
    import { tick } from "svelte";

    async function handleQueueToggle() {
        let inverted = !$Settings.QueueIsOpen;
        $Settings.QueueIsOpen = inverted;

        if (inverted === true) {
            await tick();
            await showQueueItemAtIndex($NowPlayingIndex, true);
        }
    }
</script>

<sl-tooltip
    content={$Settings.QueueIsOpen
        ? $_("text.queueHide")
        : $_("text.queueShow")}
>
    <sl-button
        circle
        id="queue-button"
        onclick={handleQueueToggle}
        variant="primary"
    >
        <MaterialSymbol name="playlist_play" />
    </sl-button>
</sl-tooltip>

<style>
    sl-button {
        position: absolute;
        inset-inline-end: var(--spacing-lg);
        inset-block-end: calc(100% + var(--spacing-md));
        z-index: 100;
    }

    sl-button::part(base) {
        font-size: 20px;
        box-shadow: var(--shadow-md);
    }

    sl-button :global(.icon) {
        position: relative;
        inset-inline-start: 2px;
        inset-block-start: 2px;
    }
</style>
