<!-- TODO remove old component -->
<!-- Adapted from https://github.com/cornflourblue/jw-react-pagination/blob/master/src/JwPagination.jsx -->
<script>
    import { onMount, afterUpdate } from 'svelte';
    import paginate from 'jw-paginate';

    let params = (new URL(document.location)).searchParams;
    let historyPage = params.get('page');

    export let dataPromise,
        pageOfItems = [];

    let items = [],
        initialPage = (historyPage) ? parseInt(historyPage) : 1,
        pageSize = 20,
        maxPages = 21,
        pager = {};

    onMount (async () =>  {
        await dataPromise
            .then(data => {
                items = data;
                setPage(initialPage);
            })
    });

    afterUpdate ( async () => {
        if (pager.currentPage !== undefined) {
            let url = new URL(window.location);
            url.searchParams.set('page', pager.currentPage);
            window.history.replaceState({}, '', url);
        }
    });

    function setPage(page) {
        pager = paginate(items.length || 1, page, pageSize, maxPages);
        pageOfItems = items.slice(pager.startIndex, pager.endIndex + 1);
    }

    function handlePageButtonClick(pageNumber) {
        setPage(pageNumber);
    }
</script>


<div class="pagination-wrapper">
    <div class="pagination-anchor"></div>
    <div class="pagination-container">
        <ul class="pagination">
            <li>
                <button
                    disabled={pager.currentPage === 1}
                    on:click={handlePageButtonClick(pager.totalPages - pager.totalPages)}
                    class="first button"
                >
                    First
                </button>
            </li>
            <li>
                <button
                    disabled={pager.currentPage === 1}
                    on:click={handlePageButtonClick(pager.currentPage - 1)}
                    class="previous button"
                >
                    Previous
                </button>
            </li>
            <li>
                <ul class="pagination-numbers">
                    {#if pager.pages}
                        {#each pager.pages as page}
                            <li>
                                <button
                                    class="number button {pager.currentPage === page ? 'pagination--active' : ''}"
                                    on:click={handlePageButtonClick(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        {/each}
                    {:else}
                        <li>
                            <button
                                disabled
                                class="number button pagination--active"
                            >
                                1
                            </button>
                        </li>
                    {/if}
                </ul>
            </li>
            <li>
                <button
                    disabled={pager.currentPage === pager.totalPages}
                    on:click={handlePageButtonClick(pager.currentPage + 1)}
                    class="next button"
                >
                    Next
                </button>
            </li>
            <li>
                <button
                    disabled={pager.currentPage === pager.totalPages}
                    on:click={handlePageButtonClick(pager.totalPages)}
                    class="last button"
                >
                    Last ({pager.totalPages || 1})
                </button>
            </li>
        </ul>
    </div>
    <div class="pagination-wrapper__inner">
        <slot></slot>
    </div>
</div>

<style>
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        gap: var(--spacing-sm);
    }

    .pagination-wrapper {
        border: 2px solid var(--color-tint-50);
        margin-top: var(--spacing-lg);
        border-radius: 10px;
        overflow: hidden;
    }

    .pagination-wrapper__inner {
        padding: var(--spacing-lg);
    }

    .pagination-container {
        background-color: var(--color-tint-50);
        display: flex;
        justify-content: center;
        padding: var(--spacing-md) var(--spacing-lg);
        z-index: 1;
        margin-top: 0;
    }

    .pagination-numbers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--spacing-sm);
    }

    :global(.pagination button) {
        margin: 0;
        border-radius: 100vh;
    }

    .number {
        min-width: 5.5ch;
        text-align: center;
        display: inline-block;
    }
</style>