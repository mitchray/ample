<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { showQueueItemAtIndex } from "~/logic/ui.js";
    import { NowPlayingIndex } from "~/stores/state.js";
    import { tick } from "svelte";

    async function handleQueueToggle() {
        let inverted = !$Settings.QueueIsOpen;
        $Settings.QueueIsOpen = inverted;

        if (inverted === true) {
            await tick();
            await showQueueItemAtIndex($NowPlayingIndex);
        }
    }
</script>

<sl-tooltip
    content={$Settings.QueueIsOpen
        ? $_("text.queueHide")
        : $_("text.queueShow")}
    placement="left"
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
        inset-inline-end: var(--spacing-md);
        inset-block-end: var(--spacing-md);
        z-index: 100;
        scale: 0.9;
        transform-origin: bottom right;
    }

    sl-button::part(base) {
        font-size: 20px;
    }

    sl-button :global(.icon) {
        position: relative;
        inset-inline-start: 2px;
        inset-block-start: 2px;
    }
</style>
