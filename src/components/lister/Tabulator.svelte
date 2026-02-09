<script>
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
    let tableReady = $state(false);

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

    // sync data prop to table when it changes (e.g. after async load or cache hydration)
    // only call setData after tableBuilt - renderer is null until then
    $effect(() => {
        if (tabulator && tableReady) {
            tabulator.setData(data ?? []);
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
            maxHeight: $SiteContentBind?.clientHeight ?? 800,
            locale: true,
            langs: tabulatorStrings,
            persistence: {
                columns: ["order"],
                page: {
                    size: true,
                },
            },
            // placeholder: `<span style="color: var(--color-on-surface-variant);">${$_("text.noItemsFound")}</span>`,
            ...options,
        });

        tabulator.on("tableBuilt", () => {
            tableReady = true;
        });

        // centre table in viewport on scroll
        // tabulator.on("scrollVertical", throttle(centreOnTable, 1 * 1000));

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
        // tabulator?.off("scrollVertical");
        tabulator?.off("columnResized");
        tabulator?.off("rowSelectionChanged");
        tabulator?.off("rowDeleted");
        if (tableId != null) {
            clearTableSelection(tableId);
        }
        tabulator = null;
    });
</script>

<div class="lister-tabulator">
    <div bind:this={tableElement} data-id={options?.id || null}></div>
</div>

<style>
    .lister-tabulator {
        /*display: block;*/
        /*flex-direction: column;*/
        /*gap: var(--spacing-lg);*/
    }

    :global(.tabulator-placeholder) {
        width: 100% !important;
    }
</style>
