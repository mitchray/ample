<script>
    import { fade, fly } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';
    import { SiteContentBind } from '../stores/player';

    import { searchArtists } from '../logic/artist';
    import { searchAlbums } from '../logic/album';
    import { searchSongs } from '../logic/song';
    import { searchPlaylists } from '../logic/playlist';
    import { searchSmartlists } from '../logic/playlist';

    import CardList from './cardList.svelte';

    import SVGClose from "../../public/images/close.svg";

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
            artists: [],
            albums: [],
            songs: [],
            playlists: [],
            smartlists: [],
        };
    }

    async function doSearch() {
        const s1 = searchArtists({query: $SearchQuery, page: 0, limit: 6});
        const s2 = searchAlbums({query: $SearchQuery, page: 0, limit: 6});
        const s3 = searchSongs({query: $SearchQuery, page: 0, limit: 9});
        const s4 = searchPlaylists({query: $SearchQuery, page: 0, limit: 6});
        const s5 = searchSmartlists({query: $SearchQuery, page: 0, limit: 6});

        [initialResults.artists, initialResults.albums, initialResults.songs, initialResults.playlists, initialResults.smartlists] = await Promise.all([s1, s2, s3, s4, s5]);

        // test if every array in initialResults is empty
        noResults = Object.values(initialResults).every(value => {
            return value.length === 0;
        });
    }
</script>

{#if $SearchQuery}
    <div class="container"
        on:click={handleClick}
        transition:fade={{ duration: 300 }}
        style="width: {$SiteContentBind.clientWidth}px; height: {$SiteContentBind.clientHeight}px; top: {$SiteContentBind.getBoundingClientRect().top}px; left: {$SiteContentBind.getBoundingClientRect().left}px;"
    >
        <div class="header panel-header">
            <h4 class="panel-title">Results for <span class="query">{$SearchQuery}</span></h4>
            <button class="icon-button close" on:click={handleClose}><SVGClose /></button>
        </div>

        <div class="results">
            {#key $SearchQuery}
                {#if noResults}
                    <p>No results found</p>
                {/if}

                {#if initialResults.artists.length > 0}
                    <CardList type="artist" initialData={initialResults.artists} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists" />
                {/if}

                {#if initialResults.albums.length > 0}
                    <CardList type="album" initialData={initialResults.albums} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums" />
                {/if}

                {#if initialResults.songs.length > 0}
                    <CardList type="song" initialData={initialResults.songs} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs" />
                {/if}

                {#if initialResults.playlists.length > 0}
                    <CardList type="playlist" initialData={initialResults.playlists} dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} heading="Playlists" />
                {/if}

                {#if initialResults.smartlists.length > 0}
                    <CardList type="smartlist" initialData={initialResults.smartlists} dataProvider={"searchSmartlists"} limit=6 arg={encodeURI($SearchQuery)} heading="Smartlists" />
                {/if}
            {/key}
        </div>
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