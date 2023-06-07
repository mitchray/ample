<script>
    import { _ } from 'svelte-i18n';
    import { PageTitle } from "../stores/status";
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

    let title = $_('title.multiRater');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<CustomSearch useSettings={batchPreset} bind:results bind:loadedTime bind:loading bind:selectedObjectType={type} immediateSearch={true} />
<MassRater bind:items={results} bind:type bind:loadedTime />

<div class="page-main">
    <CustomSearchResults bind:results bind:loadedTime bind:loading bind:type showCheckboxes={true} />
</div>

<style>

</style>
