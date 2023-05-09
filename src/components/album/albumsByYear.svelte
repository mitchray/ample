<script>
    import { getAlbumsByYear } from "../../logic/album";

    import YearPagination from '../../components/yearPagination.svelte';
    import Pagination from '../../components/Pagination.svelte';
    import Lister2 from '../../components/lister/lister.svelte';

    export let showYear = new Date().getFullYear();

    let dataDisplay = [];
    let fromYear = showYear; // default to current year
    let toYear = showYear; // default to current year
    let loading = true;
    let defaultLimit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;
    let limit = 0;

    $: count = dataDisplay.length || 0;

    $: {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    }

    $: {
        if (limit > 0 || page) {
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

<YearPagination bind:fromYear bind:toYear showYear={showYear} />

<Pagination bind:limit bind:page bind:count type="album" defaultLimit={defaultLimit} />

{#if fromYear && toYear}
    {#key fromYear+toYear}
        {#key loadedTime}
            <Lister2
                bind:data={dataDisplay}
                type="album"
                actionData={{
                    type: "year",
                    mode: "fullButtons",
                    showShuffle: true,
                    data: Object.create({from: fromYear, to: toYear})
                }}
            />
        {/key}
    {/key}
{/if}

<Pagination bind:limit bind:page bind:count type="album" defaultLimit={defaultLimit} />
