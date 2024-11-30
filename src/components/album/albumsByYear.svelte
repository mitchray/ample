<script>
    import { getAlbumsByYear } from "~/logic/album.js";
    import YearPagination from "~/components/yearSelector.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";

    let { showYear = new Date().getFullYear() } = $props();

    let fromYear = $state(null);
    let toYear = $state(null);
    let tabulator = $state();

    async function getData() {
        tabulator?.setData([]);

        let response = await getAlbumsByYear({
            limit: 5000,
            from: fromYear,
            to: toYear,
        });

        tabulator?.setData(response.album || []);
    }

    $effect(() => {
        // YearPagination 'Search' button just passes the final value, so get data if the years change
        if (fromYear && toYear) {
            getData();
        }
    });
</script>

<YearPagination bind:fromYear bind:toYear {showYear} />

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
        data={[]}
        columns={albumsPreset}
        options={{
            persistenceID: "albums",
        }}
    ></Tabulator>
</div>
