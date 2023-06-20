<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import { sortGenresByName } from "../logic/genre";
    import Lister from '../components/lister/lister.svelte';

    let genres = [];
    let loading = false;

    let title = $_('text.genres');
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
        <Lister
            data={genres}
            type="genre"
            initialSort="name"
            virtualList={true}
            actionData={{
                disable: true
            }}
        />
    {:else}
        <p>{$_('text.loading')}</p>
    {/if}
</div>

<style>

</style>