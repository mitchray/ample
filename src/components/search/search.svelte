<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Fuse from "fuse.js";
    import { SearchQuery, ShowSearch, User } from "~/stores/state.js";
    import Portal from "~/components/portal.svelte";
    import { SiteContentBind } from "~/stores/elements.js";
    import { searchArtists } from "~/logic/artist.js";
    import { searchAlbums } from "~/logic/album.js";
    import { searchSongs } from "~/logic/song.js";
    import { searchPlaylists, searchSmartlists } from "~/logic/playlist.js";
    import CardList from "~/components/cards/cardList.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";
    import SearchInput from "~/components/search/search_input.svelte";

    let drawer = $state();
    let results = $state({});
    let searching = $state(false);
    let minimumChars = 3;

    // List of tab items with labels and values.
    let tabs = [
        { id: "all", label: $_("text.all") },
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
        { id: "playlists", label: $_("text.playlists") },
        { id: "smartlists", label: $_("text.smartlists") },
    ];

    // Current active tab
    let currentTab = $state("all");

    function handleClose(event) {
        // ignore bubbled sl-hide events from other components
        if (event.target === drawer) {
            ShowSearch.set(false);
        }
    }

    function changeTab(e) {
        currentTab = e.detail.name;
    }

    function resetResults() {
        results = {
            artists: [],
            albums: [],
            songs: [],
            playlists: [],
            smartlists: [],
        };
    }

    async function doSearch() {
        if ($User.isLoggedIn) {
            searching = true;

            let sArtists = [];
            let sAlbums = [];
            let sSongs = [];
            let sPlaylists = [];
            let sSmartlists = [];

            sArtists = searchArtists({
                query: $SearchQuery,
                page: 0,
                limit: 50,
            }).then((response) => {
                return response.artist;
            });
            sAlbums = searchAlbums({
                query: $SearchQuery,
                page: 0,
                limit: 50,
            }).then((response) => {
                return response.album;
            });
            sSongs = searchSongs({
                query: $SearchQuery,
                page: 0,
                limit: 100,
            }).then((response) => {
                return response.song;
            });
            sPlaylists = searchPlaylists({
                query: $SearchQuery,
                page: 0,
                limit: 50,
            }).then((response) => {
                return response.playlist;
            });
            sSmartlists = searchSmartlists({
                query: $SearchQuery,
                page: 0,
                limit: 50,
            }).then((response) => {
                return response.playlist;
            });

            [
                results.artists,
                results.albums,
                results.songs,
                results.playlists,
                results.smartlists,
            ] = await Promise.all([
                sArtists,
                sAlbums,
                sSongs,
                sPlaylists,
                sSmartlists,
            ]);

            const fuseOptions = {
                keys: ["name", "title"],
            };

            results.songs = new Fuse(results.songs, fuseOptions)
                .search($SearchQuery)
                .map((obj) => obj.item);

            results.albums = new Fuse(results.albums, fuseOptions)
                .search($SearchQuery)
                .map((obj) => obj.item);

            results.artists = new Fuse(results.artists, fuseOptions)
                .search($SearchQuery)
                .map((obj) => obj.item);

            results.playlists = new Fuse(results.playlists, fuseOptions)
                .search($SearchQuery)
                .map((obj) => obj.item);

            results.smartlists = new Fuse(results.smartlists, fuseOptions)
                .search($SearchQuery)
                .map((obj) => obj.item);

            searching = false;
        }
    }

    $effect.pre(() => {
        $ShowSearch ? drawer?.show() : drawer?.hide();
    });

    $effect.pre(() => {
        if ($SearchQuery?.length >= minimumChars) {
            resetResults();
            doSearch();
        } else {
            resetResults();
        }
    });
</script>

{#if $SiteContentBind}
    <Portal target={$SiteContentBind}>
        <sl-drawer
            placement="start"
            bind:this={drawer}
            onsl-hide={handleClose}
            onsl-initial-focus={(e) => e.preventDefault()}
            contained
        >
            <div slot="label">
                <div class="header-inner">
                    <SearchInput />

                    {#if $SearchQuery.length > 0 && $SearchQuery.length < minimumChars}
                        &nbsp;
                        <sl-badge variant="warning">
                            {minimumChars} character minimum
                        </sl-badge>
                    {/if}

                    {#if searching}
                        &nbsp;
                        <sl-spinner></sl-spinner>
                    {/if}
                </div>
            </div>

            <div class="results">
                <sl-tab-group onsl-tab-show={changeTab}>
                    {#each tabs as tab}
                        <sl-tab
                            slot="nav"
                            panel={tab.id}
                            active={tab.id === currentTab}
                        >
                            {tab.label}

                            {#if tab.id === "artists" && results.artists.length > 0}
                                &nbsp;
                                <sl-badge pill>
                                    {results.artists.length}
                                </sl-badge>
                            {/if}

                            {#if tab.id === "albums" && results.albums.length > 0}
                                &nbsp;
                                <sl-badge pill>
                                    {results.albums.length}
                                </sl-badge>
                            {/if}

                            {#if tab.id === "songs" && results.songs.length > 0}
                                &nbsp;
                                <sl-badge pill>
                                    {results.songs.length}
                                </sl-badge>
                            {/if}

                            {#if tab.id === "playlists" && results.playlists.length > 0}
                                &nbsp;
                                <sl-badge pill>
                                    {results.playlists.length}
                                </sl-badge>
                            {/if}

                            {#if tab.id === "smartlists" && results.smartlists.length > 0}
                                &nbsp;
                                <sl-badge pill>
                                    {results.smartlists.length}
                                </sl-badge>
                            {/if}
                        </sl-tab>
                    {/each}

                    <sl-tab-panel name="all">
                        {#if results.artists?.length > 0}
                            <section>
                                <CardList
                                    type="artist"
                                    card={GenericCard}
                                    genericOverride={true}
                                    initialData={results.artists}
                                    heading={$_("text.artists")}
                                    showOnlyThese={true}
                                    layout="grid"
                                />
                            </section>
                        {/if}

                        {#if results.albums?.length > 0}
                            <section>
                                <CardList
                                    type="album"
                                    card={GenericCard}
                                    genericOverride={true}
                                    initialData={results.albums}
                                    heading={$_("text.albums")}
                                    showOnlyThese={true}
                                    layout="grid"
                                />
                            </section>
                        {/if}

                        {#if results.songs?.length > 0}
                            <section>
                                <CardList
                                    type="song"
                                    card={GenericCard}
                                    genericOverride={true}
                                    initialData={results.songs}
                                    heading={$_("text.songs")}
                                    showOnlyThese={true}
                                    layout="grid"
                                />
                            </section>
                        {/if}

                        {#if results.playlists?.length > 0}
                            <section>
                                <CardList
                                    type="playlist"
                                    card={GenericCard}
                                    genericOverride={true}
                                    initialData={results.playlists}
                                    heading={$_("text.playlists")}
                                    showOnlyThese={true}
                                    layout="grid"
                                />
                            </section>
                        {/if}

                        {#if results.smartlists?.length > 0}
                            <section>
                                <CardList
                                    type="smartlist"
                                    card={GenericCard}
                                    genericOverride={true}
                                    initialData={results.smartlists}
                                    heading={$_("text.smartlists")}
                                    showOnlyThese={true}
                                    layout="grid"
                                />
                            </section>
                        {/if}
                    </sl-tab-panel>

                    <sl-tab-panel name="songs">
                        {#if results.songs?.length > 0}
                            <CardList
                                type="song"
                                card={GenericCard}
                                genericOverride={true}
                                initialData={results.songs}
                                showOnlyThese={true}
                                layout="grid"
                            />
                        {/if}
                    </sl-tab-panel>

                    <sl-tab-panel name="albums">
                        {#if results.albums?.length > 0}
                            <CardList
                                type="album"
                                card={GenericCard}
                                genericOverride={true}
                                initialData={results.albums}
                                showOnlyThese={true}
                                layout="grid"
                            />
                        {/if}
                    </sl-tab-panel>

                    <sl-tab-panel name="artists">
                        {#if results.artists?.length > 0}
                            <CardList
                                type="artist"
                                card={GenericCard}
                                genericOverride={true}
                                initialData={results.artists}
                                showOnlyThese={true}
                                layout="grid"
                            />
                        {/if}
                    </sl-tab-panel>

                    <sl-tab-panel name="playlists">
                        {#if results.playlists?.length > 0}
                            <CardList
                                type="playlist"
                                card={GenericCard}
                                genericOverride={true}
                                initialData={results.playlists}
                                showOnlyThese={true}
                                layout="grid"
                            />
                        {/if}
                    </sl-tab-panel>

                    <sl-tab-panel name="smartlists">
                        {#if results.smartlists?.length > 0}
                            <CardList
                                type="smartlist"
                                card={GenericCard}
                                genericOverride={true}
                                initialData={results.smartlists}
                                showOnlyThese={true}
                                layout="grid"
                            />
                        {/if}
                    </sl-tab-panel>
                </sl-tab-group>
            </div>
        </sl-drawer>
    </Portal>
{/if}

<style>
    sl-drawer::part(base) {
        z-index: 100;
    }

    sl-drawer::part(panel) {
        min-height: 100%;
        width: 100%;
    }

    /* always show the footer, though empty */
    sl-drawer::part(footer) {
        display: block;
    }

    section + section {
        margin-top: var(--spacing-xxl);
    }

    .header-inner {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
    }
</style>
