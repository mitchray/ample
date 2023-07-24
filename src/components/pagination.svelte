<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';

    export let count = 0;
    export let limit = 0;
    export let defaultLimit = 10;
    export let page = 0;
    export let type;
    export let zone = "generic";

    let paginationLimitID = `PaginationLimit.${type}.${zone}`;
    let loaded = false;

    $: limit = limit;
    $: page = page;

    $: if (limit && loaded) {
        saveLimit();
        resetPage();
    }

    function nextPage() {
        page = page + 1;
    }

    function previousPage() {
        page = Math.max(0, page - 1);
    }

    function resetPage() {
        page = 0;
    }

    function saveLimit() {
        localStorage.setItem(`Ample${paginationLimitID}`, JSON.stringify(limit));
    }

    onMount(() => {
        limit = JSON.parse(localStorage.getItem(`Ample${paginationLimitID}`)) || defaultLimit;
        loaded = true;
    });
</script>

<div class="container">
    <label>
        {$_('text.limit')}
        <input type="number" class="limit" bind:value={limit} size="4" maxlength="4" />
    </label>

    <button class="button button--tertiary" on:click={previousPage} disabled={page === 0}>{$_('text.previous')}</button>
    <button class="button button--tertiary" on:click={nextPage} disabled={count < limit}>{$_('text.next')}</button>
</div>

<style>
    .container {
        margin-block-start: var(--spacing-xl);
    }

    .limit {
        box-sizing: content-box;
        width: 8ch;
        margin-inline-start: var(--spacing-sm);
    }

    .button {
        margin-inline-start: var(--spacing-md);
    }
</style>