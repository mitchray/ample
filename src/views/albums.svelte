<script>
    import CardList from '../components/cardList.svelte';
    import AlbumsAll from '../components/album/albumsAll.svelte';
    import AlbumsByYear from '../components/album/albumsByYear.svelte';
    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";

    import { newestAlbums, randomAlbums } from "../logic/album";
    import { PageTitle } from "../stores/status";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Newest",  value: "newest" },
        { label: "Random",  value: "random" },
        { label: "By Year", value: "year" },
        { label: "All",     value: "all" },
    ];

    let currentTab;

    let title = "Albums";
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
                    <CardList type="album" dataProvider={"newestAlbums"} limit=18 />
                </Tab>
            {/if}

            {#if tab.value === 'random'}
                <Tab id="random" class="random" bind:activeTabValue={currentTab}>
                    <CardList type="album" dataProvider={"randomAlbums"} limit=18 refresh=true />
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



