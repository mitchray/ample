<script>
    import { getArtistsStartingWithChar } from "../../logic/artist";

    import AlphanumericFilter from '../../components/alphanumericFilter.svelte';
    import Pagination2 from '../../components/pagination2.svelte';
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
        dataDisplay = await getArtistsStartingWithChar({limit: limit, page: page, filterChar: filterValue, type: type});
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

<Pagination2 bind:limit bind:page bind:count type="artist" defaultLimit={defaultLimit} />