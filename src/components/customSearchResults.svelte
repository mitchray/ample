<script>
    import Lister from '../components/lister.svelte';

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;
    export let showCheckboxes = false;

    $: {
        // reset results if type changes
        if (type) {
            results = [];
        }
    }
</script>

{#if loading}
    <p>Searching for items</p>
{:else}
    {#if results.length > 0}
        <p>Total: {results.length}</p>
        {#key loadedTime}
            <Lister bind:data={results} type="{type}" showCheckboxes={showCheckboxes} />
        {/key}
    {:else}
        <p>No items found</p>
    {/if}
{/if}