<script>
    import {_} from "svelte-i18n";
    import Lister from '../components/lister/lister.svelte';
    import AlbumsAll from '../components/album/albumsAll.svelte';
    import AlbumsByYear from '../components/album/albumsByYear.svelte';
    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import { newestAlbums, randomAlbums } from "../logic/album";
    import { PageTitle } from "../stores/status";

    // List of tab items with labels and values.
    let tabItems = [
        { label: $_('text.newest'),  value: "newest" },
        { label: $_('text.random'),  value: "random" },
        { label: $_('text.byYear'), value: "year" },
        { label: $_('text.all'),     value: "all" },
    ];

    let currentTab;

    let title = $_('text.albums');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems} id="albums">
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'newest'}
                <Tab id="newest" class="newest" bind:activeTabValue={currentTab}>
                    {#await newestAlbums({limit: 50})}
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
                </Tab>
            {/if}

            {#if tab.value === 'random'}
                <Tab id="random" class="random" bind:activeTabValue={currentTab}>
                    {#await randomAlbums({limit: 50})}
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
                </Tab>
            {/if}

            {#if tab.value === 'year'}
                <Tab id="year" class="year" bind:activeTabValue={currentTab}>
                    <AlbumsByYear />
                </Tab>
            {/if}

            {#if tab.value === 'all'}
                <Tab id="all" class="all" bind:activeTabValue={currentTab}>
                    <AlbumsAll />
                </Tab>
            {/if}
        {/if}
    {/each}
</Tabs>



