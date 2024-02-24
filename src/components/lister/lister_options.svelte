<script>
    import { _ } from "svelte-i18n";
    import { getContext, onMount } from "svelte";
    import { Sortable } from "sortablejs";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    let { state, availableColumns, listerHeader } = getContext(contextKey);

    let sortableInstance, dialog, columnElements;
    let sortableOptions = {
        selectedClass: "selected", // The class applied to the selected items
        fallbackTolerance: 3, // So that we can select items on mobile
        animation: 150,
        handle: ".handle",
    };

    $: $state, sync();

    function handleToggle(e, col) {
        // just in case 'disabled' is removed
        if (!col.canToggle) return;

        col.show = e.target.checked;
        $availableColumns = $availableColumns;

        $state.hiddenColumns = $availableColumns
            .filter((col) => !col.show)
            ?.map((col) => col.id);
        $state = $state;
    }

    function handleSort() {
        $state.columnOrder = sortableInstance.toArray();
        $state = $state;

        orderColumns();
    }

    function handleRowSizing(e) {
        $state.rowSizing = e.target.value;
        $state = $state;
    }

    function handleTableSizing(e) {
        $state.tableSizing = e.target.value;
        $state = $state;
    }

    function handleShowArtToggle(e) {
        $state.showArt = e.target.checked;
        $state = $state;
    }

    function orderColumns() {
        if (!$state.columnOrder) {
            return;
        }

        $availableColumns = $availableColumns.sort((a, b) => {
            const aIndex = $state.columnOrder.indexOf(a.id);
            const bIndex = $state.columnOrder.indexOf(b.id);
            return aIndex - bIndex;
        });
    }

    function sync() {
        orderColumns();

        $availableColumns.map((col) => {
            col.show = !$state.hiddenColumns?.includes(col.id);
        });

        $availableColumns = $availableColumns;
    }

    function showDialog() {
        dialog.show();
        sortableInstance = new Sortable(columnElements, sortableOptions);
    }

    function hideDialog() {
        dialog.hide();
        sortableInstance.destroy();
    }

    function resetColumnWidths() {
        $listerHeader.calculateWidths();
    }

    onMount(() => {
        orderColumns();
    });
</script>

<sl-button variant="neutral" on:click={showDialog}>
    <MaterialSymbol name="settings" />
</sl-button>

<Portal>
    <sl-dialog label="Table options" bind:this={dialog} style="--width: 300px;">
        <div class="container">
            <sl-button on:click={resetColumnWidths}>
                Reset column widths
            </sl-button>

            <sl-switch
                checked={$state.showArt}
                on:sl-change={(e) => {
                    handleShowArtToggle(e);
                }}
            >
                Show art
            </sl-switch>

            <sl-radio-group
                label="Row height"
                name="rowSizing"
                value={$state.rowSizing}
                on:sl-change={(e) => {
                    handleRowSizing(e);
                }}
            >
                <sl-radio-button value="slim">Slim</sl-radio-button>
                <sl-radio-button value="spaced">Spaced</sl-radio-button>
            </sl-radio-group>

            <div
                class="columns"
                bind:this={columnElements}
                on:sort={(e) => {
                    handleSort(e);
                }}
            >
                {#each $availableColumns as col (col.id)}
                    <div class="item" data-id={col.id}>
                        <MaterialSymbol
                            name="drag_indicator"
                            classes="handle"
                        />
                        <sl-checkbox
                            disabled={!col.canToggle}
                            checked={col.show}
                            on:sl-change={(e) => {
                                handleToggle(e, col);
                            }}
                        >
                            {$_(col.label)}
                        </sl-checkbox>
                    </div>
                {/each}
            </div>
        </div>

        <sl-button slot="footer" variant="primary" on:click={hideDialog}>
            Close
        </sl-button>
    </sl-dialog>
</Portal>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .container :global(.handle) {
        cursor: grab;
        height: 100%;
    }

    .columns {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .item {
        gap: var(--spacing-md);
        display: flex;
    }

    sl-checkbox::part(base) {
        position: relative;
        top: -5px;
    }
</style>
