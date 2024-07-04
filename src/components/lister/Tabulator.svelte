<script>
    import "tabulator-tables/dist/css/tabulator.min.css";
    import { TabulatorFull as Tabulator } from "tabulator-tables";
    import { onDestroy, onMount } from "svelte";
    import { throttle } from "lodash-es";
    import { ColumnDefaults } from "~/components/lister/columns.js";
    import { tabulatorStrings } from "~/logic/i18n.js";
    import { SiteContentBind } from "~/stores/elements.js";

    export let data,
        columns,
        options = {},
        tabulator = null;

    let tableElement;

    function centreOnTable() {
        tableElement?.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
        });
    }

    onMount(() => {
        tabulator = new Tabulator(tableElement, {
            columnDefaults: ColumnDefaults,
            data: data, //link data to table
            reactiveData: true, //enable data reactivity
            layout: "fitColumns",
            columns: columns, //define table columns
            movableColumns: true,
            maxHeight:
                $SiteContentBind?.clientHeight > 0
                    ? $SiteContentBind.clientHeight
                    : "800",
            locale: true,
            langs: tabulatorStrings,
            persistence: {
                page: {
                    size: true,
                },
            },
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
    });
</script>

<div bind:this={tableElement}></div>

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
</style>
