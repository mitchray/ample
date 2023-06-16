<script>
    import { _ } from 'svelte-i18n';
    import { onMount, onDestroy } from "svelte";
    import { computePosition, autoUpdate, offset, size } from '@floating-ui/dom';

    import { QueueIsOpen, QueueIsPinned, SearchQuery, ShowSearch, SidebarIsPinned } from '../stores/status';
    import { SiteInnerBind, SiteContentBind } from '../stores/player';

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
    let searchBind;
    let autoUpdateCleanup;

    // List of tab items with labels and values.
    let tabItems = [
        { label: $_('text.all'),        value: "all" },
        { label: $_('text.songs'),      value: "songs" },
        { label: $_('text.albums'),     value: "albums" },
        { label: $_('text.artists'),    value: "artists" },
        { label: $_('text.playlists'),  value: "playlists" },
        { label: $_('text.smartlists'), value: "smartlists" },
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

    $: {
        if ($SiteInnerBind) {
            // updatePosition whenever Queue or Sidebar changes status
            $QueueIsOpen || $SidebarIsPinned || $QueueIsPinned, updatePosition();
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

    function updatePosition() {
        computePosition($SiteContentBind, searchBind, {
            placement: "top-start",
            middleware: [
                offset(({rects}) => ({
                    mainAxis: -rects.floating.height,
                    alignmentAxis: 16,
                })),
                size({
                    apply({elements}) {
                        Object.assign(elements.floating.style, {
                            height: `${$SiteContentBind.clientHeight}px`,
                            width: `${$SiteContentBind.clientWidth - 16 - (($QueueIsOpen && !$QueueIsPinned) ? 330 : 0)}px`,
                        });
                    },
                }),
            ],
        }).then(({x, y}) => {
            Object.assign(searchBind.style, {
                left:  `${x}px`,
                top: `${y}px`,
            });
        });
    }

    onMount(() => {
        updatePosition();

        autoUpdateCleanup = autoUpdate(
            $SiteContentBind,
            searchBind,
            updatePosition
        );
    });

    onDestroy(() => {
        // floating-ui
        autoUpdateCleanup();
    })
</script>

<div class="container"
     on:click={handleClick}
     class:visible={$ShowSearch && $SearchQuery}
     bind:this={searchBind}
>
    {#key $SearchQuery}
        <div class="header new-panel-header">
            <h4 class="panel-title">{$_('text.search')}</h4>
            <button class="icon-button close" on:click={handleClose}><SVGClose /></button>
        </div>

        <div class="results">
            <Tabs bind:activeTabValue={currentTab} bind:items={tabItems} id="search">
                {#each tabItems as tab}
                    {#if tab.loaded === true}
                        {#if tab.value === 'all'}
                            <Tab id="all" class="all" bind:activeTabValue={currentTab}>
                                {#if noResults}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}

                                {#if initialResults.songsStartsWith?.length > 0}
                                    <CardList type="song" useGenericCard={true} initialData={initialResults.songsStartsWith} dataProvider={"searchSongsStartingWith"} limit=9 arg={encodeURI($SearchQuery)} heading="{$_('text.songs')} {$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.songsContains?.length > 0}
                                    <CardList type="song" useGenericCard={true} initialData={initialResults.songsContains} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="{$_('text.songs')} {$_('text.containing')}" />
                                {/if}

                                {#if initialResults.albumsStartsWith?.length > 0}
                                    <CardList type="album" useGenericCard={true} initialData={initialResults.albumsStartsWith} dataProvider={"searchAlbumsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.albums')} {$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.albumsContains?.length > 0}
                                    <CardList type="album" useGenericCard={true} initialData={initialResults.albumsContains} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.albums')} {$_('text.containing')}" />
                                {/if}

                                {#if initialResults.artistsStartsWith?.length > 0}
                                    <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsStartsWith} dataProvider={"searchArtistsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.artists')} {$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.artistsContains?.length > 0}
                                    <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsContains} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.artists')} {$_('text.containing')}" />
                                {/if}

                                {#if initialResults.playlists?.length > 0}
                                    <CardList type="playlist" useGenericCard={true} initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.playlists')}" />
                                {/if}

                                {#if initialResults.smartlists?.length > 0}
                                    <CardList type="smartlist" useGenericCard={true} initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} arg={encodeURI($SearchQuery)} heading="{$_('text.smartlists')}" />
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'songs'}
                            <Tab id="songs" class="songs" bind:activeTabValue={currentTab}>
                                {#if initialResults.songsStartsWith?.length > 0}
                                    <CardList type="song" useGenericCard={true} initialData={initialResults.songsStartsWith} dataProvider={"searchSongsStartingWith"} limit=9 arg={encodeURI($SearchQuery)} heading="{$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.songsContains?.length > 0}
                                    <CardList type="song" useGenericCard={true} initialData={initialResults.songsContains} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="{$_('text.containing')}" />
                                {/if}

                                {#if initialResults.songsStartsWith?.length === 0 && initialResults.songsContains?.length === 0}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'albums'}
                            <Tab id="albums" class="albums" bind:activeTabValue={currentTab}>
                                {#if initialResults.albumsStartsWith?.length > 0}
                                    <CardList type="album" useGenericCard={true} initialData={initialResults.albumsStartsWith} dataProvider={"searchAlbumsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.albumsContains?.length > 0}
                                    <CardList type="album" useGenericCard={true} initialData={initialResults.albumsContains} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.containing')}" />
                                {/if}

                                {#if initialResults.albumsStartsWith?.length === 0 && initialResults.albumsContains?.length === 0}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'artists'}
                            <Tab id="artists" class="artists" bind:activeTabValue={currentTab}>
                                {#if initialResults.artistsStartsWith?.length > 0}
                                    <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsStartsWith} dataProvider={"searchArtistsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.startingWith')}" />
                                {/if}

                                {#if initialResults.artistsContains?.length > 0}
                                    <CardList type="artist" useGenericCard={true} initialData={initialResults.artistsContains} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="{$_('text.containing')}" />
                                {/if}

                                {#if initialResults.artistsStartsWith?.length === 0 && initialResults.artistsContains?.length === 0}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'playlists'}
                            <Tab id="playlists" class="playlists" bind:activeTabValue={currentTab}>
                                {#if initialResults.playlists?.length > 0}
                                    <CardList type="playlist" useGenericCard={true} initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} />
                                {/if}

                                {#if initialResults.playlists?.length === 0}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'smartlists'}
                            <Tab id="smartlists" class="smartlists" bind:activeTabValue={currentTab}>
                                {#if initialResults.smartlists?.length > 0}
                                    <CardList type="smartlist" useGenericCard={true} initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} arg={encodeURI($SearchQuery)} />
                                {/if}

                                {#if initialResults.smartlists?.length === 0}
                                    <div>{$_('text.noItemsFound')}</div>
                                {/if}
                            </Tab>
                        {/if}
                    {/if}
                {/each}
            </Tabs>
        </div>
    {/key}
</div>

<style>
    .container {
        background-color: var(--color-background);
        position: absolute;
        inset-inline-start: 0;
        inset-block-start: 0;
        width: 100%;
        height: 100%;
        z-index: 20;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    }

    .container.visible {
        opacity: 1;
        pointer-events: initial;
    }

    .container:after {
        content: '';
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
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
        padding-inline-start: var(--spacing-lg);
    }

    .header h4 {
        margin: 0;
        margin-inline-end: auto;
    }

    .results {
        padding: 0 var(--spacing-lg) var(--spacing-lg);
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-block-end: var(--spacing-lg);
        margin-inline-end: var(--spacing-lg);
        position: relative;
    }

    .results :global(.tab-content) {
        overflow-y: auto;
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        inset-block-start: var(--spacing-xxxl);
    }
</style>