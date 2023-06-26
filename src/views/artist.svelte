<script>
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import { PageLoadedKey, PageTitle, ShowExpandedAlbums, GroupAlbumsByReleaseType, Theme } from "../stores/status";
    import { serverURL } from "../stores/server";
    import { API } from "../stores/api";

    import { getArtist } from "../logic/artist";
    import { cleanArtURL, formatTotalTime } from "../logic/helper";

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import ArtistCard from '../components/artist/artistCard.svelte';
    import ArtistReleases from '../components/artist/artistReleases.svelte';
    import ArtistSongs from '../components/artist/artistSongs.svelte';
    import Rating from '../components/rating.svelte';
    import Lister from '../components/lister/lister.svelte';
    import MusicbrainzScan from '../components/musicbrainzScan.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';

    import SVGAlbum from "/src/images/album.svg";
    import SVGPopular from "/src/images/trending_up.svg";
    import SVGSongs from "/src/images/songs.svg";
    import SVGSimilar from "/src/images/people.svg";

    export let params = {}

    let artist;
    let theme;
    let loading = true;
    $: theme = $Theme;

    $: if (params.id || $PageLoadedKey)  {
        loadData();
    }

    let title = $_('text.artist');
    $PageTitle = title;

    // List of tab items with labels and values.
    let tabItems = [
        { label: $_('text.releases'),           value: "releases",    icon: SVGAlbum },
        { label: $_('text.popularSongs'),       value: "popular",     icon: SVGPopular },
        { label: $_('text.allSongs'),           value: "all",         icon: SVGSongs },
        { label: $_('text.similarArtists'),     value: "similar",     icon: SVGSimilar },
        { label: $_('text.musicbrainzCompare'), value: "musicbrainz" },
    ];

    // Current active tab
    let currentTab;

    function toggleShowExpanded() {
        let inverted = !$ShowExpandedAlbums;
        localStorage.setItem('ShowExpandedAlbums', JSON.stringify(inverted));
        ShowExpandedAlbums.set(inverted);
    }

    function toggleGroupByReleaseType() {
        let inverted = !$GroupAlbumsByReleaseType;
        localStorage.setItem('GroupAlbumsByReleaseType', JSON.stringify(inverted));
        GroupAlbumsByReleaseType.set(inverted);
    }

    async function loadData() {
        loading = true;
        artist = await getArtist({id: params.id, artAnalysis: true});
        loading = false;
    }
</script>

<svelte:head>
    <title>{`${artist?.name}` || $_('text.loading')} (artist)</title>
</svelte:head>

{#key $PageLoadedKey || 0}
    {#if loading}
        <p>{$_('text.loading')}</p>
    {:else}
        {#if artist?.id}
            <div class="container" in:fade>
                <div class="header">
                    <h1 class="title">{artist.name}</h1>
                    <div class="profile">
                        <div class="art-container">
                            <img class="art"
                                 src="{cleanArtURL(artist.art)}&thumb=32"
                                 alt="Image of {artist.name}"
                                 width="250"
                                 height="250"
                                 data-id="art-artist-{artist.id}"
                                 on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=32' }}
                            />
                        </div>

                        <div class="below-image">
                            <div class="rating">
                                <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />
                            </div>

                            <div class="third-party-links">
                                <ThirdPartyServices data={artist} type="artist" />
                            </div>
                        </div>
                    </div>

                    <div class="details">
                        <div class="meta">
                            {#if artist.albumcount > 0}
                                <div class="entry">
                                    <span class="value">{artist.albumcount}</span>
                                    <span class="field">{$_('text.releasesPlural', { values: { count: parseInt(artist.albumcount) } })}</span>
                                </div>
                            {/if}

                            {#if artist.appearanceCount > 0}
                                <div class="entry">
                                    <span class="value">{artist.appearanceCount}</span>
                                    <span class="field">{$_('text.appearancesPlural', { values: { count: parseInt(artist.appearanceCount) } })}</span>
                                </div>
                            {/if}

                            <div class="entry">
                                <span class="value">{artist.songcount}</span>
                                <span class="field">{$_('text.songsPlural', { values: { count: parseInt(artist.songcount) } })}</span>
                            </div>

                            {#if artist.time > 0}
                                <div class="entry">
                                    <span class="value">{formatTotalTime(artist.time)}</span>
                                    <span class="field">{$_('text.total')}</span>
                                </div>
                            {/if}

                            {#if artist.yearformed}
                                <div class="entry">
                                <span class="value">
                                    <a href="#/albums/year/{artist.yearformed}" title="{artist.yearformed}">
                                        {artist.yearformed}
                                    </a>
                                </span>
                                    <span class="field">{$_('text.yearFormed')}</span>
                                </div>
                            {/if}

                            {#if artist.placeformed}
                                <div class="entry">
                                    <span class="value">{artist.placeformed}</span>
                                    <span class="field">{$_('text.placeFormed')}</span>
                                </div>
                            {/if}
                        </div>

                        <Genres genres="{artist.genre}" />

                        <div class="actions">
                            <Actions
                                    type="artist"
                                    mode="fullButtons"
                                    showShuffle={artist.songcount > 1}
                                    id="{artist.id}"
                            />
                        </div>
                    </div>

                    {#if artist.summary?.replace(/\s/g, "").length > 0}
                        <div class="summary">
                            <p>{artist.summary}</p>
                        </div>
                    {/if}
                </div>
            </div>

            <Tabs bind:activeTabValue={currentTab} bind:items={tabItems} id="artist">
                {#each tabItems as tab}
                    {#if tab.loaded === true}
                        {#if tab.value === 'releases'}
                            <Tab id="releases" class="releases" bind:activeTabValue={currentTab}>
                                <button
                                        class="album-view-toggle button button--regular"
                                        on:click={toggleShowExpanded}
                                >
                                    {$ShowExpandedAlbums ? $_('text.viewCondensed') : $_('text.viewExpanded')}
                                </button>

                                <button
                                        class="group-releases-toggle button button--regular"
                                        on:click={toggleGroupByReleaseType}
                                >
                                    {$GroupAlbumsByReleaseType ? $_('text.showChronologically') : $_('text.showGroupedReleaseType')}
                                </button>

                                <ArtistReleases artistID={artist.id} />
                            </Tab>
                        {/if}

                        {#if tab.value === 'popular'}
                            <Tab id="popular" class="popular" bind:activeTabValue={currentTab}>
                                {#await $API.artistSongs({ filter: params.id, top50: 1, limit: 20 })}
                                    {$_('text.loading')}
                                {:then songs}
                                    {#if songs.length > 0}
                                        <Lister
                                                data={songs}
                                                type="song"
                                                tableOnly={true}
                                                showIndex={true}
                                                actionData={{
                                            type: "",
                                            mode: "fullButtons",
                                            showShuffle: songs.length > 1,
                                            data: Object.create({songs: songs})
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

                        {#if tab.value === 'similar'}
                            <Tab id="similar" class="similar" bind:activeTabValue={currentTab}>
                                {#await $API.getSimilar({ type: "artist", filter: params.id, limit: 15 })}
                                    {$_('text.loading')}
                                {:then artists}
                                    {#if artists.length > 0}
                                        <div class="cardlist-grid artist-grid">
                                            {#each artists as artist}
                                                {#if artist.name}
                                                    <ArtistCard data="{artist}" />
                                                {/if}
                                            {/each}
                                        </div>
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
                                {#if artist.songcount > 0}
                                    <ArtistSongs artistID={artist.id} />
                                {:else}
                                    <p>{$_('text.noItemsFound')}</p>
                                {/if}
                            </Tab>
                        {/if}

                        {#if tab.value === 'musicbrainz'}
                            <Tab id="musicbrainz" class="musicbrainz" bind:activeTabValue={currentTab}>
                                <MusicbrainzScan data={artist} />
                            </Tab>
                        {/if}
                    {/if}
                {/each}
            </Tabs>
        {:else}
            <p>{$_('text.noItemsFound')}</p>
        {/if}
    {/if}
{/key}

<style>
    .container {
        container-name: artist-info-wrapper;
        container-type: inline-size;
    }

    .header {
        position: relative;
        display: grid;
        grid-template-areas:
            "title"
            "profile"
            "details"
            "summary"
        ;
        grid-template-rows: auto auto auto auto;
        gap: var(--spacing-xl);
        padding-block-end: var(--spacing-xxl);
    }
    
    .art-container {
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        font-size: 0;
        position: relative;
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: -1;
    }

    .profile {
        grid-area: profile;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
        max-width: 250px;
        justify-self: center;
    }

    .below-image {
        display: flex;
        justify-content: space-between;
        align-items: start;
        width: 100%;
        flex-wrap: wrap;
        padding-block-start: var(--spacing-md);
    }

    .title {
        grid-area: title;
        --roboto-opsz: 50;
        line-height: 1;
        justify-self: center;
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
        margin-block-end: 0;
    }

    .details {
        grid-area: details;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .meta {
        display: flex;
        flex-direction: row;
        column-gap: var(--spacing-xl);
        row-gap: var(--spacing-lg);
        flex-wrap: wrap;
    }

    .meta .entry {
        display: flex;
        flex-direction: column;
    }

    .meta .field {
        color: var(--color-text-secondary);
        flex-shrink: 0;
    }

    .meta .value {
        font-size: 1.2em;
        font-weight: 500;
        font-stretch: 50%;
    }
    
    .actions {
        display: flex;
        flex-direction: column-reverse;
        gap: var(--spacing-lg);
    }

    .album-view-toggle {
        width: 140px;
        text-align: center;
        display: inline-block;
        margin-block-end: var(--spacing-xl);
    }

    .summary {
        grid-area: summary;
        line-height: 1.5;
    }

    .summary :global(p:first-of-type) {
        margin-block-start: 0;
    }

    @container artist-info-wrapper (min-width: 530px) {
        .header {
            grid-template-areas:
                "profile title"
                "profile details"
                "summary summary"
            ;
            grid-template-rows: auto 1fr auto;
            grid-template-columns: min-content auto;
            column-gap: var(--spacing-xl);
        }

        .title {
            justify-self: unset;
        }
    }

    @container artist-info-wrapper (min-width: 800px) {
        .profile {
            width: 250px;
        }

        .title {
            font-size: 50px;
            font-weight: 200;
        }
    }

    @container artist-info-wrapper (min-width: 1100px) {
        .header {
            grid-template-areas:
                "profile title   title   title"
                "profile details summary SPACER"
                "profile details summary SPACER"
            ;
            grid-template-rows: min-content auto 1fr;
            grid-template-columns: min-content auto auto 1fr;
            column-gap: var(--spacing-xxl);
        }

        .summary {
            max-width: 80ch;
        }
    }
</style>