<script>
    import { onMount, getContext, onDestroy, tick } from 'svelte';

    import Columns from './lister_columns.svelte';
    import TableRow from './lister_tableRow.svelte';

    export let contextKey;

    const { getData, dataDisplay, columnWidths, listerObject, listerHeader, listerContainer } = getContext(contextKey);
    let data = getData();
    let bindForName;
    let bindForActions;
    let observerName;
    let observerActions;

    onMount(async () => {
        // initialise syncscroll
        syncscroll.reset();

        const container   = $listerContainer;

        await tick();

        let headerName    = $listerContainer.querySelector('.header .name');
        let headerActions = $listerContainer.querySelector('.header .actions');
        let marginName    = '0px 0px 0px 0px';
        let marginActions = '0px -1px 0px 0px';

        // needs separate IntersectionObservers otherwise only one works at a time

        // apply shadow when .name becomes sticky
        observerName = new IntersectionObserver(
            ([e]) => container.classList.toggle("scroll-start", e.intersectionRatio < 1),
            { root: bindForName, rootMargin: marginName, threshold: 1 }
        );

        // apply shadow when .actions becomes sticky
        observerActions = new IntersectionObserver(
            ([e]) => container.classList.toggle("scroll-end", e.intersectionRatio === 1),
            { root: bindForActions, rootMargin: marginActions, threshold: 1 }
        );

        if (headerName && headerActions) {
            observerName.observe(headerName);
            observerActions.observe(headerActions);
        }
    });

    onDestroy(() => {
        if (observerName) {
            observerName.disconnect();
        }

        if (observerActions) {
            observerActions.disconnect();
        }
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
                {#if !row.isDeleted}
                    <TableRow item={row} contextKey={contextKey} />
                {/if}
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
        top: calc(var(--spacing-xxl) * -1);
        z-index: 5;
        overflow: hidden auto;
    }

    .lister-flex {
        display: flex;
        flex: 1;
        overflow: auto;
    }

    .header :global(.actions) {
        right: 0;
    }

    .header > :global(div) {
        text-align: left;
        background-color: var(--color-interface);
        border-bottom: 3px solid var(--color-border);
        position: relative;
    }

    .row > :global(div) {
        background-color: var(--color-interface);
        border-bottom: 1px solid var(--color-border);
    }

    .stripe > :global(div) {
        /* testing if I miss the stripes */
        /*background-color: var(--color-row-stripe);*/
    }

    /* show full lister if not enough room to have name and action columns always present */
    @container lister-wrapper (min-width: 700px) {
        .header :global(.name),
        .header :global(.actions) {
            position: sticky;
            top: 0;
            z-index: 3;
        }

        .lister :global(.actions),
        .lister :global(.name) {
            position: sticky;
            z-index: 1;
        }

        .header :global(.name),
        .lister :global(.name) {
            left: -1px;
        }
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