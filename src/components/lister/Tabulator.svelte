<script>
    import "tabulator-tables/dist/css/tabulator.min.css";
    import { _ } from "svelte-i18n";
    import { TabulatorFull as Tabulator } from "tabulator-tables";
    import { onDestroy, onMount, tick } from "svelte";
    import { throttle } from "lodash-es";
    import { ColumnDefaults } from "~/components/lister/columns.js";
    import { tabulatorStrings } from "~/logic/i18n.js";
    import { SiteContentBind } from "~/stores/elements.js";

    let {
        data = $bindable(),
        columns,
        options = {},
        tabulator = $bindable(),
        tableElement = $bindable(),
    } = $props();

    function centreOnTable() {
        tableElement?.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
        });
    }

    onMount(async () => {
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
            minHeight: 250,
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
    });

    onDestroy(() => {
        tabulator?.off("scrollVertical");
        tabulator?.off("columnResized");
        // tabulator?.setData([]);
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
