<script>
    import { run } from 'svelte/legacy';

    import { getAlbumsByYear } from "~/logic/album.js";
    import YearPagination from "~/components/yearPagination.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";

    /** @type {{showYear?: any}} */
    let { showYear = new Date().getFullYear() } = $props();

    let dataDisplay = $state([]);
    let fromYear = $state(null);
    let toYear = $state(null);
    let loadedTime = $state(0);
    let tabulator = $state(null);


    async function getData() {
        let response = await getAlbumsByYear({
            limit: 5000,
            from: fromYear,
            to: toYear,
        });

        dataDisplay = response.album || [];

        loadedTime = new Date();
    }
    run(() => {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    });
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

                    <MassRater bind:tabulator type="album" />
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
