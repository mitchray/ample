<script>
    import CustomSearch from '../components/customSearch.svelte';
    import CustomSearchResults from '../components/customSearchResults.svelte';

    let loadedTime;
    let loading;
    let results = [];
    let type;
</script>

<h1 class="page-title">Advanced Search</h1>

<CustomSearch bind:results bind:loadedTime bind:loading bind:selectedObjectType={type} />
<CustomSearchResults bind:results bind:loadedTime bind:loading bind:type />