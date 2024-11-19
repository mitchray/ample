<script>
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function handlePlayerOpenToggle() {
        let inverted = !$Settings.PlayerIsOpen;
        $Settings.PlayerIsOpen = inverted;
    }
</script>

<sl-tooltip content={$Settings.PlayerIsOpen ? "Hide player" : "Show player"}>
    <sl-button circle onclick={handlePlayerOpenToggle} variant="neutral">
        {#if $Settings.PlayerIsOpen}
            <MaterialSymbol name="expand_more" />
        {:else}
            <MaterialSymbol name="expand_less" />
        {/if}
    </sl-button>
</sl-tooltip>

<style>
    sl-button {
        position: absolute;
        inset-inline-start: 7px;
        inset-block-end: calc(100% + var(--spacing-md));
        z-index: 100;
    }

    sl-button::part(base) {
        background-color: var(--color-surface-container);
    }

    sl-button::part(base) {
        font-size: 18px;
        box-shadow: var(--shadow-md);
    }

    sl-button :global(.icon) {
        position: relative;
        inset-block-start: 2px;
    }
</style>
