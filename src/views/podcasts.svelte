<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";

    import Lister2 from '../components/lister/lister.svelte';

    let podcasts = [];
    let loading = true;

    onMount(async () => {
        podcasts = await $API.podcasts();
        loading = false;
    });
</script>

<svelte:head>
    <title>Podcasts</title>
</svelte:head>

<h1 class="page-title">Podcasts</h1>

{#if !loading && podcasts && podcasts.length > 0}
    <Lister2
        data={podcasts}
        type="podcast"
        initialSort="name"
        actionData={{
            disable: true
        }}
    />
{:else}
    <p>Loading podcasts</p>
{/if}

<style>

</style>