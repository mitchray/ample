<script>
    import { fade } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';
    import { SiteMainSpace } from '../stores/player';

    import { searchArtistsStartingWith, searchArtists, searchArtistsContaining } from '../logic/artist';
    import { searchAlbumsStartingWith, searchAlbums, searchAlbumsContaining } from '../logic/album';
    import { searchSongsStartingWith, searchSongs, searchSongsContaining } from '../logic/song';
    import { searchPlaylists, searchSmartlists  } from '../logic/playlist';

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import CardList from '../components/cardList.svelte';

    import SVGClose from "/src/images/close.svg";

    let initialResults = {};
    let noResults = false;

    // List of tab items with labels and values.
    let tabItems = [
        { label: "All",        value: "all" },
        { label: "Songs",      value: "songs" },
        { label: "Albums",     value: "albums" },
        { label: "Artists",    value: "artists" },
        { label: "Playlists",  value: "playlists" },
        { label: "Smartlists", value: "smartlists" },
    ];

    // Current active tab
    let currentTab;

    function handleClick(event) {
        // Close search if we are following a link
        if (event.target.href !== undefined || event.target.parentNode.href !== undefined) {
            ShowSearch.set(false);
        }
    }

    function handleClose() {
        ShowSearch.set(false);
    }

    $: {
        if ($SearchQuery) {
            resetResults();
            doSearch();
        }
    }

    function resetResults() {
        initialResults = {
            artistsStartsWith: [],
            artistsContains:   [],
            albumsStartsWith:  [],
            albumsContains:    [],
            songsStartsWith:   [],
            songsContains:     [],
            playlists:         [],
            smartlists:        [],
        };
    }

    async function doSearch() {
        let sArtistsStartsWith = [];
        let sArtistsContains   = [];
        let sAlbumsStartsWith  = [];
        let sAlbumsContains    = [];
        let sSongsStartsWith   = [];
        let sSongsContains     = [];
        let sPlaylists         = [];
        let sSmartlists        = [];

        sArtistsStartsWith   = searchArtistsStartingWith({query: $SearchQuery, page: 0, limit: 6});
        sArtistsContains     = searchArtistsContaining({query: $SearchQuery, page: 0, limit: 6});
        sAlbumsStartsWith    = searchAlbumsStartingWith({query: $SearchQuery, page: 0, limit: 6});
        sAlbumsContains      = searchAlbumsContaining({query: $SearchQuery, page: 0, limit: 6});
        sSongsStartsWith     = searchSongsStartingWith({query: $SearchQuery, page: 0, limit: 9});
        sSongsContains       = searchSongsContaining({query: $SearchQuery, page: 0, limit: 9});
        sPlaylists           = searchPlaylists({query: $SearchQuery, page: 0, limit: 6});
        sSmartlists          = searchSmartlists({query: $SearchQuery});

        [
            initialResults.artistsStartsWith,
            initialResults.artistsContains,
            initialResults.albumsStartsWith,
            initialResults.albumsContains,
            initialResults.songsStartsWith,
            initialResults.songsContains,
            initialResults.playlists,
            initialResults.smartlists,
        ] = await Promise.all([
            sArtistsStartsWith,
            sArtistsContains,
            sAlbumsStartsWith,
            sAlbumsContains,
            sSongsStartsWith,
            sSongsContains,
            sPlaylists,
            sSmartlists
        ]);

        // test if every array in initialResults is empty
        noResults = Object.values(initialResults).every(value => {
            return value.length === 0;
        });
    }
</script>

{#if $SiteMainSpace.ready && $ShowSearch && $SearchQuery}
    <div class="container"
        on:click={handleClick}
        transition:fade={{ duration: 300 }}
        style="width: {$SiteMainSpace.width}px; height: {$SiteMainSpace.height}px; top: {$SiteMainSpace.top}px; left: {$SiteMainSpace.left}px;"
    >
        {#key $SearchQuery}
            <div class="header new-panel-header">
                <h4 class="panel-title">Search</h4>
                <button class="icon-button close" on:click={handleClose}><SVGClose /></button>
            </div>

            <div class="results">
                <Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
                    {#each tabItems as tab}
                        {#if tab.loaded === true}
                            {#if tab.value === 'all'}
                                <Tab id="all" class="all" bind:activeTabValue={currentTab}>
                                    {#if noResults}
                                        <div>No results found</div>
                                    {/if}

                                    {#if initialResults.songsStartsWith.length > 0}
                                        <CardList type="song" useGenericCard={true} initialData={initialResults.songsStartsWith} dataProvider={"searchSongsStartingWith"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs Starting With" />
                                    {/if}

                                    {#if initialResults.songsContains.length > 0}
                                        <CardList type="song" useGenericCard={true} initialData={initialResults.songsContains} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs Containing" />
                                    {/if}

                                    {#if initialResults.albumsStartsWith.length > 0}
                                        <CardList type="album" useGenericCard={true} initialData={initialResults.albumsStartsWith} dataProvider={"searchAlbumsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums Starting With" />
                                    {/if}

                                    {#if initialResults.albumsContains.length > 0}
                                        <CardList type="album" useGenericCard={true} initialData={initialResults.albumsContains} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums Containing" />
                                    {/if}

                                    {#if initialResults.artistsStartsWith.length > 0}
                                        <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsStartsWith} dataProvider={"searchArtistsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists Starting With" />
                                    {/if}

                                    {#if initialResults.artistsContains.length > 0}
                                        <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsContains} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists Containing" />
                                    {/if}

                                    {#if initialResults.playlists.length > 0}
                                        <CardList type="playlist" useGenericCard={true} initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} heading="Playlists" />
                                    {/if}

                                    {#if initialResults.smartlists.length > 0}
                                        <CardList type="smartlist" useGenericCard={true} initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} arg={encodeURI($SearchQuery)} heading="Smartlists" />
                                    {/if}
                                </Tab>
                            {/if}

                            {#if tab.value === 'songs'}
                                <Tab id="songs" class="songs" bind:activeTabValue={currentTab}>
                                    {#if initialResults.songsStartsWith.length > 0}
                                        <CardList type="song" useGenericCard={true} initialData={initialResults.songsStartsWith} dataProvider={"searchSongsStartingWith"} limit=9 arg={encodeURI($SearchQuery)} heading="Starting With" />
                                    {/if}

                                    {#if initialResults.songsContains.length > 0}
                                        <CardList type="song" useGenericCard={true} initialData={initialResults.songsContains} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Containing" />
                                    {/if}

                                    {#if initialResults.songsStartsWith.length === 0 && initialResults.songsContains.length === 0}
                                        <div>No results found</div>
                                    {/if}
                                </Tab>
                            {/if}

                            {#if tab.value === 'albums'}
                                <Tab id="albums" class="albums" bind:activeTabValue={currentTab}>
                                    {#if initialResults.albumsStartsWith.length > 0}
                                        <CardList type="album" useGenericCard={true} initialData={initialResults.albumsStartsWith} dataProvider={"searchAlbumsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Starting With" />
                                    {/if}

                                    {#if initialResults.albumsContains.length > 0}
                                        <CardList type="album" useGenericCard={true} initialData={initialResults.albumsContains} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Containing" />
                                    {/if}

                                    {#if initialResults.albumsStartsWith.length === 0 && initialResults.albumsContains.length === 0}
                                        <div>No results found</div>
                                    {/if}
                                </Tab>
                            {/if}

                            {#if tab.value === 'artists'}
                                <Tab id="artists" class="artists" bind:activeTabValue={currentTab}>
                                    {#if initialResults.artistsStartsWith.length > 0}
                                        <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsStartsWith} dataProvider={"searchArtistsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Starting With" />
                                    {/if}

                                    {#if initialResults.artistsContains.length > 0}
                                        <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsContains} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Containing" />
                                    {/if}

                                    {#if initialResults.artistsStartsWith.length === 0 && initialResults.artistsContains.length === 0}
                                        <div>No results found</div>
                                    {/if}
                                </Tab>
                            {/if}

                            {#if tab.value === 'playlists'}
                                <Tab id="playlists" class="playlists" bind:activeTabValue={currentTab}>
                                    {#if initialResults.playlists.length > 0}
                                        <CardList type="playlist" useGenericCard={true} initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} />
                                    {/if}

                                    {#if initialResults.playlists.length === 0}
                                        <div>No results found</div>
                                    {/if}
                                </Tab>
                            {/if}

                            {#if tab.value === 'smartlists'}
                                <Tab id="smartlists" class="smartlists" bind:activeTabValue={currentTab}>
                                    {#if initialResults.smartlists.length > 0}
                                        <CardList type="smartlist" useGenericCard={true} initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} arg={encodeURI($SearchQuery)} />
                                    {/if}

                                    {#if initialResults.smartlists.length === 0}
                                        <div>No results found</div>
                                    {/if}
                                </Tab>
                            {/if}
                        {/if}
                    {/each}
                </Tabs>
            </div>
        {/key}
    </div>
{/if}

<style>
    .container {
        background-color: var(--color-background);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        /*outline: 3px solid lime;*/
    }

    .container:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .header {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        padding-left: var(--spacing-lg);
    }

    .header h4 {
        margin: 0;
        margin-right: auto;
    }

    .results {
        padding: 0 var(--spacing-lg) var(--spacing-lg);
        /*overflow-y: auto;*/
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-bottom: var(--spacing-lg);
        /*outline: 3px solid red;*/
        position: relative;
    }

    .results :global(.tab-content) {
        overflow-y: auto;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: var(--spacing-xxxl);
    }
</style>