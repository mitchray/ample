<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { CurrentMedia, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";

    let dropdown = $state();
    let nextItem = $state();
    let timeout;

    function update() {
        nextItem = $MediaPlayer?.findViableItem("next");
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
        disabled={!nextItem}
        onclick={() => $MediaPlayer.next(true)}
        onpointerover={handleOver}
        slot="trigger"
    >
        <MaterialSymbol name="skip_next" />
    </sl-button>

    {#if nextItem}
        <sl-card>
            <GenericCard
                type={nextItem.object_type}
                data={nextItem}
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
