<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import { sortGenresByName } from "../logic/genre";
    import Lister2 from '../components/lister/lister.svelte';

    let genres = [];
    let loading = false;

    let title = "Genres";
    $PageTitle = title;

    $: genres = genres;

    function handleSortByName() {
        loading = true;
        genres = sortGenresByName(genres);
        loading = false;
    }

    onMount(async () => {
        genres = await $API.genres();
        handleSortByName();
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#if !loading && genres && genres.length > 0}
        <Lister2
            data={genres}
            type="genre"
            initialSort="name"
            actionData={{
                disable: true
            }}
        />
    {:else}
        <p>Loading genres</p>
    {/if}
</div>

<style>

</style>