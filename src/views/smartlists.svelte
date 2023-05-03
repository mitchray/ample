<script>
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import Lister2 from '../components/lister/lister.svelte';

    let title = "Smartlists";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

{#await $API.smartlists()}
    <p>Loading smartlists</p>
{:then smartlists}
    {#if smartlists.length > 0}
        <Lister2
            data={smartlists}
            type="smartlist"
            initialSort="name"
            actionData={{
                disable: true
            }}
        />
    {:else}
        <p>Unable to find any smartlists</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}