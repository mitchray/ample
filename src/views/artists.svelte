<script>
    import CardList from '../components/cardList.svelte';
    import ArtistsAll from '../components/artist/artistsAll.svelte';
    import Tabs from "../components/tabs.svelte";
    import ArtistTypeSelector from "../components/artist/artistTypeSelector.svelte";

    import { newestArtists, randomArtists } from "../logic/artist";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Recently Updated", value: "recentlyUpdated" },
        { label: "Random",           value: "random" },
        { label: "All",              value: "all" },
    ];

    let currentTab;
</script>

<h1 class="page-title">Artists</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'recentlyUpdated'}
                <div class="recentlyUpdated" style="display: {currentTab === 'recentlyUpdated' ? 'block' : 'none'}">
                    <CardList type="artist" dataProvider={"newestArtists"} limit=18 />
                </div>
            {/if}

            {#if tab.value === 'random'}
                <div class="random" style="display: {currentTab === 'random' ? 'block' : 'none'}">
<!-- TODO: waiting for next Ampache release <ArtistTypeSelector />-->
                    <CardList type="artist" dataProvider={"randomArtists"} limit=18 refresh=true />
                </div>
            {/if}

            {#if tab.value === 'all'}
                <div class="all" style="display: {currentTab === 'all' ? 'block' : 'none'}">
<!-- TODO: waiting for next Ampache release <ArtistTypeSelector />-->
                    <ArtistsAll />
                </div>
            {/if}
        {/if}
    {/each}
</Tabs>



