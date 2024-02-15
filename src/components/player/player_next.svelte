<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import {
        IsMobile,
        NowPlayingQueue,
        NowPlayingIndex,
    } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";

    let dropdown;
    $: nextItem = $NowPlayingQueue[$NowPlayingIndex + 1];

    let timeout;

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
        on:click={() => $MediaPlayer.next()}
        on:pointerover={handleOver}
        disabled={$NowPlayingQueue.length === 0}
    >
        <MaterialSymbol name="skip_next" />
    </sl-button>

    {#if nextItem && !$IsMobile}
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
