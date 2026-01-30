<script>
    import { _ } from "@rgglez/svelte-i18n";
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
    import { onDestroy, onMount, tick, mount } from "svelte";
    import { TabulatorFull as Tabulator } from "tabulator-tables";
    import { throttle } from "lodash-es";
    import { tabulatorStrings } from "~/logic/i18n.js";

    let { queueType, handleScroll } = $props();

    // items must be a store
    let items = queueType === "user" ? NowPlayingQueue : JukeboxQueue;

    let containerRef;
    let tabulator;
    /** Skip next setData when update came from rowMoved to avoid redraw jank. */
    let skipNextSetData = false;

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
        if (queueType === "user") {
            $QueueVirtualListBind = containerRef;
        } else {
            $JukeboxVirtualListBind = containerRef;
        }
    });

    onMount(async () => {
        await tick();
        tabulator = new Tabulator(containerRef, {
            data: $items,
            headerVisible: false,
            height: "100%",
            rowHeight: 46,
            movableRows: true,
            layout: "fitColumns",
            locale: true,
            langs: tabulatorStrings,

            rowFormatter: function (row) {
                const element = row.getElement();
                const data = row.getData();

                if (element._queueItemDestroy) {
                    element._queueItemDestroy();
                    element._queueItemDestroy = null;
                }

                const instance = mount(QueueItem, {
                    target: element,
                    props: {
                        media: data,
                        queueType: queueType,
                    },
                });
                element._queueItemDestroy =
                    instance?.destroy != null ? () => instance.destroy() : null;
            },
        });

        tabulator.on("rowMoved", () => {
            skipNextSetData = true;
            const data = tabulator.getData();
            items.set([...data]);
            if (queueType === "user") {
                const idx = data.findIndex(
                    (item) => item._id === $CurrentMedia?._id,
                );
                if (idx !== -1) NowPlayingIndex.set(idx);
            } else {
                updateQueue();
            }
        });

        // centre table in viewport on scroll
        // tabulator.on("scrollVertical", handleScroll);
    });

    $effect(() => {
        const data = $items; // proxy as using $items directly fails
        if (skipNextSetData) {
            skipNextSetData = false;
            return;
        }
        tabulator?.replaceData(data);
    });

    onDestroy(() => {
        tabulator?.off("rowMoved");
        // tabulator?.off("scrollVertical");
        // tabulator?.setData([]);
        tabulator = null;
    });
</script>

<div
    class="container"
    bind:this={containerRef}
    data-id={queueType}
    ontouchstart={handleScroll}
    onwheel={handleScroll}
></div>

<style>
    .container {
        overflow-y: auto;
        flex: 1;
        background-color: var(--color-background);
        border-radius: 15px;
        margin-block-end: var(--spacing-lg);
        position: relative;
        /*content-visibility: auto; !* free virtual list! *!*/
    }

    .container :global(.tabulator-table) {
        width: 100%;
    }

    :global(#app) .container :global(.tabulator-row) {
        border: 0;
        width: 100%;
        font-size: 13px;
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

    .item-container {
        position: relative;
    }

    .item-container:hover .add-options {
        opacity: 1;
        pointer-events: auto;
    }
</style>
