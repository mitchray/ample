<script>
    import { _ } from 'svelte-i18n';
    import { PageTitle } from "../stores/status";
    import { newestAlbums } from "../logic/album"
    import Lister from '../components/lister/lister.svelte';

    let title = $_('text.newest');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#await newestAlbums({limit: 100})}
        {$_('text.loading')}
    {:then albums}
        {#if albums.length > 0}
            <Lister
                data={albums}
                type="album"
                virtualList={true}
                actionData={{
                    type: "albums",
                    mode: "fullButtons",
                    showShuffle: albums.length > 1,
                    data: Object.create({albums: albums})
                }}
            />
        {:else}
            <p>{$_('text.noItemsFound')}</p>
        {/if}
    {:catch error}
        <p>{$_('text.errorGeneric')}</p>
    {/await}
</div>
