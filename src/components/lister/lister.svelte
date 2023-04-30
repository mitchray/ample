<script>
    import { writable } from 'svelte/store';
    import { onDestroy, onMount, setContext } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';

    import Actions2 from '../../components/action/actions.svelte';
    import TableView from './lister_tableView.svelte';
    import CardView from './lister_cardView.svelte';
    import PlaylistRemoveFrom from '../playlist/playlist_removeFrom.svelte';
    import PlaylistReorder from '../playlist/playlist_reorder.svelte';
    import PlaylistRefresh from '../playlist/playlist_refresh.svelte';

    import SVGList from "/src/images/table_rows.svg";
    import SVGGrid from "/src/images/grid.svg";

    export let data;
    export let type;
    export let actionData;    // additional data object for Actions
    export let discSubtitle   = null;
    export let zone           = "generic";
    export let showIndex      = false;
    export let showCheckboxes = false;
    export let showArt        = true;
    export let showArtist     = false;
    export let initialSort    = null;
    export let initialReverse = null;
    export let displayAsTable = true;
    export let tableOnly      = false;

    const contextKey = uuidv4(); // unique key for each instance of lister

    let listerObserver;
    let columnWidths     = writable('');   // the individual sizes for each column
    let listerObject     = writable(null); // the lister itself
    let listerHeader     = writable(null); // the separate header for the lister table
    let listerContainer  = writable(null); // containing element of the lister object
    let listerWrapper    = writable(null); // outer wrapper of lister, currently unused except for CSS
    let dataDisplay      = writable([]);   // editable/sortable/etc. copy of the data
    let availableColumns = writable([]);   // available columns
    let visibleColumns   = writable([]);   // columns to show
    let currentSort      = writable(initialSort); // the current sort method
    let listerColumnsID  = `ListerColumns.${type}.${zone}`;
    let listerDisplayID  = `ListerDisplay.${type}.${zone}`;
    let isEditMode       = writable(false);
    let selectedCount    = writable(0);

    setContext(contextKey, {
        getType: () => type,
        getData: () => data,
        getZone: () => zone,
        getInitialReverse: () => initialReverse,
        listerColumnsID,
        showIndex,
        showCheckboxes,
        showArtist,
        showArt,
        discSubtitle,
        dataDisplay,
        columnWidths,
        listerObject,
        listerHeader,
        listerContainer,
        listerWrapper,
        availableColumns,
        visibleColumns,
        currentSort,
        isEditMode,
        selectedCount
    });

    $: data         = data; //immutable
    $: $dataDisplay = data.slice();

    // overwrite any actionData.songs with our dataDisplay as it may have updated
    $: {
        if (actionData.songs) {
            actionData.songs = $dataDisplay;
        }
    }

    onMount(() => {
        let savedDisplayAsTable = JSON.parse(localStorage.getItem(listerDisplayID));

        if (savedDisplayAsTable !== null) {
            displayAsTable = savedDisplayAsTable;
        }

        // use ResizeObserver on ListerContainer to monitor changes in dimension
        listerObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                if ($listerHeader) {
                    $listerHeader.setStaticWidths();
                }
            });
        });

        listerObserver.observe($listerContainer);
    });

    onDestroy(() => {
        if (listerObserver) {
            listerObserver.disconnect();
        }
    });

    function setTableDisplay(pref) {
        displayAsTable = pref;
        localStorage.setItem(listerDisplayID, JSON.stringify(displayAsTable));
    }
</script>


<div class="lister-wrapper" bind:this={$listerWrapper} class:actions-disabled={actionData.disable}>
    <div class="lister-actions">
        {#if !actionData.disable}
            <div class="group">
                <Actions2 mode="fullButtons" {...actionData} />
            </div>
        {/if}

        {#if discSubtitle}
            <div class="disc-subtitle">{discSubtitle}</div>
        {/if}

        {#if !tableOnly}
            <div class="group">
                <button class="button" on:click={() => { setTableDisplay(true) }} class:active={displayAsTable}><SVGList /> List</button>
                <button class="button" on:click={() => { setTableDisplay(false) }} class:active={!displayAsTable}><SVGGrid /> Grid</button>
            </div>
        {/if}

        {#if type === "playlist_songs"}
            {#if showCheckboxes}
                <div class="group">
                    <PlaylistRemoveFrom contextKey={contextKey} />
                </div>

                <div class="group">
                    <PlaylistReorder contextKey={contextKey} />
                </div>
            {/if}

            {#if !showCheckboxes}
                <div class="group">
                    <PlaylistRefresh contextKey={contextKey} />
                </div>
            {/if}
        {/if}
    </div>

    <div class="lister-container" bind:this={$listerContainer} class:is-table={displayAsTable}>
        {#if type === "playlist_songs" || displayAsTable}
            <TableView contextKey={contextKey} />
        {:else}
            <CardView contextKey={contextKey} />
        {/if}
    </div>
</div>


<style>
    .lister-wrapper {
        margin-bottom: var(--spacing-lg);
    }

    :global(*:not(h1) +) .lister-wrapper {
        margin-top: var(--spacing-xxl); /* account for the lister actions background */
    }

    .lister-actions {
        display: flex;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
        position: sticky;
        top: 0;
        z-index: 1;
        align-items: center;
    }

    .lister-actions > .group {
        display: flex;
        gap: var(--spacing-sm);
    }

    .lister-actions:after {
        content: '';
        display: block;
        background-color: var(--color-background);
        width: calc(100% + 2rem);
        position: absolute;
        top: calc(-1 * var(--spacing-xxl));
        left: -1rem;
        bottom: calc(-1 * var(--spacing-lg) - 1px);
        z-index: -1;
        pointer-events: none;
    }

    .actions-disabled .lister-actions {
        margin-bottom: 0;
    }

    .actions-disabled .lister-actions:after {
        bottom: calc(-1 * var(--spacing-sm) - 1px);
    }

    .lister-container {
        width: auto;
        max-width: 100%;
        display: flex;
        flex-direction: column;
        contain: content;
    }

    .lister-container.is-table {
        width: fit-content;
    }

    .lister-container.is-table:global(.scroll-start) :global(.name:before) {
        box-shadow: 2px 0 6px rgba(var(--color-shadow-val),0.2);
        clip-path: inset(0px -10px 0px 0px);
    }

    .lister-container.is-table:global(.scroll-end) :global(.actions:before) {
        box-shadow: -2px 0 6px rgba(var(--color-shadow-val),0.2);
        clip-path: inset(0px 0px 0px -10px);
    }

    .lister-container.is-table :global(.name:before),
    .lister-container.is-table :global(.actions:before) {
        content: '';
        background-color: var(--color-column-sticky);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }

    .lister-container.is-table:global(.scroll-start) :global(.name:before),
    .lister-container.is-table:global(.scroll-end) :global(.actions:before) {
        opacity: 1;
    }

    .disc-subtitle {
        color: var(--color-highlight);
        font-weight: 700;
    }
</style>