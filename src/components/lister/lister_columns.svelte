<script>
    import { _ } from "svelte-i18n";
    import { getContext, onMount, tick } from "svelte";
    import { sortBy } from "lodash-es";
    import { Column } from "~/components/lister/columns.js";
    import CheckboxHeader from "~/components/lister/components/checkbox_header.svelte";

    export let contextKey;

    const directionOptions = ["none", "asc", "desc"];

    let {
        _columns,
        loadedOptions,
        state,
        dataDisplay,
        listerObject,
        listerContainer,
        availableColumns,
        visibleColumns,
        listerHeader,
    } = getContext(contextKey);
    const min = 100;
    let headerBeingResized;
    let updateIndex;
    let horizontalScrollOffset = 0;
    let currentSortIndex =
        directionOptions.indexOf($loadedOptions.sortDirection) || 0; // init to the saved value, or reset

    onMount(() => {
        setAvailableColumns();

        loadSavedColumns();

        calculateWidths();

        // set initial sort orders
        initSortOrders();
    });

    function setAvailableColumns() {
        $availableColumns = $_columns.map((col) => {
            // init the passed columns array with default values
            let newCol = new Column(col);
            newCol.setCell(col.cell);

            // load visibility from storage
            newCol.show = !$loadedOptions.hiddenColumns?.includes(col.id);

            // load order from storage
            let foundOrder = $loadedOptions.columnOrder?.indexOf(col.id);
            newCol.displayOrder =
                foundOrder !== undefined && foundOrder !== -1
                    ? foundOrder
                    : newCol.displayOrder;

            return newCol;
        });
    }

    function loadSavedColumns() {
        $visibleColumns = $availableColumns
            .filter((el) => el.show === true)
            .slice();
    }

    function initResize(e) {
        headerBeingResized = e.target.parentNode;
        updateIndex = Array.from(
            $listerContainer.querySelectorAll(".header .cell"),
        ).findIndex((header) => header === headerBeingResized);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        $listerContainer.classList.add("being-resized");
        headerBeingResized.classList.add("header--being-resized");
    }

    function onMouseMove(e) {
        requestAnimationFrame(() => {
            horizontalScrollOffset = $listerObject.scrollLeft;
            const width =
                horizontalScrollOffset +
                e.clientX -
                headerBeingResized.getBoundingClientRect().left +
                5;

            $visibleColumns[updateIndex].width =
                Math.max(min, parseInt(width, 10)) + "px";
        });
    }

    function onMouseUp() {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        $listerObject.classList.remove("being-resized");
        headerBeingResized.classList.remove("header--being-resized");
    }

    export async function calculateWidths() {
        $visibleColumns.forEach((col) => {
            switch (col.widthPreset) {
                case "xl":
                    col.width = "400px";
                    break;
                case "large":
                    col.width = "250px";
                    break;
                case "medium":
                    col.width = "180px";
                    break;
                case "small":
                    col.width = "120px";
                    break;
                case "art":
                    col.width = "60px";
                    break;
                case "rating":
                    col.width = "180px";
                    break;
                case "actions":
                    col.width = "160px";
                    break;
                case "fit":
                    col.width = getMaxWidth(col, 50);
                    break;
                default:
                    col.width = getMaxWidth(col, min);
                    break;
            }
        });

        $visibleColumns = $visibleColumns;

        await tick();
    }

    function getMaxWidth(col, minWidth) {
        if (!$listerContainer) {
            return;
        }

        // create the temporary element
        const temp = document.createElement("div");
        temp.style.width = "auto";
        temp.style.position = "absolute";
        temp.style.whiteSpace = "nowrap";
        temp.innerHTML = col.label;

        $listerContainer.appendChild(temp);

        let result = Math.max(minWidth, parseInt(temp.clientWidth, 10)) + "px";

        // clean up
        $listerContainer.removeChild(temp);

        return result;
    }

    function initSortOrders() {
        for (let i = 0; i < $dataDisplay.length; i++) {
            // initialOrder is the raw 'unsorted' order, and is the order applied when not actually being sorted
            $dataDisplay[i].initialOrder = i;
        }

        $dataDisplay = $dataDisplay;

        applySort();
    }

    function handleHeaderClick(e) {
        let headerElement = e.target.closest(".cell");

        let col = $availableColumns.find(
            (c) => c.id === headerElement.dataset.id,
        );

        if (!$state.canSort || !col?.sortBy) return;

        // cycle through the options if column is the same as previous, otherwise reset to first option
        currentSortIndex =
            col.sortBy === $state.sortBy
                ? (currentSortIndex + 1) % directionOptions.length
                : 1;

        $state.sortDirection = directionOptions[currentSortIndex];

        // update the 'last sortBy'
        $state.sortBy = col.sortBy;

        // update the 'currentlySortingCol'
        $state.currentlySortingCol = currentSortIndex !== 0 ? col.id : null;

        applySort();
    }

    function applySort() {
        // reset to initialOrder if no sortDirection
        $dataDisplay =
            $state.sortDirection === "none"
                ? sortBy($dataDisplay, "initialOrder")
                : sortBy($dataDisplay, [$state.sortBy]);

        if ($state.sortDirection === "desc") {
            $dataDisplay.reverse();
        }
    }
</script>

{#each $visibleColumns as col (col.id)}
    {#if !col.canToggle || col.show}
        <div
            class="cell {col.id}"
            data-can-sort={($state.canSort && col.sortBy) || null}
            data-sort-direction={$state?.sortDirection}
            data-is-sorting={$state.currentlySortingCol === col.id || null}
            data-col-id={col.id}
            style="width: {col.width}"
            class:isNumerical={col.isNumerical}
            data-id={col.id}
        >
            <!-- prettier-ignore -->
            {#if col.id === "checkbox" || col.id === "forcedCheckbox"}
                <CheckboxHeader {contextKey}/><!--
                no whitespace
         -->{:else}
                <span
                    class="label truncate"
                    on:click={handleHeaderClick}
                    title={$_(col.label)}

                >
                    {$_(col.label)}
                </span>
            {/if}

            {#if !col.fixedSize}
                <span
                    class="resize-handle"
                    on:mousedown={(e) => {
                        initResize(e);
                    }}
                    on:dblclick={() => {
                        $listerHeader.calculateWidths();
                    }}
                ></span>
            {/if}
        </div>
    {/if}
{/each}

<style>
    .cell {
        font-weight: 700;
    }

    .resize-handle {
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        background-color: var(--color-outline);
        opacity: 0;
        width: 5px;
        cursor: col-resize;
        z-index: 10;
    }

    @media (hover: hover) {
        .cell:hover .resize-handle,
        .resize-handle:hover {
            opacity: 1;
        }
    }

    :global(.header--being-resized) .resize-handle {
        opacity: 0.3;
    }

    .label {
        position: relative;
        user-select: none;
        overflow: visible;
        padding-inline-end: var(--spacing-md);
    }

    [data-can-sort] .label {
        cursor: pointer;
    }

    [data-can-sort] .label:before,
    [data-can-sort] .label:after {
        content: "";
        background-color: currentColor;
        mask-image: url("/src/assets/arrow_left.svg");
        mask-size: cover;
        mask-position: center;
        width: 25px;
        position: absolute;
        inset-inline-start: calc(100% - 5px);
        opacity: 0.3;
        inset-block-start: 0;
        inset-block-end: 0;
    }

    [data-can-sort] .label:before {
        transform: translateY(-4px) rotate(90deg);
    }

    [data-can-sort] .label:after {
        transform: translateY(4px) rotate(90deg) scaleX(-1);
    }

    :global([data-is-sorting][data-sort-direction="asc"]) .label:before,
    :global([data-is-sorting][data-sort-direction="desc"]) .label:after {
        opacity: 1;
    }
</style>
