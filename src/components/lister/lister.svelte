<script>
    import { onDestroy, onMount, setContext } from 'svelte';
    import { writable } from 'svelte/store';
    import { v4 as uuidv4 } from 'uuid';

    import TableView from './lister_tableView.svelte';

    export let data;
    export let type;
    export let showIndex = false;
    export let showCheckboxes = false;
    export let initialSort = null;
    export let initialReverse = null;

    const contextKey = uuidv4();

    let listerObserver;
    let columnWidths = writable('');
    let lister = writable(null);
    let listerHeader = writable(null);
    let listerContainer = writable(null);
    let listerWrapper = writable(null);
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
        visible,
        visibleColumns,
        currentSort
    });

    $: data = data; //immutable
    $: $dataDisplay = data.slice();
    $: $visible = $dataDisplay.slice();

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
        border-radius: 5px;
        border: 2px solid var(--color-text-subheading);
        display: flex;
        flex-direction: column;
        contain: content;
    }
</style>