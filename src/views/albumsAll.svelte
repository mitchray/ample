<script>
    import { getAlbumsStartingWith } from "../logic/album";

    import AlphanumericPagination from '../components/alphanumericPagination.svelte';
    import Pagination2 from '../components/pagination2.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    let selectedChar = ''; // bound from alphanumericPagination
    let searchValue = ''; // bound from alphanumericPagination
    let dataDisplay = [];
    let limit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;

    $: count = dataDisplay.length || 0;

    $: {
        if (selectedChar || selectedChar === '') {
            resetPage()
            getData();
        }
    }

    $: {
        if (limit || page) {
            getData();
        }
    }

    async function getData() {
        dataDisplay = await getAlbumsStartingWith({limit: limit, page: page, filterChar: searchValue});
        loadedTime = new Date();
    }

    function resetPage() {
        page = 0;
    }
</script>

<h1>All albums</h1>

<AlphanumericPagination bind:selectedChar bind:searchValue />

<Pagination2 bind:limit bind:page bind:count />

{#key loadedTime}
    <Lister2 bind:data={dataDisplay} type="album" />
{/key}

<Pagination2 bind:limit bind:page bind:count />