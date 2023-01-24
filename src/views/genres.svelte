<script>
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { sortGenresByName } from "../logic/genre";

    import Lister2 from '../components/lister/lister.svelte';

    let genres = [];
    let loading = false;

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

<h1 class="page-title">Genres</h1>

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

<style>

</style>