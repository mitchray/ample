<script>
    import { onMount, onDestroy, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { v4 as uuidv4 } from 'uuid';

    import ListerActions from './lister_actions.svelte';
    import TableView from './lister_tableView.svelte';

    export let data;
    export let type;
    export let showIndex = false;
    export let showCheckboxes = false;
    export let initialSort = null;
    export let initialReverse = null;

    const contextKey = uuidv4();

    let listerObserver;
    let startNode;
    let visibleNodesCount;
    let nodePadding = 5;
    let lastKnownScroll = 0;
    let ticking = false;
    let scrollTimer;
    let offsetY;
    let totalContentHeight;

    let columnWidths = writable('');
    let lister = writable(null);
    let listerHeader = writable(null);
    let listerContainer = writable(null);
    let listerWrapper = writable(null);
    let rowHeight = writable(null);
    let viewportHeight = writable(null);
    let itemsPerRow = writable(null);
    let dataDisplay = writable([]);
    let visible = writable([]);
    let visibleColumns = writable([]);
    let currentSort = writable(initialSort);

    setContext(contextKey, {
        getType: () => type,
        getData: () => data,
        getInitialReverse: () => initialReverse,
        showIndex,
        showCheckboxes,
        dataDisplay,
        columnWidths,
        lister,
        listerHeader,
        listerContainer,
        listerWrapper,
        rowHeight,
        itemsPerRow,
        visible,
        visibleColumns,
        currentSort
    });

    $: data = data; //immutable
    $: $dataDisplay = data.slice();
    $: $visible = $dataDisplay.slice(startNode, startNode + visibleNodesCount).map((d, i) => {
        return d;
    });

    function limitScroll() {
        lastKnownScroll = $listerContainer.scrollTop;
        requestTick();
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }

    async function update() {
        ticking = false;

        clearTimeout(scrollTimer);

        $listerContainer.classList.add('disable-hover');
        scrollTimer = setTimeout(function(){
            if ($listerContainer) {
                $listerContainer.classList.remove('disable-hover');
            }
        }, 200);

        startNode = Math.floor(lastKnownScroll / $rowHeight) - nodePadding;
        startNode = Math.max(0, startNode);

        visibleNodesCount = Math.ceil(viewportHeight / $rowHeight) + (2 * nodePadding);
        visibleNodesCount = Math.min($dataDisplay.length - startNode, visibleNodesCount);

        // account for sticky header taking up a slot at the start
        if (startNode === 0 && $dataDisplay.length > visibleNodesCount) {
            visibleNodesCount = visibleNodesCount - 1;
        }

        offsetY = startNode * $rowHeight;
        $listerContainer.style.setProperty('--c-lister-offset', offsetY + "px");

        // DEBUG ZONE
        // console.debug('==========================');
        // console.debug('viewport height', viewportHeight);
        // console.debug('total height', totalContentHeight);
        // console.debug('index of first node to show', startNode);
        // console.debug('how many to show', visibleNodesCount);
        // console.debug('offset', offsetY);
    }

    onMount(() => {
        totalContentHeight = $rowHeight * data.length;
        $listerContainer.style.setProperty('--lister-total-height', totalContentHeight + "px");

        // initialise height to begin adding items, will be updated then on by observer
        viewportHeight = parseInt(window.getComputedStyle($listerContainer).maxHeight, 10);
        viewportHeight = Math.min($rowHeight * $dataDisplay.length, viewportHeight);

        update();

        // use ResizeObserver on ListerContainer to monitor changes in dimension
        listerObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                viewportHeight = entry.target.getBoundingClientRect().height;
                // console.debug("width", entry.target.getBoundingClientRect().width);

                $listerHeader.setStaticWidths();
            });
        });

        listerObserver.observe($listerContainer);
    });

    onDestroy(() => {
        if (listerObserver) {
            listerObserver.disconnect();
        }
    });
</script>


<div class="lister-wrapper" bind:this={$listerWrapper}>
    <ListerActions contextKey={contextKey} />

    <div class="lister-container" bind:this={$listerContainer} on:scroll={limitScroll}>
        <TableView contextKey={contextKey} />
    </div>
</div>


<style>
    .lister-wrapper {
        max-width: 100%;
    }

    .lister-container {
        border-radius: 5px;
        border: 2px solid var(--color-text-subheading);
        max-height: calc(100vh - (4 * var(--spacing-xl)) - var(--size-webplayer-height));
        max-width: 100%;
        width: fit-content;
        position: relative;
        overscroll-behavior: contain;
        will-change: contents;
        overflow-y: scroll;
    }

    :global(.lister-container.disable-hover *) {
        pointer-events: none !important;
    }

    /* simulate full height of the items */
    :global(.lister:after) {
        content: '';
        display: block;
        background-color: hsla(120, 100%, 50%, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0;
        height: var(--lister-total-height);
        pointer-events: none;
    }
</style>