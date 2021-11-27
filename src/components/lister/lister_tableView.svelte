<script>
    import { onMount, getContext } from 'svelte';

    import Columns from './lister_columns.svelte';
    import TableRow from './lister_tableRow.svelte';

    export let contextKey;

    const { getData, visible, columnWidths, lister, listerHeader, listerContainer } = getContext(contextKey);
    let data = getData();

    onMount(() => {
        // initialise syncscroll
        syncscroll.reset();
    });
</script>

<div class="header-flex syncscroll" name="listerhack">
    <div class="header" style="grid-template-columns: {$columnWidths}">
        <Columns bind:this={$listerHeader} contextKey={contextKey} />
    </div>
</div>

<div class="lister-flex syncscroll" name="listerhack">
    <div class="lister" bind:this={$lister} style="grid-template-columns: {$columnWidths}">
        {#each $visible as row, i (i)}
            <div class="row" class:stripe={row.sortOrder % 2}>
                <TableRow item={row} contextKey={contextKey} />
            </div>
        {/each}
    </div>
</div>

<style>
    .header-flex {
        display: flex;
        flex-shrink: 0;
        flex-grow: 0;
        position: sticky;
        top: calc(-1 * var(--spacing-xxl));
        z-index: 5;
        overflow: hidden auto;
    }

    .lister-flex {
        display: flex;
        flex: 1;
        overflow: auto;
    }

    /* header name */
    .header :global(.name) {
        position: sticky;
        left: 0;
        top: 0;
        z-index: 3;
    }

    /* all th */
    .header > :global(div) {
        text-align: left;
        background-color: var(--color-text-subheading);
        color: var(--color-interface-00);
        backdrop-filter: blur(10px) saturate(180%);
    }

    .stripe > :global(div) {
        background-color: var(--color-tint-50);
    }

    :global(.theme-is-light) .stripe > :global(div) {
        background-color: var(--color-shade-50);
    }

    /* body name */
    .lister :global(.name.name) { /* specificity hack to overcome light theme */
        background-color: var(--color-interface-05);
        position: sticky;
        left: 0;
        z-index: 1;
        box-shadow: var(--shadow-sm);
    }

    .lister :global(.stripe .name) {
        background-color: var(--color-interface-10);
    }

    /* swap for light theme */
    :global(.theme-is-light) .lister :global(.name.name) {
        background-color: var(--color-interface-10);
    }

    :global(.theme-is-light) .lister :global(.stripe .name) {
        background-color: var(--color-interface-05);
    }

    .header :global(> div),
    .row :global(> div) {
        padding: var(--spacing-md) var(--spacing-lg);
    }

    .row {
        display: contents;
    }

    .header,
    .lister {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); /* fallback */
    }

    :global(.lister-container.being-resized) {
        user-select: none;
    }

    .row :global(a),
    .row :global(ul),
    .row :global(span) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .header :global(.cell),
    .row :global(.cell) {
        display: flex;
        align-items: center;
    }
</style>