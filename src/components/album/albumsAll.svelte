<script>
    import { getAlbumsStartingWithChar } from "../../logic/album";
    import { FilterHistory } from "../../stores/status";
    import AlphanumericFilter from '../../components/alphanumericFilter.svelte';
    import Lister from '../../components/lister/lister.svelte';

    export let type = "album";

    let filterValue = $FilterHistory[type] || ""; // bound from AlphanumericFilter
    let dataDisplay = [];
    let loadedTime = 0;

    $: dataDisplay = dataDisplay;

    $: filterValue, getData();

    async function getData() {
        dataDisplay = await getAlbumsStartingWithChar({limit: 0, filterChar: filterValue});
        console.debug(dataDisplay)
        loadedTime = new Date();
    }
</script>

<AlphanumericFilter bind:filterValue type={type} />

{#key loadedTime}
    <Lister
        bind:data={dataDisplay}
        type="album"
        virtualList={true}
        actionData={{
            type: "albums",
            mode: "fullButtons",
            data: Object.create({albums: dataDisplay})
        }}
    />
{/key}