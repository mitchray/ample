<script>
    import { onMount } from "svelte";

    import { getGenres, sortGenresByName } from "../logic/genre";

    import Lister from '../components/lister.svelte';
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
        genres = await getGenres();
        handleSortByName();
    });
</script>

<h1>Genres</h1>

{#if !loading && genres && genres.length > 0}
    <Lister2 data={genres} type="genre" initialSort="name" />
{:else}
    <p>Loading genres</p>
{/if}

<style>
    .genres :global(table) {
        border-collapse: collapse;
    }

    .genres :global(tr) {
        border-bottom: 1px solid var(--color-lines);
    }

    .genres :global(th) {
        text-align: left;
    }

    .genres :global(td) {
        padding: 0.6em 0.6em;
    }

    .actions {
        margin-bottom: var(--spacing-xl);
    }

    .reverse {
        margin-left: var(--spacing-lg);
    }

    .active {
        background-color: var(--color-tint-800);
        color: var(--color-shade-800);
    }
</style>