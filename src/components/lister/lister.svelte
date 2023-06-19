<script>
    import { writable } from 'svelte/store';
    import { onDestroy, onMount, setContext } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { DispatchListerEvent, ListerEvent } from "../../stores/message";
    import { SiteContentBind } from "../../stores/player";

    import TableView from './lister_tableView.svelte';
    import CardView from './lister_cardView.svelte';
    import ListerActions from './lister_actions.svelte';

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
    export let virtualList    = false;

    const contextKey = uuidv4(); // unique key for each instance of lister

    // underscore prefixed items are accessor aliases of exported params
    let _data            = writable(data);
    let _type            = writable(type);
    let _actionData      = writable(actionData);
    let _discSubtitle    = writable(discSubtitle);
    let _zone            = writable(zone);
    let _showIndex       = writable(showIndex);
    let _showCheckboxes  = writable(showCheckboxes);
    let _showArt         = writable(showArt);
    let _showArtist      = writable(showArtist);
    let _initialSort     = writable(initialSort);
    let _initialReverse  = writable(initialReverse);
    let _displayAsTable  = writable(displayAsTable);
    let _tableOnly       = writable(tableOnly);
    let _virtualList     = writable(virtualList);

    let listerObject     = writable(null); // the lister itself
    let listerScroller   = writable(null); // the lister-flex object
    let listerHeader     = writable(null); // the separate header for the lister table
    let listerContainer  = writable(null); // containing element of the lister object
    let listerWrapper    = writable(null); // outer wrapper of lister, currently unused except for CSS
    let dataDisplay      = writable([]);   // editable/sortable/etc. copy of the data
    let dataFinal        = writable([]);   // final data to render, either full set or virtual subset
    let availableColumns = writable([]);   // available columns
    let visibleColumns   = writable([]);   // columns to show
    let currentSort      = writable(initialSort); // the current sort method
    let listerColumnsID  = writable(`ListerColumns.${type}.${zone}`);
    let listerDisplayID  = writable(`ListerDisplay.${type}.${zone}`);
    let isEditMode       = writable(false);
    let selectedCount    = writable(0);
    let pseudoHeight     = writable(null);
    let rowHeight        = writable(60);
    let offsetY          = writable(0);
    let listerHeight     = writable(null);
    let listerObserver;

    setContext(contextKey, {
        _data,
        _type,
        _actionData,
        _discSubtitle,
        _zone,
        _showIndex,
        _showCheckboxes,
        _showArt,
        _showArtist,
        _initialSort,
        _initialReverse,
        _displayAsTable,
        _tableOnly,
        _virtualList,
        listerObject,
        listerScroller,
        listerHeader,
        listerContainer,
        listerWrapper,
        dataDisplay,
        dataFinal,
        availableColumns,
        visibleColumns,
        currentSort,
        listerColumnsID,
        listerDisplayID,
        isEditMode,
        selectedCount,
        pseudoHeight,
        rowHeight,
        offsetY,
        listerHeight,
    });

    $: data          = data; //immutable
    $: $dataDisplay  = data.slice();
    $: $dataFinal    = (virtualList) ? $dataFinal : $dataDisplay;
    $: $listerHeight = (virtualList) ? $SiteContentBind.clientHeight - 10 + "px" : 'auto';
    $: $pseudoHeight = (virtualList) ? $dataDisplay.filter(e => !e.isDeleted).length * $rowHeight + "px" : 'auto';
    $: $offsetY      = (virtualList) ? parseInt($offsetY) + "px" : '0px';

    // overwrite any actionData.songs with our dataDisplay as it may have updated
    $: {
        if ($_actionData.data?.songs) {
            $_actionData.data.songs = $dataDisplay;
        }
    }

    $: {
        if ($listerContainer && $_displayAsTable && $_virtualList) {
            $listerContainer.style.maxHeight = $listerHeight;
        }
    }

    // handleEvents whenever a new event is dispatched
    $: $ListerEvent, handleEvents();

    function handleEvents() {
        // if missing _id, something went wrong...
        if (!$ListerEvent._id) {
            clearEvent();
            return;
        }

        // if types don't match, ignore showing updates
        if ($ListerEvent.type !== $_type) {
            clearEvent();
            return;
        }

        switch ($ListerEvent.event) {
            case "addedPlaylist":
                data = [
                    $ListerEvent.data,
                    ...data
                ];
                break;
            case "editedPlaylist":
                let oldPlaylist = data.find( obj => obj.id === $ListerEvent.data.id);
                Object.assign(oldPlaylist, $ListerEvent.data);
                data = data;
                break;
            case "deletedPlaylist":
                data = data.filter( obj => obj.id !== $ListerEvent.data.id);
                break;
            default:
                // console.debug($ListerEvent, "event not recognised");
                break;
        }

        // clear the event once actioned
        clearEvent();
    }

    function clearEvent() {
        $DispatchListerEvent = null;
    }

    onMount(() => {
        let savedDisplayAsTable = JSON.parse(localStorage.getItem($listerDisplayID));

        if (savedDisplayAsTable !== null) {
            $_displayAsTable = savedDisplayAsTable;
        }
    });

    onDestroy(() => {
        if (listerObserver) {
            listerObserver.disconnect();
        }
    });
</script>

<div class="lister-wrapper" bind:this={$listerWrapper}>
    <ListerActions contextKey={contextKey} />

    <div class="lister-container"
         bind:this={$listerContainer}
         class:is-table={$_displayAsTable}
         class:is-virtual={$_virtualList}
    >
        {#if $_type === "playlist_songs" || $_displayAsTable}
            <TableView contextKey={contextKey} />
        {:else}
            <CardView contextKey={contextKey} />
        {/if}
    </div>
</div>

<style>
    .lister-wrapper {
        container-name: lister-wrapper;
        container-type: inline-size;
    }

    .lister-container {
        width: auto;
        max-width: 100%;
        contain: content;
        overflow-y: auto;
    }

    .lister-container.is-virtual :global(.header-flex)  {
        inset-block-start: 0;
    }

    /* need the scrollbar space but don't want it visible */
    .lister-container.is-table :global(.header-flex)  {
        scrollbar-color: var(--color-highlight) transparent;
    }

    /* Chrome version of above */
    .lister-container.is-table :global(.header-flex)::-webkit-scrollbar-track {
        background: unset;
    }

    /* reserve scrollbar space to maintain alignments */
    .lister-container.is-table :global(.header-flex),
    .lister-container.is-table :global(.lister-flex) {
        scrollbar-gutter: stable;
        overflow-y: scroll;
    }

    .lister-container.is-table {
        width: fit-content;
        display: flex;
        flex-direction: column;
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
        inset-block-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        inset-inline-start: 0;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
    }

    .lister-container.is-table:global(.scroll-start) :global(.name:before),
    .lister-container.is-table:global(.scroll-end) :global(.actions:before) {
        opacity: 1;
    }
</style>