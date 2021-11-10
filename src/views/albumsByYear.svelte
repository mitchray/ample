<script>
    import { getAlbumsByYear } from "../logic/album";

    import YearPagination from '../components/yearPagination.svelte';
    import Actions from '../components/actions.svelte';
    import Pagination2 from '../components/pagination2.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    export let year = null;

    let dataDisplay = [];
    let fromYear;
    let toYear;
    let loading = true;
    let limit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;

    $: count = dataDisplay.length || 0;

    $: {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    }

    $: {
        if (limit || page) {
            getData();
        }
    }

    async function getData() {
        loading = true;
        dataDisplay = await getAlbumsByYear({limit: limit, page: page, from: fromYear, to: toYear});
        loadedTime = new Date();
        loading = false;
    }
</script>

<h1>Albums by year</h1>

<YearPagination bind:fromYear bind:toYear showYear={year} />

<Pagination2 bind:limit bind:page bind:count />

{#if fromYear && toYear}
    {#key fromYear+toYear}
        <Actions
            type="year"
            mode="fullButtons"
            data={{from: fromYear, to: toYear}}
            count="3"
        />

        {#key loadedTime}
            <Lister2 bind:data={dataDisplay} type="album" />
        {/key}
    {/key}
{/if}

<Pagination2 bind:limit bind:page bind:count />
