<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { TabulatorFull as Tabulator } from "tabulator-tables";
    import { onDestroy, onMount, tick } from "svelte";
    import { throttle } from "lodash-es";
    import { v4 as uuidv4 } from "uuid";
    import { ColumnDefaults } from "~/components/lister/columns.js";
    import { tabulatorStrings } from "~/logic/i18n.js";
    import { SiteContentBind } from "~/stores/elements.js";
    import {
        setTableSelection,
        clearTableSelection,
        clearSelectionTrigger,
    } from "~/stores/selectedTabulatorRows.js";

    let {
        data = $bindable(),
        columns,
        options = {},
        type,
        tabulator = $bindable(),
        tableElement = $bindable(),
    } = $props();

    let tableId;

    function centreOnTable() {
        tableElement?.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
        });
    }

    // when triggered, select rows
    $effect(() => {
        if ($clearSelectionTrigger) {
            tabulator?.deselectRow();
        }
    });

    onMount(async () => {
        tableId = options?.id ?? `tabulator-${uuidv4()}`;
        await tick();
        tabulator = new Tabulator(tableElement, {
            columnDefaults: ColumnDefaults,
            data: data, //link data to table
            reactiveData: true, //enable data reactivity
            layout: "fitColumns",
            columns: columns, //define table columns
            movableColumns: true,
            headerSortElement: function (column, dir) {
                let icon = "";

                switch (dir) {
                    case "asc":
                        icon = `<span class="material-symbols-outlined">arrow_upward</span>`;
                        break;
                    case "desc":
                        icon = `<span class="material-symbols-outlined">arrow_downward</span>`;
                        break;
                    default:
                        icon = `<span class="material-symbols-outlined">swap_vert</span>`;
                        break;
                }

                return icon;
            },
            //minHeight: 250,
            maxHeight:
                $SiteContentBind?.clientHeight > 0
                    ? $SiteContentBind.clientHeight
                    : "800",
            locale: true,
            langs: tabulatorStrings,
            persistence: {
                columns: ["order"],
                page: {
                    size: true,
                },
            },
            placeholder: `<span style="color: var(--color-on-surface-variant);">${$_("text.noItemsFound")}</span>`,
            ...options,
        });

        // centre table in viewport on scroll
        tabulator.on("scrollVertical", throttle(centreOnTable, 1 * 1000));

        // resize rows when art column is resized
        tabulator.on("columnResized", (column) => {
            if (column.getField() !== "art") return;

            tabulator.getRows().forEach((row) => {
                row.normalizeHeight();
            });
        });

        tabulator.on("rowSelectionChanged", (data) => {
            // before adding selected row, pass the object type so Context Actions know how to treat it
            data = data.map((item) => ({
                ...item,
                _tabulatorType: type,
            }));
            setTableSelection(tableId, data);
        });

        tabulator.on("rowDeleted", (row) => {
            // simple deselect everything in the table
            tabulator?.deselectRow();
        });
    });

    onDestroy(() => {
        tabulator?.off("scrollVertical");
        tabulator?.off("columnResized");
        tabulator?.off("rowSelectionChanged");
        tabulator?.off("rowDeleted");
        if (tableId != null) {
            clearTableSelection(tableId);
        }
        tabulator = null;
    });
</script>

<div bind:this={tableElement} data-id={options.id || null}></div>

<style>
    :global(.lister-tabulator) {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    :global(.lister-tabulator__actions) {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
    }

    :global(.tabulator-placeholder) {
        width: 100% !important;
    }
</style>
