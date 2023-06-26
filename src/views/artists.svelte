<script>
    import { _ } from 'svelte-i18n';
    import { groupedArtists } from "../stores/server";
    import { PageTitle } from "../stores/status";
    import { newestArtists, randomArtists } from "../logic/artist";
    import Lister from '../components/lister/lister.svelte';
    import ArtistsAll from '../components/artist/artistsAll.svelte';
    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";

    // List of tab items with labels and values.
    let tabItems = [
        { label: $_('text.recentlyUpdated'), value: "recentlyUpdated" },
        { label: $_('text.random'),           value: "random" },
        { label: $_('text.all'),              value: "all" },
    ];

    let currentTab;

    let title = $_('text.artists');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="artists-page-container">
    <div class="sidebar">
        <div class="sidebar-inner">
            {#if $groupedArtists}
                {#each Object.entries($groupedArtists) as [key, value], i}
                    <div class="sidebar-index">{key.toUpperCase()}</div>

                    {#each value as artist}
                        <div class="sidebar-artist">
                            <a href="#/artists/{artist.id}" title="{artist.name}">
                                {artist.name}
                            </a>
                        </div>
                    {/each}
                {/each}
            {/if}
        </div>
    </div>

    <div class="main">
        <div class="main-inner">
            <Tabs bind:activeTabValue={currentTab} bind:items={tabItems} id="artists">
                {#each tabItems as tab}
                    {#if tab.loaded === true}
                        {#if tab.value === 'recentlyUpdated'}
                            <Tab id="recentlyUpdated" class="recentlyUpdated" bind:activeTabValue={currentTab}>
                                {#await newestArtists({limit: 50})}
                                    {$_('text.loading')}
                                {:then artists}
                                    {#if artists.length > 0}
                                        <Lister
                                            data={artists}
                                            type="artist"
                                            virtualList={true}
                                            actionData={{
                                                type: "artists",
                                                mode: "fullButtons",
                                                showShuffle: artists.length > 1,
                                                data: Object.create({artists: artists})
                                            }}
                                        />
                                    {:else}
                                        <p>{$_('text.noItemsFound')}</p>
                                    {/if}
                                {:catch error}
                                    <p>{$_('text.errorGeneric')}</p>
                                {/await}
                            </Tab>
                        {/if}

                        {#if tab.value === 'random'}
                            <Tab id="random" class="random" bind:activeTabValue={currentTab}>
                                {#await randomArtists({limit: 50})}
                                    {$_('text.loading')}
                                {:then artists}
                                    {#if artists.length > 0}
                                        <Lister
                                            data={artists}
                                            type="artist"
                                            virtualList={true}
                                            actionData={{
                                                type: "artists",
                                                mode: "fullButtons",
                                                showShuffle: artists.length > 1,
                                                data: Object.create({artists: artists})
                                            }}
                                        />
                                    {:else}
                                        <p>{$_('text.noItemsFound')}</p>
                                    {/if}
                                {:catch error}
                                    <p>{$_('text.errorGeneric')}</p>
                                {/await}
                            </Tab>
                        {/if}

                        {#if tab.value === 'all'}
                            <Tab id="all" class="all" bind:activeTabValue={currentTab}>
                                <ArtistsAll />
                            </Tab>
                        {/if}
                    {/if}
                {/each}
            </Tabs>
        </div>
    </div>
</div>

{@html `<style>
    /* override for this page only */
    .site-content-inner {
        padding: 0;
    }
</style>`}

<style>
    .artists-page-container {
        display: grid;
        grid-template-columns: 1fr;
        overflow: hidden;
        grid-column: full;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
    }

    .sidebar,
    .main {
        position: relative;
    }

    .sidebar-inner,
    .main-inner {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow: auto;
    }

    .sidebar {
        display: none;
        border-inline-end: 1px solid var(--color-border);
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
        margin-block-start: var(--spacing-lg);
    }

    .sidebar-index:after {
        content: '';
        display: block;
        border-block-end: 2px solid var(--color-separator);
        padding-block-start: var(--spacing-sm);
    }

    .sidebar-artist {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    @container site-content-inner (min-width: 900px) {
        .artists-page-container {
            grid-template-columns: 200px 1fr !important;
        }

        .sidebar {
            display: block !important;
        }
    }
</style>