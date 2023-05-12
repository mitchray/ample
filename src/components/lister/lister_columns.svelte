<script>
    import { onMount, getContext, tick } from 'svelte';

    import { columns } from './columns.js';
    import ColumnSelector from './lister_columnSelector.svelte';

    import { getProp } from '../../logic/helper';

    export let contextKey;

    let newColumns = JSON.parse(JSON.stringify(columns)); // MAKE AN INDIVIDUAL COPY OF IMPORTED OBJECT

    let { listerColumnsID, currentSort, getInitialReverse, dataDisplay, getType, showIndex, showCheckboxes, showArtist, columnWidths, listerObject, listerContainer, availableColumns, visibleColumns, listerHeader, selectedCount } = getContext(contextKey);
    const min = 100;
    let thisType = getType();
    let headerBeingResized;
    let columnWidthArray;
    let updateIndex;
    let horizontalScrollOffset = 0;

    onMount(() => {
        setAvailableColumns();

        loadSavedColumns();

        calculateWidths();

        applySort($currentSort, getInitialReverse());

        // set initial sort orders
        updateSortIndexes(true);
    });

    export function setStaticWidths() {
        if (!$listerObject) {
            return;
        }
        // convert to static widths if lister has been rendered
        if (window.getComputedStyle($listerObject).gridTemplateColumns.indexOf("repeat") === -1) {
            $columnWidths = window.getComputedStyle($listerObject).gridTemplateColumns;
        }
    }

    function setAvailableColumns() {
        $availableColumns = newColumns.filter((col) => col.object_types.find((type) => type.id === thisType));

        // apply any overrides
        if ($availableColumns) {
            for (let i = 0; i < $availableColumns.length; i++) {
                let item = $availableColumns[i].object_types.find((type) => type.id === thisType);

                // apply any overrides
                $availableColumns[i].widthPreset = (item.widthPreset) ? item.widthPreset : $availableColumns[i].widthPreset;

                $availableColumns = $availableColumns;
            }
        }

        // enable index
        if (showIndex) {
            $availableColumns.find(el => el.id === "index").show = true;
        }

        // enable checkboxes
        if (showCheckboxes) {
            $availableColumns.find(el => el.id === "checkbox").show = true;
        }

        // force artist column
        if (showArtist) {
            $availableColumns.find(el => el.id === "artist").show = true;
            $availableColumns.find(el => el.id === "artist").canToggle = false;
        }

        $availableColumns = $availableColumns;
    }

    function loadSavedColumns() {
        let savedColumns = JSON.parse(localStorage.getItem(listerColumnsID));

        if (savedColumns !== null) {
            for (let i = 0; i < $availableColumns.length; i++) {
                // if show hasn't already been set
                if ($availableColumns[i].show === undefined) {
                    // show column if in our savedColumns
                    if (savedColumns.includes($availableColumns[i].id)) {
                        $availableColumns[i].show = true;
                    }
                }
            }
        } else {
            // show every toggleable column by default
            $availableColumns.forEach((item) => {
                if (item.canToggle === true) {
                    item.show = true;
                }
            });
        }

        $availableColumns = $availableColumns;

        $visibleColumns = $availableColumns.filter(el => el.show === true).slice();
    }

    function initResize(e) {
        setStaticWidths();

        headerBeingResized = e.target.parentNode;
        columnWidthArray   = $columnWidths.split(" ");
        updateIndex        = Array.from($listerContainer.querySelectorAll('.header .cell')).findIndex((header) => header === headerBeingResized);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        $listerContainer.classList.add('being-resized');
        headerBeingResized.classList.add('header--being-resized');
    }

    const onMouseMove = (e) => requestAnimationFrame(() => {
        horizontalScrollOffset = $listerObject.scrollLeft;
        const width = (horizontalScrollOffset + e.clientX) - headerBeingResized.getBoundingClientRect().left + 5;

        // update specific column
        columnWidthArray[updateIndex] = Math.max(min, parseInt(width, 10)) + 'px';

        // update all columns
        $columnWidths = columnWidthArray.join(" ");
    });

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        $listerObject.classList.remove('being-resized');
        headerBeingResized.classList.remove('header--being-resized');
    }

    export const calculateWidths = async () => {
        let newWidths = "";

        $visibleColumns.forEach((col) => {
            switch (col.widthPreset) {
                case "large":
                    newWidths += `250px `;
                    break;
                case "medium":
                    newWidths += `180px `;
                    break;
                case "small":
                    newWidths += `120px `;
                    break;
                case "art":
                    newWidths += `60px `;
                    break;
                case "rating":
                    newWidths += `180px `;
                    break;
                case "actions":
                    newWidths += `160px `;
                    break;
                case "fit":
                    newWidths += `minmax(50px, max-content) `;
                    break;
                default:
                    newWidths += `minmax(${min}px, max-content) `;
                    break;
            }
        });

        $columnWidths = newWidths;

        await tick();

        setStaticWidths();
    }

    function updateSortIndexes(initialOrder) {
        for (let i = 0; i < $dataDisplay.length; i++) {
            if (initialOrder) {
                $dataDisplay[i].initialOrder = i;
            }

            $dataDisplay[i].sortOrder = i;
        }

        $dataDisplay = $dataDisplay;
    }

    async function applySort(sortBy, startReverse = null) {
        let sortTypeIndex = $visibleColumns.findIndex(el => el.sortBy === sortBy);

        if (sortTypeIndex === -1) {
            return;
        }

        let col = $visibleColumns[sortTypeIndex];

        // get current reverse status
        let isReversed = col.reverse;

        // initiate as false or invert current, note loose comparison to cover null and undefined
        isReversed = isReversed == null ? false : !isReversed;

        // sort the dataDisplay
        $dataDisplay = $dataDisplay.sort(function(obj1, obj2) {
            // handle null
            if (!getProp(obj1, sortBy)) return -1;
            if (!getProp(obj2, sortBy)) return +1;

            if (col.type === "number" || col.type === "rating") {
                return obj1[sortBy] > obj2[sortBy];
            }

            if (col.type === "time") {
                return obj1[sortBy].toString().localeCompare(obj2[sortBy].toString(), undefined, {numeric: true});
            }

            return getProp(obj1, sortBy).localeCompare(getProp(obj2, sortBy));
        });

        if (startReverse || isReversed) {
            $dataDisplay.reverse();
        }

        // reset all items
        $visibleColumns.forEach(el => el.reverse = null);

        updateSortIndexes();

        await tick();

        // set current reverse status on clicked item
        col.reverse = startReverse || isReversed;

        // update store
        $visibleColumns = $visibleColumns;
    }

    function toggleAllChecked(e) {
        $dataDisplay.forEach(element => element.selected = !!(e.target.checked));

        // reset counts
        $selectedCount = e.target.checked ? $dataDisplay.length : 0;

        $dataDisplay = $dataDisplay;
    }
</script>

{#each $visibleColumns as col (col)}
    <div class="cell {col.id}" data-sortable="{col.sortable}" data-type={col.type} >
        {#if col.id === "checkbox"}
            <input type="checkbox" on:change={toggleAllChecked} />
        {:else if col.id === "actions"}
            <ColumnSelector contextKey={contextKey} />
        {:else}
            <span
                class="label"
                on:click={(e) => {
                    if (col.sortBy) {
                        applySort(col.sortBy);
                    }
                }}
                data-reverse={col.reverse}
            >
                {col.label}
            </span>
        {/if}

        {#if !col.fixedSize}
            <span class="resize-handle" on:mousedown={(e) => { initResize(e) }} on:dblclick={() => { $listerHeader.calculateWidths() }}></span>
        {/if}
    </div>
{/each}

<style>
    .cell {
        font-weight: 700;
    }

    .resize-handle {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        background: var(--color-text-primary);
        opacity: 0;
        width: 5px;
        cursor: col-resize;
        z-index: 10;
    }

    @media (hover: hover) {
        .cell:hover .resize-handle,
        .resize-handle:hover {
            opacity: 0.3;
        }
    }

    :global(.header--being-resized) .resize-handle {
        opacity: 0.3;
    }
    
    .label {
        position: relative;
        user-select: none;
        padding-right: 5px;
    }

    :global(.lister-container input[type="checkbox"]) {
        flex-shrink: 0;
        max-width: unset;
    }

    [data-sortable] .label {
        cursor: pointer;
    }
    
    [data-sortable] .label:before,
    [data-sortable] .label:after {
        content: '';
        background-color: currentColor;
        mask-image: url('/src/images/arrow_left.svg');
        mask-size: cover;
        mask-position: center;
        width: 25px;
        position: absolute;
        left: calc(100% - 5px);
        opacity: 0.3;
        bottom: 0;
        top: 0;
    }

    [data-sortable] .label:before {
        transform: translateY(-4px) rotate(90deg);
    }

    [data-sortable] .label:after {
        transform: translateY(4px) rotate(90deg) scaleX(-1);
    }

    :global([data-reverse=false]).label:before,
    :global([data-reverse=true]).label:after {
        opacity: 1;
    }
</style>