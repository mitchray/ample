<script>
    import { onMount } from 'svelte';

    import { getAlbumsByYear } from "../logic/album";

    import YearPagination from '../components/yearPagination.svelte';
    import Actions from '../components/actions.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    export let year = null;

    let albumList = [];
    let data = [];
    let fromYear;
    let toYear;
    let loading = true;

    $: {
        data = getData(fromYear, toYear);
    }

    async function getData(fromYear, toYear) {
        loading = true;
        data = await getAlbumsByYear(fromYear, toYear);
        loading = false;
    }

    onMount(() => {
        getData();
    });
</script>

<h1>Albums by year</h1>

<YearPagination bind:fromYear bind:toYear showYear={year} />

{#if fromYear && toYear}
    {#key fromYear+toYear}
        <Actions
            type="year"
            mode="fullButtons"
            data={{from: fromYear, to: toYear}}
            count="3"
        />

        {#if loading}
            <p>Loading albums</p>
        {:else}
            {#if data.length > 0}
                <Lister2 data={data} type="album" />
            {:else}
                <p>No albums found within requested range</p>
            {/if}
        {/if}
    {/key}
{/if}
