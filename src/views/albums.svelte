<script>
    import CardList from '../components/cardList.svelte';
    import AlbumsAll from '../components/album/albumsAll.svelte';
    import AlbumsByYear from '../components/album/albumsByYear.svelte';
    import Tabs from "../components/tabs.svelte";

    import { newestAlbums, randomAlbums } from "../logic/album";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Newest",  value: "newest" },
        { label: "Random",  value: "random" },
        { label: "By Year", value: "year" },
        { label: "All",     value: "all" },
    ];

    let currentTab;
</script>

<h1 class="page-title">Albums</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'newest'}
                <div class="newest" style="display: {currentTab === 'newest' ? 'block' : 'none'}">
                    <CardList type="album" dataProvider={"newestAlbums"} limit=18 />
                </div>
            {/if}

            {#if tab.value === 'random'}
                <div class="random" style="display: {currentTab === 'random' ? 'block' : 'none'}">
                    <CardList type="album" dataProvider={"randomAlbums"} limit=18 refresh=true />
                </div>
            {/if}

            {#if tab.value === 'year'}
                <div class="year" style="display: {currentTab === 'year' ? 'block' : 'none'}">
                    <AlbumsByYear />
                </div>
            {/if}

            {#if tab.value === 'all'}
                <div class="all" style="display: {currentTab === 'all' ? 'block' : 'none'}">
                    <AlbumsAll />
                </div>
            {/if}
        {/if}
    {/each}
</Tabs>



