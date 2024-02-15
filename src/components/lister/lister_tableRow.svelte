<script>
    import { getContext } from "svelte";
    import DOMPurify from "dompurify";

    export let contextKey;
    export let item;

    const { visibleColumns, selectedCount } = getContext(contextKey);

    function handleChecked(e) {
        if (e.detail.checked) {
            $selectedCount++;
        } else {
            $selectedCount--;
        }
    }

    // make the contextKey available to the item
    item.contextKey = contextKey;
</script>

{#each $visibleColumns as col}
    {#if !col.canToggle || col.show}
        {@const cell = col.getCell(item)}
        <div
            class="cell {col.id}"
            style="width: {col.width}"
            data-id={col.id}
            class:isNumerical={col.isNumerical}
        >
            <span class="truncate">
                {#if cell?.component}
                    <svelte:component
                        this={cell.component}
                        on:rowToggled={handleChecked}
                        {...cell.props}
                    />
                {:else}
                    {@html DOMPurify.sanitize(cell)}
                {/if}
            </span>
        </div>
    {/if}
{/each}

<style>
    .image {
        margin-inline-end: var(--spacing-md);
        margin-inline-start: calc(var(--spacing-md) * -1);
        border-radius: 3px;
        height: 43px;
        width: 43px;
        flex-shrink: 0;
    }

    .cell {
        height: var(--rowHeight);
    }

    .cell :global(ul) {
        margin: 0;
    }

    .cell :global(.c-actions) {
        line-height: 1;
    }

    .cell :global(.genres) {
        flex-wrap: nowrap;
    }

    :global(.lister-container .isNumerical) {
        justify-content: end;
    }
</style>
