<script>
    import CustomSearch from '../components/customSearch.svelte';
    import CustomSearchResults from '../components/customSearchResults.svelte';
    import MassRater from '../components/massRater.svelte';

    let loadedTime;
    let loading;
    let results = [];
    let type = "song";

    let batchPreset = {
        limit: "100",
        rule_1: "myrating",
        rule_1_operator: "5",
        rule_1_input: "1"
    };
</script>

<svelte:head>
    <title>Multi-rater</title>
</svelte:head>

<h1 class="page-title">Multi-rater</h1>

<CustomSearch useSettings={batchPreset} bind:results bind:loadedTime bind:loading bind:selectedObjectType={type} immediateSearch={true} />
<MassRater bind:items={results} bind:type bind:loadedTime />
<CustomSearchResults bind:results bind:loadedTime bind:loading bind:type showCheckboxes={true} />

<style>

</style>
