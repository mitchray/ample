<script>
    import { getAlbumsByYear } from "../../logic/album";

    import YearPagination from '../../components/yearPagination.svelte';
    import Lister from '../../components/lister/lister.svelte';

    export let showYear = new Date().getFullYear();

    let dataDisplay = [];
    let fromYear = showYear; // default to current year
    let toYear = showYear; // default to current year
    let loading = true;
    let loadedTime = 0;

    $: {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    }

    async function getData() {
        loading = true;
        dataDisplay = await getAlbumsByYear({limit: 5000, from: fromYear, to: toYear});
        loadedTime = new Date();
        loading = false;
    }
</script>

<YearPagination bind:fromYear bind:toYear showYear={showYear} />

{#if fromYear && toYear}
    {#key fromYear+toYear}
        {#key loadedTime}
            <Lister
                data={dataDisplay}
                type="album"
                virtualList={true}
                initialSort="year"
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
