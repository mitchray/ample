<script>
    export let count = 0;
    export let limit = 10; // default
    export let page = 0; // default

    $: if (limit) {
        resetPage();
    }

    $: limit = limit;
    $: page = page;

    function nextPage() {
        page = page + 1;
    }

    function previousPage() {
        page = Math.max(0, page - 1);
    }

    function resetPage() {
        page = 0;
    }
</script>

<div class="container">
    <label>
        Limit
        <input type="number" class="limit" bind:value={limit} size="4" maxlength="4" />
    </label>

    <button class="button button--tertiary" on:click={previousPage} disabled={page === 0}>Previous</button>
    <button class="button button--tertiary" on:click={nextPage} disabled={count < limit}>Next</button>
</div>

<style>
    .container {
        margin-bottom: var(--spacing-lg);
    }

    .limit {
        box-sizing: content-box;
        width: 8ch;
    }

    .button {
        margin-left: var(--spacing-md);
    }
</style>