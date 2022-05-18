<script>
    import { onMount } from 'svelte';

    import { getSongsFromArtist, sortSongsByName } from "../../logic/song";

    import Lister2 from '../../components/lister/lister.svelte';

    export let artistID;
    let songs = [];
    let loading = false;

    $: songs = songs;

    function handleSortByName() {
        loading = true;
        songs = sortSongsByName(songs);
        loading = false;
    }

    onMount(async () => {
        songs = await getSongsFromArtist(artistID);
        handleSortByName();
    });
</script>

{#if !loading && songs && songs.length > 0}
    <Lister2 bind:data={songs} type="song" />
{:else}
    <p>Loading songs</p>
{/if}

<style>

</style>