<script>
    import { _ } from "svelte-i18n";
    import { onDestroy, tick, untrack } from "svelte";
    import { Sortable } from "sortablejs";
    import {
        CurrentMedia,
        NowPlayingIndex,
        NowPlayingQueue,
        JukeboxQueue,
    } from "~/stores/state.js";
    import {
        JukeboxVirtualListBind,
        QueueVirtualListBind,
    } from "~/stores/elements.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { updateQueue } from "~/logic/ui.js";
    import QueueItem from "~/components/queue/queue_item.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /**
     * items must be a store
     */
    let { queueType, handleScroll } = $props();

    let items = queueType === "user" ? NowPlayingQueue : JukeboxQueue;

    let containerRef;
    let sortable;
    let indexFinalPosition = null;
    let aborted = false;

    async function handleAction(e, index) {
        if (queueType === "user") {
            $MediaPlayer.playSelected(index);
        }
    }

    async function handlePlayNext(e, index) {
        let [item] = $JukeboxQueue.splice(index, 1);
        $MediaPlayer.playNext([item]);
        await updateQueue();
    }

    async function handlePlayLast(e, index) {
        let [item] = $JukeboxQueue.splice(index, 1);
        $MediaPlayer.playLast([item]);
        await updateQueue();
    }

    $effect(() => {
        if ($items) {
            untrack(() => {
                if (sortable) {
                    sortable.destroy(); // Destroy previous sortable instance
                }

                sortable = new Sortable(containerRef, {
                    animation: 150,
                    handle: ".handle",
                    onStart: (event) => {
                        aborted = false;
                    },
                    onMove: (event) => {
                        if (!event.originalEvent?.ctrlKey) {
                            aborted = true;
                            event.preventDefault();
                            return false;
                        }

                        indexFinalPosition = $items.findIndex(
                            (x) => x._id === event.related.dataset.id,
                        );

                        // don't move preview any moves otherwise the index will be messed up
                        event.preventDefault();
                        return false;
                    },
                    onEnd: async (event) => {
                        if (aborted) return false;

                        let selectedDOMItems =
                            event.items?.length > 0
                                ? event.items
                                : [event.item];

                        // Find the IDs of the items
                        let idsToMove = selectedDOMItems.map(
                            (x) => x.dataset.id,
                        );

                        // Find the items in the target array that need to be moved
                        const itemsToReinsert = $items.filter((item) =>
                            idsToMove.includes(item._id),
                        );

                        // Remove the items from the target array
                        const filteredTargetArray = $items.filter(
                            (item) => !idsToMove.includes(item._id),
                        );

                        // Insert the removed items at the new index
                        const newTargetArray = [
                            ...filteredTargetArray.slice(0, indexFinalPosition),
                            ...itemsToReinsert,
                            ...filteredTargetArray.slice(indexFinalPosition),
                        ];

                        items.set(newTargetArray);

                        await tick();

                        //Reset playing index if needed
                        let currentIndex = $items.findIndex(
                            (item) => item._id === $CurrentMedia._id,
                        );

                        if (currentIndex !== -1) {
                            NowPlayingIndex.set(currentIndex);
                        }
                    },
                });
            });
        }
    });

    $effect(() => {
        if (queueType === "user") {
            $QueueVirtualListBind = containerRef;
        } else {
            $JukeboxVirtualListBind = containerRef;
        }
    });

    onDestroy(() => {
        sortable?.destroy();
    });
</script>

<div
    class="container"
    bind:this={containerRef}
    ontouchstart={handleScroll}
    onwheel={handleScroll}
>
    {#each $items as item, index}
        <div
            onclick={(e) => {
                handleAction(e, index);
            }}
            class="item-container"
            data-index={index}
            data-id={item._id}
        >
            {#if queueType === "jukebox"}
                <div class="add-options">
                    <sl-button
                        onclick={(e) => handlePlayNext(e, index)}
                        title={$_("text.playNext")}
                    >
                        <MaterialSymbol name="skip_next" slot="prefix" />
                    </sl-button>
                    <sl-button
                        onclick={(e) => handlePlayLast(e, index)}
                        title={$_("text.playLast")}
                    >
                        <MaterialSymbol name="add" slot="prefix" />
                    </sl-button>
                </div>
            {/if}
            {#key item._id}
                <QueueItem media={item} {queueType} />
            {/key}
        </div>
    {/each}
</div>

<style>
    .container {
        overflow-y: auto;
        flex: 1;
        background-color: var(--color-background);
        border-radius: 15px;
        margin-block-end: var(--spacing-lg);
        position: relative;
        content-visibility: auto; /* free virtual list! */
    }

    .add-options {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: var(--spacing-md);
        position: absolute;
        inset: 0;
        inset-inline-start: var(--spacing-xl);
        inset-inline-end: var(--spacing-xxxl);
        padding-inline-end: var(--spacing-md);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
    }

    .add-options:after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-color: var(--color-background);
        mask-image: linear-gradient(to right, transparent 30%, black 60%);
        z-index: -1;
    }

    .item-container:hover .add-options {
        opacity: 1;
        pointer-events: auto;
    }
</style>
