<script>
    import CustomSearch from '../components/customSearch.svelte';
    import CustomSearchResults from '../components/customSearchResults.svelte';

    export let songTitle;
    export let artistName;

    let loadedTime;
    let loading;
    let results = [];
    let type = "song";
    let duplicatesPreset;

    $: songTitle = songTitle;
    $: artistName = artistName;

    $: duplicatesPreset = {
        limit: "500",
        rule_1: "artist",
        rule_1_operator: "4",
        rule_1_input: artistName,
        rule_2: "title",
        rule_2_operator: "4",
        rule_2_input: songTitle
    };
</script>

<h1>Duplicates of <em>{songTitle}</em></h1>

{#key songTitle + artistName}
    <CustomSearch defaultSettings={duplicatesPreset} bind:results bind:loadedTime bind:loading bind:selectedObjectType={type} immediateSearch={true} />
    <CustomSearchResults bind:results bind:loadedTime bind:loading bind:type />
{/key}

<style>

</style>
