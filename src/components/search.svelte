<script>
    import { fade } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';
    import { SiteMainSpace } from '../stores/player';

    import { searchArtistsStartingWith, searchArtists, searchArtistsContaining } from '../logic/artist';
    import { searchAlbumsStartingWith, searchAlbums, searchAlbumsContaining } from '../logic/album';
    import { searchSongsStartingWith, searchSongs, searchSongsContaining } from '../logic/song';
    import { searchPlaylists, searchSmartlists  } from '../logic/playlist';

    import CardList from './cardList.svelte';

    import SVGClose from "/src/images/close.svg";

    let initialResults = {};
    let noResults = false;

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
        sSmartlists          = searchSmartlists({query: $SearchQuery, page: 0, limit: 6});

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
            <div class="header panel-header">
                <h4 class="panel-title">Results for <span class="query">{$SearchQuery}</span></h4>
                <button class="icon-button close" on:click={handleClose}><SVGClose /></button>
            </div>

            <div class="results">
                {#if noResults}
                    <p>No results found</p>
                {/if}

                {#if initialResults.artistsStartsWith.length > 0}
                    <CardList type="artist" initialData={initialResults.artistsStartsWith} dataProvider={"searchArtistsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists Starting With" />
                {/if}

                {#if initialResults.artistsContains.length > 0}
                    <CardList type="artist" initialData={initialResults.artistsContains} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists Containing" />
                {/if}

                {#if initialResults.albumsStartsWith.length > 0}
                    <CardList type="album" initialData={initialResults.albumsStartsWith} dataProvider={"searchAlbumsStartingWith"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums Starting With" />
                {/if}

                {#if initialResults.albumsContains.length > 0}
                    <CardList type="album" initialData={initialResults.albumsContains} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums Containing" />
                {/if}

                {#if initialResults.songsStartsWith.length > 0}
                    <CardList type="song" initialData={initialResults.songsStartsWith} dataProvider={"searchSongsStartingWith"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs Starting With" />
                {/if}

                {#if initialResults.songsContains.length > 0}
                    <CardList type="song" initialData={initialResults.songsContains} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs Containing" />
                {/if}

                {#if initialResults.playlists.length > 0}
                    <CardList type="playlist" initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} heading="Playlists" />
                {/if}

                {#if initialResults.smartlists.length > 0}
                    <CardList type="smartlist" initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} limit=6 arg={encodeURI($SearchQuery)} heading="Smartlists" />
                {/if}
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

    .query {
        font-style: italic;
    }

    .results {
        padding: var(--spacing-xl);
        overflow-y: auto;
    }

    .results:after {
        content: '';
        padding: inherit;
        padding-top: 0;
        display: block;
    }
</style>