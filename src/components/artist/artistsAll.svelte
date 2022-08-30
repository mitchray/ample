<script>
    import { ShowArtistType } from "../../stores/status";

    import { getArtistsStartingWith } from "../../logic/artist";

    import AlphanumericPagination from '../../components/alphanumericPagination.svelte';
    import Pagination2 from '../../components/pagination2.svelte';
    import Lister2 from '../../components/lister/lister.svelte';

    let selectedChar = ''; // bound from alphanumericPagination
    let searchValue = ''; // bound from alphanumericPagination
    let dataDisplay = [];
    let defaultLimit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;
    let limit = 0;

    $: count = dataDisplay.length || 0;
    $: dataDisplay = dataDisplay;

    $: {
        if (limit > 0 && ($ShowArtistType || selectedChar || selectedChar === '')) {
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
        dataDisplay = await getArtistsStartingWith({limit: limit, page: page, filterChar: searchValue});
        loadedTime = new Date();
    }

    function resetPage() {
        page = 0;
    }
</script>

<AlphanumericPagination bind:selectedChar bind:searchValue />

<Pagination2 bind:limit bind:page bind:count type="artist" defaultLimit={defaultLimit} />

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