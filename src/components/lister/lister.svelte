<script context="module">
    import { writable } from "svelte/store";

    let sharedState = writable({
        id: null,
        state: {},
    });
</script>

<script>
    import { readable } from "svelte/store";
    import { onMount, setContext } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { DispatchListerEvent, ListerEvent } from "~/stores/message.js";
    import { SiteContentBind } from "~/stores/elements.js";
    import { Saved } from "~/stores/settings.js";
    import ListerDebug from "~/components/lister/lister_debug.svelte";
    import TableView from "~/components/lister/lister_tableView.svelte";
    import ListerActions from "~/components/lister/lister_actions.svelte";

    import { TableDefault } from "~/components/lister/columns.js";
    import ListerOptions from "~/components/lister/lister_options.svelte";
    import MassRater from "~/components/massRater.svelte";

    export let id; // How to identify this table across instances and localstorage
    export let columns = [];
    export let options = {};

    export let data;
    export let type;
    export let actionData; // additional data object for Actions
    export let virtualList = false;

    const contextKey = uuidv4(); // unique key for each instance of lister

    // underscore prefixed items are accessor aliases of exported params
    let _type = writable(type);
    let _actionData = writable(actionData);
    let _virtualList = writable(virtualList);

    const tableID = `Lister${id}`;
    let _columns = readable(columns);
    let _options = readable(options);
    let loadedOptions = writable({}); // load saved settings from localstorage
    let state = writable({}); // merge table defaults, localstorage, passed component props

    $: $state, $Saved.setItem(tableID, $state); // write to localstorage whenever state changes
    $: $state, ($sharedState = { id: tableID, state: $state }); // when local state changes, update the shared state
    $: $sharedState.state, updateThisFromShared(); // sync shared state back to local if it matches the ID

    let listerObject = writable(null); // the lister itself
    let listerScroller = writable(null); // the lister-flex object
    let listerHeader = writable(null); // the separate header for the lister table
    let listerContainer = writable(null); // containing element of the lister object
    let dataDisplay = writable([]); // editable/sortable/etc. copy of the data
    let dataFinal = writable([]); // final data to render, either full set or virtual subset
    let availableColumns = writable([]); // available columns
    let visibleColumns = writable([]); // columns to show
    let selectedCount = writable(0);
    let pseudoHeight = writable(null);
    let rowHeight = writable(60);
    let offsetY = writable(0);
    let listerHeight = writable(null);
    let actionsBind;

    setContext(contextKey, {
        _type,
        _actionData,
        _virtualList,
        listerObject,
        listerScroller,
        listerHeader,
        listerContainer,
        dataDisplay,
        dataFinal,
        availableColumns,
        visibleColumns,
        selectedCount,
        pseudoHeight,
        rowHeight,
        offsetY,
        listerHeight,

        loadedOptions,
        state,
        _columns,
        _options,
    });

    $: data = data; //immutable
    $: $dataDisplay = Array.isArray(data) ? data.slice() : [];
    $: $dataFinal = virtualList ? $dataFinal : $dataDisplay;
    $: $listerHeight = virtualList
        ? $SiteContentBind.clientHeight - 10 + "px"
        : "auto";
    $: $pseudoHeight = virtualList
        ? $dataDisplay.filter((e) => !e.isDeleted).length * $rowHeight + "px"
        : "auto";
    $: $offsetY = virtualList ? parseInt($offsetY) + "px" : "0px";
    $: $visibleColumns = $availableColumns;
    $: $rowHeight = $state.rowSizing === "slim" ? "36" : "60";

    // overwrite any actionData.songs with our dataDisplay as it may have updated
    $: {
        if ($_actionData.data?.songs) {
            $_actionData.data.songs = $dataDisplay;
        }
    }

    $: {
        if ($listerContainer && $_virtualList) {
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
                data = [$ListerEvent.data, ...data];
                break;
            case "editedPlaylist":
                let oldPlaylist = data.find(
                    (obj) => obj.id === $ListerEvent.data.id,
                );
                Object.assign(oldPlaylist, $ListerEvent.data);
                data = data;
                break;
            case "deletedPlaylist":
                data = data.filter((obj) => obj.id !== $ListerEvent.data.id);
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

    function updateThisFromShared() {
        if ($sharedState.id === tableID) {
            $state = $sharedState.state;
            $state = $state;
        }
    }

    onMount(async () => {
        $loadedOptions = (await $Saved.getItem(tableID)) || {};
        $state = Object.assign({}, TableDefault, $loadedOptions, options);
    });
</script>

<ListerDebug {contextKey} />

<div
    bind:this={actionsBind}
    class="lister-actions"
    class:not-empty={actionsBind?.firstElementChild}
>
    <ListerActions {contextKey} />
    <ListerOptions {contextKey} />
    <MassRater {contextKey} />
</div>

<div class="lister-wrapper">
    <div
        bind:this={$listerContainer}
        class="lister-container is-table"
        class:is-virtual={$_virtualList}
        style:--rowHeight={$rowHeight + "px"}
    >
        <TableView {contextKey} />
    </div>
</div>

<style>
    .lister-wrapper {
        container-name: lister-wrapper;
        container-type: inline-size;
        position: relative; /* for table options which are absolute pos */
    }

    .lister-container {
        width: auto;
        max-width: 100%;
        /*contain: content;*/ /* disabling to let sl-dropdown not be cut off */
        overflow-y: auto;
    }

    .lister-container.is-virtual :global(.header-flex) {
        inset-block-start: 0;
    }

    /* need the scrollbar space but don't want it visible */
    .lister-container.is-table :global(.header-flex) {
        scrollbar-color: transparent transparent;
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

    .lister-container.is-table :global(.name:before),
    .lister-container.is-table :global(.actions:before) {
        content: "";
        background-color: var(--color-surface-container-low);
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

    .lister-actions {
        display: flex;
        gap: var(--spacing-md);
    }

    .lister-actions.not-empty {
        margin-block-end: var(--spacing-lg);
    }
</style>
