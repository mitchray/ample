<script>
    import { Link } from "svelte-routing";

    import { groupedArtists } from "../stores/server";
    import { SiteMainSpace } from "../stores/player";
    import { ShowArtistType } from "../stores/status";

    import { newestArtists, randomArtists } from "../logic/artist";

    import CardList from '../components/cardList.svelte';
    import ArtistsAll from '../components/artist/artistsAll.svelte';
    import Tabs from "../components/tabs.svelte";
    import ArtistTypeSelector from "../components/artist/artistTypeSelector.svelte";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Recently Updated", value: "recentlyUpdated" },
        { label: "Random",           value: "random" },
        { label: "All",              value: "all" },
    ];

    let currentTab;

    import "/src/css/containerqueries/artists.css";
</script>

{#if $SiteMainSpace.ready}
    <div class="artists-page-wrapper">
        <div class="artists-page-container"
            style="height: {$SiteMainSpace.height}px;"
        >
            <div class="sidebar">
                <div class="sidebar-inner">
                    {#if $groupedArtists}
                        {#each Object.entries($groupedArtists) as [key, value], i}
                            <div class="sidebar-index">{key.toUpperCase()}</div>

                            {#each value as artist}
                                <div class="sidebar-artist">
                                    <Link to="artists/{artist.id}" title="{artist.name}">
                                        {artist.name}
                                    </Link>
                                </div>
                            {/each}
                        {/each}
                    {/if}
                </div>
            </div>

            <div class="main">
                <div class="main-inner">
                    <div class="title">
                        <h1 class="page-title">
                            {#if $ShowArtistType === "album_artist"}
                                Album
                            {/if}
                            Artists</h1>
                        <ArtistTypeSelector />
                    </div>

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
                                        <CardList type="artist" dataProvider={"randomArtists"} limit=18 refresh=true />
                                    </div>
                                {/if}

                                {#if tab.value === 'all'}
                                    <div class="all" style="display: {currentTab === 'all' ? 'block' : 'none'}">
                                        <ArtistsAll />
                                    </div>
                                {/if}
                            {/if}
                        {/each}
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
{/if}

{@html `<style>
    /* override for this page only */
    .site-content-inner {
        padding: 0;
    }
</style>`}

<style>
    .artists-page-wrapper {
        container-name: artists-page-wrapper;
        container-type: inline-size;
    }

    .artists-page-container {
        display: grid;
        grid-template-columns: 1fr;
        overflow: hidden;
    }

    .sidebar,
    .main {
        position: relative;
    }

    .sidebar-inner,
    .main-inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }

    .sidebar {
        display: none;
        border-right: 1px solid var(--color-border);
    }

    .sidebar-inner {
        padding: var(--spacing-md) 0;
    }

    .main-inner {
        padding: var(--spacing-xxl);
    }

    .sidebar-index,
    .sidebar-artist {
        padding: var(--spacing-sm) var(--spacing-lg);
    }

    .sidebar-index {
        font-weight: 700;
        color: var(--color-highlight);
        font-size: 20px;
    }

    .sidebar-artist + .sidebar-index {
        margin-top: var(--spacing-lg);
    }

    .sidebar-index:after {
        content: '';
        display: block;
        border-bottom: 2px solid var(--color-separator);
        padding-top: var(--spacing-sm);
    }

    .sidebar-artist {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>