<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import Lister2 from '../components/lister/lister.svelte';

    let podcasts = [];
    let loading = true;

    let title = "Podcasts";
    $PageTitle = title;

    onMount(async () => {
        podcasts = await $API.podcasts();
        loading = false;
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

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