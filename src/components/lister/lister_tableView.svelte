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

    .header :global(.name),
    .header :global(.actions) {
        position: sticky;
        top: 0;
        z-index: 3;
    }

    .header :global(.name) {
        left: 0;
    }

    .header :global(.actions) {
        right: 0;
    }

    .header > :global(div) {
        text-align: left;
        background-color: var(--color-background);
        border-bottom: 2px solid var(--color-border);
        position: relative;
    }

    .row > :global(div) {
        background-color: var(--color-card-primary);
    }

    .stripe > :global(div) {
        background-color: var(--color-row-stripe);
    }

    .lister {
        /*background-color: var(--color-card-primary);*/
    }

    .lister :global(.actions.actions),
    .lister :global(.name.name) { /* specificity hack to overcome light theme */
        position: sticky;
        z-index: 1;
        box-shadow: var(--shadow-md);
    }

    .lister :global(.name.name) {
        left: 0;
    }

    .lister :global(.actions.actions) {
        right: 0;
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