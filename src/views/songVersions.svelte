<script>
    import { _ } from 'svelte-i18n';
    import Lister2 from '../components/lister/lister.svelte';
    import { PageTitle } from "../stores/status";
    import { getSongVersions } from "../logic/song";

    export let songTitle;
    export let artistName;

    let loading;
    let results = [];

    let title = $_('text.songVersions');
    $PageTitle = title;

    $: songTitle = songTitle;
    $: artistName = artistName;
</script>

<svelte:head>
    <title>{$_('text.versionsOf', { values: { songTitle: songTitle, artistName: artistName } }) || $_('text.loading')}</title>
</svelte:head>

<h1 class="page-title">{@html $_('text.versionsOfHTML', { values: { songTitle: songTitle, artistName: artistName } })}</h1>

<div class="page-main">
    {#key songTitle + artistName}
        {#await getSongVersions(songTitle, artistName)}
            {$_('text.loading')}
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
                <p>{$_("text.noItemsFound")}</p>
            {/if}
        {:catch error}
            <p>{$_("text.errorGeneric")}</p>
        {/await}
    {/key}
</div>

<style>

</style>
