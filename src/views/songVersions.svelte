<script>
    import { _ } from 'svelte-i18n';
    import Lister from '../components/lister/lister.svelte';
    import { PageTitle } from "../stores/status";
    import { getSongVersions } from "../logic/song";

    export let params = {}

    let loading;
    let results = [];

    let title = $_('text.songVersions');
    $PageTitle = title;

    $: params.songTitle = params.songTitle;
    $: params.artistName = params.artistName;
</script>

<svelte:head>
    <title>{$_('text.versionsOf', { values: { songTitle: params.songTitle, artistName: params.artistName } }) || $_('text.loading')}</title>
</svelte:head>

<h1 class="page-title">{@html $_('text.versionsOfHTML', { values: { songTitle: params.songTitle, artistName: params.artistName } })}</h1>

<div class="page-main">
    {#key params.songTitle + params.artistName}
        {#await getSongVersions(params.songTitle, params.artistName)}
            {$_('text.loading')}
        {:then songs}
            {#if songs.length > 1}
                <Lister
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
