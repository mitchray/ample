<script>
    import { onMount, getContext } from 'svelte';

    import Columns from './lister_columns.svelte';
    import TableRow from './lister_tableRow.svelte';

    export let contextKey;

    const { getData, visible, columnWidths, lister, listerHeader, listerContainer, rowHeight, itemsPerRow } = getContext(contextKey);
    let data = getData();

    $rowHeight = 47;
    $itemsPerRow = 1;

    onMount(() => {
        $listerContainer.style.setProperty('--lister-row-height', $rowHeight + "px");
    });
</script>

<div class="header" style="grid-template-columns: {$columnWidths}">
    <Columns bind:this={$listerHeader} contextKey={contextKey} />
</div>

<div class="lister" style="grid-template-columns: {$columnWidths}" bind:this={$lister}>
    {#each $visible as row, i (i)}
        <div class="row" class:stripe={row.sortOrder % 2}>
            <TableRow item={row} contextKey={contextKey} />
        </div>
    {/each}
</div>

<style>
    .lister {
        --lister-padding: var(--spacing-lg);
        display: grid;
        max-width: 100%;
        width: fit-content;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* fallback */
    }

    :global(.lister-container.being-resized) {
        user-select: none;
    }

    .row {
        display: contents;
    }

    .row :global(> div) {
        overflow: hidden;
    }

    .row :global(a),
    .row :global(ul),
    .row :global(span) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .header {
        display: grid;
        position: sticky;
        top: 0;
        backdrop-filter: blur(5px);
        z-index: 10;
    }

    .header :global(> div),
    .row :global(> div) {
        height: var(--lister-row-height);
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
    }

    .row :global(> div) {
        transform: translateY(var(--c-lister-offset));
    }

    .lister :global(.stripe > div) {
        background-color: var(--color-tint-50);
    }

    :global(.theme-is-light) .lister :global(.stripe > div) {
        background-color: var(--color-shade-50);
    }

    .row :global(.c-actions) {
        opacity: 0;
    }

    .row:hover :global(.c-actions) {
        opacity: 1;
    }
</style>