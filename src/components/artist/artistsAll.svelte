<script>
    import { API } from "../../stores/api";
    import { FilterHistory } from "../../stores/status";
    import AlphanumericFilter from '../../components/alphanumericFilter.svelte';
    import Lister from '../../components/lister/lister.svelte';

    export let type = "artist";

    let filterValue = $FilterHistory[type] || ""; // bound from AlphanumericFilter
    let dataDisplay = [];
    let loadedTime = 0;

    $: dataDisplay = dataDisplay;

    $: filterValue, getData();

    async function getData() {
        dataDisplay = await $API.advancedSearch({
            type: "artist",
            operator: "and",
            limit: 0,
            rules: [
                ['title', 8, '^' + filterValue]
            ]
        });
        loadedTime = new Date();
    }
</script>

<AlphanumericFilter bind:filterValue type={type} />

{#key loadedTime}
    <Lister
        bind:data={dataDisplay}
        type="artist"
        virtualList={true}
        actionData={{
            type: "artists",
            mode: "fullButtons",
            data: Object.create({artists: dataDisplay})
        }}
    />
{/key}