<script>
    import { PageTitle } from "../stores/status";
    import { newestAlbums } from "../logic/album"
    import Lister2 from '../components/lister/lister.svelte';

    let title = "Newest";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#await newestAlbums({limit: 100})}
        Loading albums
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
