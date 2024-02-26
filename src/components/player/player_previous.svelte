<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { CurrentMedia, IsMobile, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";

    let dropdown;
    let previousItem;
    let timeout;

    $: $CurrentMedia, update();
    $: $NowPlayingQueue, update();

    function update() {
        previousItem = $MediaPlayer?.findViableItem("previous");
    }

    function handleOver() {
        timeout = setTimeout(() => {
            dropdown.show();
        }, 600);
    }

    function handleOut() {
        clearTimeout(timeout);
        dropdown.hide();
    }
</script>

<sl-dropdown bind:this={dropdown} on:pointerleave={handleOut} placement="top">
    <sl-button
        slot="trigger"
        on:click={() => $MediaPlayer.previous()}
        on:pointerover={handleOver}
        disabled={$NowPlayingQueue.length === 0}
    >
        <MaterialSymbol name="skip_previous" />
    </sl-button>

    {#if previousItem && !$IsMobile}
        <sl-card>
            <GenericCard
                type={previousItem.object_type}
                data={previousItem}
                showActions={false}
            />
        </sl-card>
    {/if}
</sl-dropdown>

<style>
    sl-button :global(*) {
        pointer-events: none;
    }

    sl-card {
        max-width: 400px;
    }

    sl-card::part(body) {
        padding: var(--spacing-sm);
        padding-inline-end: var(--spacing-md);
    }
</style>
