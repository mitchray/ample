<script>
    import { getAlbumsByYear } from "~/logic/album.js";
    import YearPagination from "~/components/yearPagination.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";

    export let showYear = new Date().getFullYear();

    let dataDisplay = [];
    let fromYear = showYear; // default to current year
    let toYear = showYear; // default to current year
    let loadedTime = 0;
    let tabulator = null;

    $: {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    }

    async function getData() {
        dataDisplay = await getAlbumsByYear({
            limit: 5000,
            from: fromYear,
            to: toYear,
        });
        loadedTime = new Date();
    }
</script>

<YearPagination bind:fromYear bind:toYear {showYear} />

{#if fromYear && toYear}
    {#key fromYear + toYear}
        {#key loadedTime}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="year"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ from: fromYear, to: toYear }}
                    />

                    <MassRater bind:tabulator />
                </div>

                <Tabulator
                    bind:tabulator
                    data={dataDisplay}
                    columns={albumsPreset}
                    options={{
                        persistenceID: "albums",
                    }}
                ></Tabulator>
            </div>
        {/key}
    {/key}
{/if}
