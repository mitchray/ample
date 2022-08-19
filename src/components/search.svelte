<script>
    import { fade, fly } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';
    import { SiteContentBind } from '../stores/player';

    import { searchArtists, getArtistsFromAdvancedSearch } from '../logic/artist';
    import { searchAlbums, getAlbumsFromAdvancedSearch } from '../logic/album';
    import { searchSongs, getSongsFromAdvancedSearch } from '../logic/song';
    import { searchPlaylists, searchSmartlists } from '../logic/playlist';

    import CardList from './cardList.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGClose from "../../public/images/close.svg";

    let initialResults = {};
    let noResults = false;
    let isExact = false;
    let queryWithoutQuotes = "";
    let fancySearchResults = {};
    let nothingFancy = true;

    let regexKeywords = "artist|album|song|title|playlist|smartlist|$";

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

            // parse fancy items from string
            fancySearchResults.artist = $SearchQuery.match(new RegExp("(?<=artist:).+?(?=" + regexKeywords + ")", "gi"));
            fancySearchResults.album  = $SearchQuery.match(new RegExp("(?<=album:).+?(?=" + regexKeywords + ")", "gi"));
            fancySearchResults.song   = $SearchQuery.match(new RegExp("(?<=(song|title):).+?(?=" + regexKeywords + ")", "gi"));

            // test if every array in fancySearchResults is null
            nothingFancy = Object.values(fancySearchResults).every(value => {
                return value === null;
            });

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

        fancySearchResults = {
            artist: null,
            album: null,
            song: null
        };
    }

    async function doSearch() {
        let s1 = [];
        let s2 = [];
        let s3 = [];
        let s4 = [];
        let s5 = [];
        let rows = [];
        let counter = 0;

        if (nothingFancy) {
            isExact = new RegExp(/^".*"$/gi).test($SearchQuery);
            queryWithoutQuotes = $SearchQuery.replaceAll(/(^"|"$)/ig, '');

            s1 = searchArtists({query: queryWithoutQuotes, page: 0, limit: 6, exact: isExact});
            s2 = searchAlbums({query: queryWithoutQuotes, page: 0, limit: 6, exact: isExact});
            s3 = searchSongs({query: queryWithoutQuotes, page: 0, limit: 9, exact: isExact});
            s4 = searchPlaylists({query: queryWithoutQuotes, page: 0, limit: 6, exact: isExact});
            s5 = searchSmartlists({query: queryWithoutQuotes, page: 0, limit: 6, exact: isExact});
        } else {
            if (fancySearchResults.song) {
                rows.push({
                    field: "title",
                    id: ++counter,
                    input: fancySearchResults.song,
                    inputType: "text",
                    operator: "0",
                    operatorType: "string",
                });

                if (fancySearchResults.artist) {
                    rows.push({
                        field: "artist",
                        id: ++counter,
                        input: fancySearchResults.artist,
                        inputType: "text",
                        operator: "0",
                        operatorType: "string",
                    })
                }

                if (fancySearchResults.album) {
                    rows.push({
                        field: "album",
                        id: ++counter,
                        input: fancySearchResults.album,
                        inputType: "text",
                        operator: "0",
                        operatorType: "string",
                    });
                }

                s3 = getSongsFromAdvancedSearch({rows: rows, limit: 100, random: false, match: "all"});
            } else if (fancySearchResults.album) {
                rows.push({
                    field: "title",
                    id: ++counter,
                    input: fancySearchResults.album,
                    inputType: "text",
                    operator: "0",
                    operatorType: "string",
                });

                if (fancySearchResults.artist) {
                    rows.push({
                        field: "artist",
                        id: ++counter,
                        input: fancySearchResults.artist,
                        inputType: "text",
                        operator: "0",
                        operatorType: "string",
                    })
                }

                s2 = getAlbumsFromAdvancedSearch({rows: rows, limit: 100, random: false, match: "all"});
            } else if (fancySearchResults.artist) {
                rows.push({
                    field: "title",
                    id: ++counter,
                    input: fancySearchResults.artist,
                    inputType: "text",
                    operator: "0",
                    operatorType: "string",
                });

                s1 = getArtistsFromAdvancedSearch({rows: rows, limit: 100, random: false, match: "all"});
            }
        }

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
                    {#if nothingFancy}
                        <CardList type="artist" initialData={initialResults.artists} dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists" />
                    {:else}
                        <Lister2
                            data={initialResults.artists}
                            type="artist"
                            actionData={{
                                type: "artists",
                                data: initialResults.artists
                            }}
                        />
                    {/if}
                {/if}

                {#if initialResults.albums.length > 0}
                    {#if nothingFancy}
                        <CardList type="album" initialData={initialResults.albums} dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums" />
                    {:else}
                        <Lister2
                            data={initialResults.albums}
                            type="album"
                            actionData={{
                                type: "albums",
                                data: initialResults.albums
                            }}
                        />
                    {/if}
                {/if}

                {#if initialResults.songs.length > 0}
                    {#if nothingFancy}
                        <CardList type="song" initialData={initialResults.songs} dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs" />
                    {:else}
                        <Lister2
                            data={initialResults.songs}
                            type="song"
                            actionData={{
                                direct: initialResults.songs
                            }}
                        />
                    {/if}
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