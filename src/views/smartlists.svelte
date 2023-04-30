<script>
    import { fade } from 'svelte/transition';
    import { API } from "../stores/api";
    import Lister2 from '../components/lister/lister.svelte';
    import PlaylistCard from '../components/playlist/playlistCard.svelte';
</script>

<svelte:head>
    <title>Smartlists</title>
</svelte:head>

<h1 class="page-title">Smartlists</h1>

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