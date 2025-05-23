<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { CurrentMedia, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";

    let dropdown = $state();
    let previousItem = $state();
    let timeout;

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

    $effect(() => {
        $CurrentMedia, update();
        $NowPlayingQueue, update();
    });
</script>

<sl-dropdown bind:this={dropdown} onpointerleave={handleOut} placement="top">
    <sl-button
        disabled={!previousItem}
        onclick={() => $MediaPlayer.previous()}
        onpointerover={handleOver}
        slot="trigger"
    >
        <MaterialSymbol name="skip_previous" />
    </sl-button>

    {#if previousItem}
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
