<script>
    import { onMount } from "svelte";

    import { getPodcasts } from "../logic/podcast";

    import Lister2 from '../components/lister/lister.svelte';

    let podcasts = [];
    let loading = true;

    onMount(async () => {
        podcasts = await getPodcasts();
        loading = false;
    });
</script>

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