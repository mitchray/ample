<script>
    import { onMount, getContext } from 'svelte';

    import Columns from './lister_columns.svelte';
    import TableRow from './lister_tableRow.svelte';

    export let contextKey;

    const { getData, dataDisplay, columnWidths, listerObject, listerHeader, listerContainer } = getContext(contextKey);
    let data = getData();
    let bindForName;
    let bindForActions;

    onMount(() => {
        // initialise syncscroll
        syncscroll.reset();

        const container = $listerContainer;

        // needs separate IntersectionObservers otherwise only one works at a time

        // apply shadow when .name becomes sticky
        let observerName = new IntersectionObserver(
            ([e]) => {
                const scrimClass = 'scroll-start';
                e.intersectionRatio !== 1 ? container.classList.add(scrimClass) : container.classList.remove(scrimClass);
            },
            { root: bindForName, rootMargin: '0px 0px 0px -1px', threshold: 1 }
        );

        // apply shadow when .actions becomes sticky
        let observerActions = new IntersectionObserver(
            ([e]) => {
                const scrimClass = 'scroll-end';
                e.intersectionRatio === 1 ? container.classList.add(scrimClass) : container.classList.remove(scrimClass);
            },
            { root: bindForActions, rootMargin: '0px -1px 0px 0px', threshold: 1 }
        );

        observerName.observe($listerContainer.querySelector('.header .name'));
        observerActions.observe($listerContainer.querySelector('.header .actions'));
    });
</script>

<div class="header-flex syncscroll" name="listerhack-{contextKey}" bind:this={bindForName} >
    <div class="header" style="grid-template-columns: {$columnWidths}" bind:this={bindForActions} >
        <Columns bind:this={$listerHeader} contextKey={contextKey} />
    </div>
</div>

<div class="lister-flex syncscroll" name="listerhack-{contextKey}">
    <div class="lister" bind:this={$listerObject} style="grid-template-columns: {$columnWidths}">
        {#each $dataDisplay as row, i (i)}
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

    .lister :global(.actions),
    .lister :global(.name) {
        position: sticky;
        z-index: 1;
    }

    .lister :global(.name) {
        left: 0;
    }

    .lister :global(.actions) {
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

    /* stand out more in lister */
    :global(.lister-container input[type="checkbox"]) {
        border-color: var(--color-text-secondary);
    }

    .header :global(.cell),
    .row :global(.cell) {
        display: flex;
        align-items: center;
    }
</style>