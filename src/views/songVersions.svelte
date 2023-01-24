<script>
    import Lister2 from '../components/lister/lister.svelte';

    import { getSongVersions } from "../logic/song";

    export let songTitle;
    export let artistName;

    let loading;
    let results = [];

    $: songTitle = songTitle;
    $: artistName = artistName;
</script>

<h1 class="page-title">Versions of <em>{songTitle}</em> by <em>{artistName}</em></h1>

{#key songTitle + artistName}
    {#await getSongVersions(songTitle, artistName)}
        Searching for alternate versions
    {:then songs}
        {#if songs.length > 1}
            <Lister2
                data={songs}
                type="song"
                actionData={{
                    type: "",
                    mode: "fullButtons",
                    showShuffle: songs.length > 1,
                    data: Object.create({songs: songs})
                }}
            />
        {:else}
            <p>No alternate versions found</p>
        {/if}
    {:catch error}
        <p>An error occurred.</p>
    {/await}
{/key}

<style>

</style>
