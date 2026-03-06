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
    let tableReady = $state(false);
    let groupHeaderClickHandler = null;
    let placeholderElement = null;
    let placeholderVisible = $state(true);
    let hidePlaceholderTimeout = null;
    let bufferHeight = 0;

    function hidePlaceholder() {
        placeholderVisible = false;
        if (hidePlaceholderTimeout != null) {
            clearTimeout(hidePlaceholderTimeout);
            hidePlaceholderTimeout = null;
        }
    }

    function centreOnTable() {
        tableElement?.scrollIntoView({
            block: "center",
            inline: "nearest",
            behavior: "smooth",
        });
    }

    // when triggered, clear selection (only after table is built)
    $effect(() => {
        if ($clearSelectionTrigger && tabulator && tableReady) {
            tabulator.deselectRow();
        }
    });

    // sync data prop to table when it changes (e.g. after async load or cache hydration)
    // only call setData after tableBuilt - renderer is null until then
    $effect(() => {
        if (tabulator && tableReady) {
            tabulator.setData(data ?? []);
        }
        // Hide placeholder as soon as we have data
        if ((data?.length ?? 0) > 0) {
            hidePlaceholder();
        }
    });

    // sync groupBy option when it changes (e.g. user toggles grouping on/off)
    $effect(() => {
        if (tabulator && tableReady) {
            const groupBy = options?.groupBy;
            tabulator.setGroupBy(groupBy || false);
        }
    });

    onMount(async () => {
        tableId = options?.id ?? `tabulator-${uuidv4()}`;
        await tick();
        tabulator = new Tabulator(tableElement, {
            columnDefaults: ColumnDefaults,
            data: data, //link data to table
            reactiveData: true, //enable data reactivity
            layout: "fitDataStretch",
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
            groupToggleElement: false,
            groupHeader: function (value, count, data, group) {
                return value;
            },
            minHeight: 70,
            maxHeight: $SiteContentBind?.clientHeight - bufferHeight ?? 800, //
            locale: true,
            langs: tabulatorStrings,
            persistence: {
                columns: ["order"],
            },
            // placeholder: `<span style="color: var(--color-on-surface-variant);">${$_("text.loading")}</span>`,
            placeholder: placeholderElement,
            ...options,
        });

        tabulator.on("tableBuilt", () => {
            tableReady = true;
            // Hide placeholder after 2s if still visible (e.g. no data yet)
            hidePlaceholderTimeout = setTimeout(hidePlaceholder, 2000);
        });

        // When groupBy is active, clicking a group header selects/unselects all rows in that group
        function getGroupRows(group) {
            const rows = group.getRows();
            const subGroups = group.getSubGroups();
            if (subGroups.length === 0) return rows;
            let all = [...rows];
            for (const sg of subGroups) {
                all = all.concat(getGroupRows(sg));
            }
            return all;
        }

        function findGroupForClick(groups, target) {
            let found = null;
            for (const g of groups) {
                const el = g.getElement();
                if (!el || (!el.contains(target) && el !== target)) continue;
                found = g;
                const sub = g.getSubGroups();
                if (sub.length) {
                    const deeper = findGroupForClick(sub, target);
                    if (deeper) found = deeper;
                }
            }
            return found;
        }

        groupHeaderClickHandler = (e) => {
            const groups = tabulator?.getGroups?.();
            if (!groups?.length) return;
            const group = findGroupForClick(groups, e.target);
            if (!group) return;
            e.preventDefault();
            e.stopPropagation();
            const rows = getGroupRows(group);
            if (rows.length === 0) return;
            const allSelected = rows.every((r) => r.isSelected?.() === true);
            if (allSelected) {
                rows.forEach((r) => r.deselect?.());
            } else {
                rows.forEach((r) => r.select?.());
            }
        };

        tableElement?.addEventListener("click", groupHeaderClickHandler);

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
        hidePlaceholder(); // clear timeout and hide
        if (tableElement && groupHeaderClickHandler) {
            tableElement.removeEventListener("click", groupHeaderClickHandler);
        }
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

<div class="lister-tabulator">
    <div bind:this={tableElement} data-id={options?.id || null}></div>
    <div
        bind:this={placeholderElement}
        class="tabulator-placeholder"
        class:hidden={!placeholderVisible}
    >
        {$_("text.loading")}
    </div>
</div>

<style>
    .lister-tabulator {
        /*display: block;*/
        /*flex-direction: column;*/
        /*gap: var(--spacing-lg);*/
    }

    .tabulator-placeholder {
        width: 100% !important;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        color: var(--color-on-surface-variant);
        pointer-events: none;
        transition: opacity 0.2s ease-in-out;
    }

    .hidden {
        opacity: 0;
    }
</style>
