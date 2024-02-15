<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { getSongsFromArtist, sortSongsByName } from "~/logic/song.js";
    import Lister from "~/components/lister/lister.svelte";
    import { track, songsPreset } from "~/components/lister/columns.js";

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
        id="SongsArtistAll"
        bind:data={songs}
        columns={[track, ...songsPreset]}
        type="song"
        virtualList={true}
        actionData={{
            type: "songs",
            displayMode: "fullButtons",
            showShuffle: songs.length > 1,
            data: Object.create({ songs: songs }),
        }}
    />
{:else}
    <p>{$_("text.loading")}</p>
{/if}

<style>
</style>
