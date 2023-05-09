<script>
    import { API } from "../../stores/api";
    import AlphanumericFilter from '../../components/alphanumericFilter.svelte';
    import Pagination from '../../components/Pagination.svelte';
    import Lister2 from '../../components/lister/lister.svelte';

    export let type = "artist";

    let filterValue = ''; // bound from AlphanumericFilter
    let dataDisplay = [];
    let defaultLimit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;
    let limit = 0;

    $: count = dataDisplay.length || 0;
    $: dataDisplay = dataDisplay;

    $: {
        if (limit > 0 && (filterValue || filterValue === '')) {
            resetPage();
            getData();
        }
    }

    $: {
        if (limit > 0 || page) {
            getData();
        }
    }

    async function getData() {
        dataDisplay = await $API.advancedSearch({
            type: "artist",
            operator: "and",
            limit: limit,
            offset: limit * page,
            rules: [
                ['title', 8, '^' + filterValue]
            ]
        });
        loadedTime = new Date();
    }

    function resetPage() {
        page = 0;
    }
</script>

<AlphanumericFilter bind:filterValue />

{#key loadedTime}
    <Lister2
        bind:data={dataDisplay}
        type="artist"
        actionData={{
            type: "artists",
            mode: "fullButtons",
            data: Object.create({artists: dataDisplay})
        }}
    />
{/key}

<Pagination bind:limit bind:page bind:count type="artist" defaultLimit={defaultLimit} />