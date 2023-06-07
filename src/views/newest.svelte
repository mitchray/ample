<script>
    import { _ } from 'svelte-i18n';
    import { PageTitle } from "../stores/status";
    import { newestAlbums } from "../logic/album"
    import Lister2 from '../components/lister/lister.svelte';

    let title = $_('title.newest');
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
            <Lister2
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
            <p>No albums found</p>
        {/if}
    {:catch error}
        <p>An error occurred.</p>
    {/await}
</div>
