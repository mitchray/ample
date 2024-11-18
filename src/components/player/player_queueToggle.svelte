<script>
    import { QueueIsOpen, Saved } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { showQueueItemAtIndex } from "~/logic/ui.js";
    import { NowPlayingIndex, ShowVisualizer } from "~/stores/state.js";

    function handleQueueToggle() {
        let inverted = !$QueueIsOpen;
        $Saved.setItem("QueueIsOpen", inverted);
        QueueIsOpen.set(inverted);

        if (inverted === true) {
            showQueueItemAtIndex($NowPlayingIndex);
        }
    }
</script>

<sl-tooltip content={$QueueIsOpen ? "Hide Queue" : "Show Queue"}>
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
