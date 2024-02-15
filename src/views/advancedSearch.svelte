<script>
    import { _ } from "svelte-i18n";
    import CustomSearch from "~/components/customSearch.svelte";
    import CustomSearchResults from "~/components/customSearchResults.svelte";
    import { PageTitle } from "~/stores/state.js";

    let loadedTime;
    let loading;
    let results = [];
    let type;

    let title = $_("text.advancedSearch");
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<CustomSearch
    bind:results
    bind:loadedTime
    bind:loading
    bind:selectedObjectType={type}
/>

<CustomSearchResults bind:results bind:loadedTime bind:loading bind:type />
