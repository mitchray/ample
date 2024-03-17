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

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<CustomSearch
    bind:loadedTime
    bind:loading
    bind:results
    bind:selectedObjectType={type}
/>

<CustomSearchResults bind:loadedTime bind:loading bind:results bind:type />
