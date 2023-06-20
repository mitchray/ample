<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';

    import { getSongsFromArtist, sortSongsByName } from "../../logic/song";

    import Lister from '../../components/lister/lister.svelte';

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
    <Lister
        bind:data={songs}
        type="song"
        tableOnly={true}
        virtualList={true}
        actionData={{
            type: "",
            mode: "fullButtons",
            showShuffle: songs.length > 1,
            data: Object.create({songs: songs})
        }}
    />
{:else}
    <p>{$_('text.loading')}</p>
{/if}

<style>

</style>