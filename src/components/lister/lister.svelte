<script>
    import { onDestroy, onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { v4 as uuidv4 } from 'uuid';

    import TableView from './lister_tableView.svelte';

    export let data;
    export let type;
    export let showIndex      = false;
    export let showCheckboxes = false;
    export let initialSort    = null;
    export let initialReverse = null;

    const contextKey = uuidv4(); // unique key for each instance of lister

    let listerObserver;
    let columnWidths     = writable('');   // the individual sizes for each column
    let listerObject     = writable(null); // the lister itself
    let listerHeader     = writable(null); // the separate header for the lister table
    let listerContainer  = writable(null); // containing element of the lister object
    let listerWrapper    = writable(null); // outer wrapper of lister, currently unused except for CSS
    let dataDisplay      = writable([]);   // editable/sortable/etc copy of the data
    let availableColumns = writable([]);   // available columns
    let visibleColumns   = writable([]);   // columns to show
    let currentSort      = writable(initialSort); // the current sort method

    setContext(contextKey, {
        getType: () => type,
        getData: () => data,
        getInitialReverse: () => initialReverse,
        showIndex,
        showCheckboxes,
        dataDisplay,
        columnWidths,
        listerObject,
        listerHeader,
        listerContainer,
        listerWrapper,
        availableColumns,
        visibleColumns,
        currentSort
    });

    $: data         = data; //immutable
    $: $dataDisplay = data.slice();

    onMount(() => {
        // use ResizeObserver on ListerContainer to monitor changes in dimension
        listerObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
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
    <div class="lister-container" bind:this={$listerContainer}>
        <TableView contextKey={contextKey} />
    </div>
</div>


<style>
    .lister-wrapper {
        margin-bottom: var(--spacing-lg);
    }

    .lister-container {
        width: fit-content;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        contain: content;
    }

    .lister-container:global(.scroll-start) :global(.name) {
        box-shadow: 2px 0 6px rgba(0,0,0,0.2);
        clip-path: inset(0px -10px 0px 0px);
    }

    .lister-container:global(.scroll-end) :global(.actions) {
        box-shadow: -2px 0 6px rgba(0,0,0,0.2);
        clip-path: inset(0px 0px 0px -10px);
    }
</style>