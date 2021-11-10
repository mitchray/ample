<script>
    import { onMount, getContext, tick } from 'svelte';

    import { columns } from './columns.js';

    import { getProp } from '../../logic/helper';

    export let contextKey;

    let newColumns = JSON.parse(JSON.stringify(columns)); // MAKE AN INDIVIDUAL COPY OF IMPORTED OBJECT

    let { currentSort, getInitialReverse, dataDisplay, getType, showIndex, showCheckboxes, columnWidths, lister, listerContainer, visibleColumns } = getContext(contextKey);
    const min = 100;
    let thisType = getType();
    let headerBeingResized;
    let columnWidthArray;
    let updateIndex;
    let horizontalScrollOffset = 0;
    let columnsForType = newColumns[thisType];

    $: {
        // enable any special columns
        if (showIndex) {
            columnsForType.find(el => el.id === "index").show = true;
        }

        // enable any special columns
        if (showCheckboxes) {
            columnsForType.find(el => el.id === "checkbox").show = true;
        }

        // filter by columns we should be showing
        $visibleColumns = columnsForType.filter(el => el.show === true); // one day this will tie in to a selection modal
    }

    onMount(() => {
        calculateWidths();

        applySort($currentSort, getInitialReverse());

        // set initial sort orders
        updateSortIndexes(true);
    });

    export function setStaticWidths() {
        // convert to static widths if lister has been rendered
        if (window.getComputedStyle($lister).gridTemplateColumns.indexOf("repeat") === -1) {
            $columnWidths = window.getComputedStyle($lister).gridTemplateColumns;
        }
    }

    function initResize(e) {
        setStaticWidths();

        headerBeingResized = e.target.parentNode;
        columnWidthArray = $columnWidths.split(" ");
        updateIndex = Array.from($listerContainer.querySelectorAll('.header .item')).findIndex((header) => header === headerBeingResized);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        $listerContainer.classList.add('being-resized');
        headerBeingResized.classList.add('header--being-resized');
    }

    const onMouseMove = (e) => requestAnimationFrame(() => {
        horizontalScrollOffset = $lister.scrollLeft;
        const width = (horizontalScrollOffset + e.clientX) - headerBeingResized.getBoundingClientRect().left + 5;

        // update specific column
        columnWidthArray[updateIndex] = Math.max(min, parseInt(width, 10)) + 'px';

        // update all columns
        $columnWidths = columnWidthArray.join(" ");
    });

    const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        $lister.classList.remove('being-resized');
        headerBeingResized.classList.remove('header--being-resized');
    }

    export const calculateWidths = async () => {
        let newWidths = "";

        $visibleColumns.forEach((col) => {
            switch (col.widthPreset) {
                case "large":
                    newWidths += `minmax(${min}px, 2.33fr) `;
                    break;
                case "medium":
                    newWidths += `minmax(${min}px, 1.66fr) `;
                    break;
                case "small":
                    newWidths += `minmax(${min}px, 1fr) `;
                    break;
                case "rating":
                    newWidths += `180px `;
                    break;
                case "actions":
                    newWidths += `160px `;
                    break;
                case "fit":
                    newWidths += `minmax(40px, max-content) `;
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
            if (col.type === "number") {
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
        $dataDisplay = $dataDisplay;
    }
</script>

{#each $visibleColumns as col (col)}
    <div class="item" data-sortable="{col.sortable}" >
        {#if col.id === "checkbox"}
            <input type="checkbox" on:change={toggleAllChecked} />
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
            <span class="resize-handle" on:mousedown={(e) => { initResize(e) }}></span>
        {/if}
    </div>
{/each}

<style>
    .item {
        background-color: var(--color-text-subheading);
        color: var(--color-interface-00);
        position: relative;
        font-weight: 700;
    }

    .resize-handle {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        background: black;
        opacity: 0;
        width: 5px;
        cursor: col-resize;
        z-index: 10;
    }

    .item:hover .resize-handle,
    .resize-handle:hover,
    :global(.header--being-resized) .resize-handle {
        opacity: 0.3;
    }
    
    .label {
        position: relative;
        user-select: none;
        padding-right: 5px;
    }

    [data-sortable] .label {
        cursor: pointer;
    }
    
    [data-sortable] .label:before,
    [data-sortable] .label:after {
        content: '';
        background-color: currentColor;
        mask-image: url('/ample/public/images/arrow_left.svg');
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

    /* needs to stand out as lister header is inverted */
    input[type="checkbox"] {
        border-color: var(--color-interface-00);
    }
</style>