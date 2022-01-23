<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { ShowExpandedAlbums, Theme } from "../stores/status";

    import { getArtist, similarArtists } from "../logic/artist";
    import { getTopSongsFromArtist } from "../logic/song";
    import { formatTimeToReadable } from "../logic/helper";

    import Tabs from "../components/tabs.svelte";
    import ArtistCard from '../components/artistCard.svelte';
    import ArtistReleases from '../components/artistReleases.svelte';
    import ArtistSongs from '../components/artistSongs.svelte';
    import Rating from '../components/rating.svelte';
    import Lister2 from '../components/lister/lister.svelte';
    import MusicbrainzScan from '../components/musicbrainzScan.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions from '../components/actions.svelte';
    import Genres from '../components/genres.svelte';

    import SVGAlbum from "../../public/images/album.svg";
    import SVGPopular from "../../public/images/trending_up.svg";
    import SVGSongs from "../../public/images/songs.svg";
    import SVGSimilar from "../../public/images/people.svg";
    import SVGArticle from "../../public/images/article.svg";
    import SVGTrack from "../../public/images/music_note.svg";
    import SVGClock from "../../public/images/clock.svg";

    export let id;

    let theme;
    $: theme = $Theme;

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Discography",         value: "discography", icon: SVGAlbum },
        { label: "Popular Songs",       value: "popular",     icon: SVGPopular },
        { label: "All Songs",           value: "all",         icon: SVGSongs },
        { label: "Similar Artists",     value: "similar",     icon: SVGSimilar },
        { label: "Summary",             value: "summary",     icon: SVGArticle },
        { label: "MusicBrainz Compare", value: "musicbrainz" },
    ];

    // Current active tab
    let currentTab;

    function toggleShowExpanded() {
        ShowExpandedAlbums.set(!$ShowExpandedAlbums);
    }
</script>

<svelte:head>
    <link rel="stylesheet" href='/ample/public/css/containerqueries/artist.css'>
</svelte:head>

{#await getArtist(id)}
    <p>Loading artist</p>
{:then artist}
    {#if artist.id}
        <div class="container" in:fade>
            <div class="header">
                <h1 class="title">{artist.name}</h1>

                <div class="profile">
                    <div class="art-container" >
                        <img class="art" src="{artist.art}&thumb=32" alt="Image of {artist.name}" width="240" height="240"  />
                    </div>

                    <div class="rating">
                        <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />
                    </div>
                </div>

                <div class="details">
                    <div class="meta">
                        {#if artist.albumcount > 0}
                            <span><SVGAlbum class="inline"/> {artist.albumcount} {artist.albumcount !== 1 ? 'releases' : 'release'}</span>
                        {/if}

                        {#if artist.appearanceCount > 0}
                            <span><SVGAlbum class="inline"/> {artist.appearanceCount} {artist.appearanceCount !== 1 ? 'appearances' : 'appearance'}</span>
                        {/if}

                        <span><SVGTrack class="inline"/> {artist.songcount} {artist.songcount !== 1 ? 'songs' : 'song'}</span>

                        <span><SVGClock class="inline"/> {formatTimeToReadable(artist.time)}</span>
                    </div>


                    <Genres genres="{artist.genre}" />

                    <div class="actions">
                        <Actions
                            type="artist"
                            mode="fullButtons"
                            id="{artist.id}"
                            count={artist.songcount}
                        />

                        <ThirdPartyServices data={artist} type="artist" />
                    </div>
                </div>
            </div>
        </div>

        <Tabs bind:activeTabValue={currentTab} items={tabItems} class="tabs">
            <div class="discography" style="display: {currentTab === 'discography' ? 'block' : 'none'}">
                <button
                    class="album-view-toggle button button--regular"
                    on:click={toggleShowExpanded}>
                    View {$ShowExpandedAlbums ? 'condensed' : 'expanded'}
                </button>

                <ArtistReleases artistID={artist.id} />
            </div>

            <div style="display: {currentTab === 'popular' ? 'block' : 'none'}">
                {#await getTopSongsFromArtist(id)}
                    Loading popular songs
                {:then songs}
                    {#if songs.length > 0}
                        <Lister2 data={songs} type="song" showIndex={true} />
                    {:else}
                        <p>No songs found</p>
                    {/if}
                {:catch error}
                    <p>An error occurred.</p>
                {/await}
            </div>

            <div style="display: {currentTab === 'similar' ? 'block' : 'none'}">
                {#await similarArtists(id)}
                    Loading similar artists
                {:then artists}
                    {#if artists.length > 0}
                        <div class="artist-grid">
                            {#each artists as artist}
                                {#if artist.name}
                                    <ArtistCard data="{artist}" />
                                {/if}
                            {/each}
                        </div>
                    {:else}
                        <p>No similar artists</p>
                    {/if}
                {:catch error}
                    <p>An error occurred.</p>
                {/await}
            </div>

            <div style="display: {currentTab === 'all' ? 'block' : 'none'}">
                {#if artist.songcount > 0}
                    <ArtistSongs artistID={artist.id} />
                {:else}
                    <p>No songs found</p>
                {/if}
            </div>

            <div style="display: {currentTab === 'summary' ? 'block' : 'none'}">
                {#if artist.summary && artist.summary.replace(/\s/g, "").length > 0}
                    <div class="summary">
                        <p>{artist.summary}</p>
                    </div>
                {:else}
                    <p>No summary found</p>
                {/if}
            </div>

            <div style="display: {currentTab === 'musicbrainz' ? 'block' : 'none'}">
                <MusicbrainzScan data={artist} />
            </div>
        </Tabs>
    {:else}
        <p>Unable to find artist with that ID</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    .container {
        container: inline-size / artist-info-wrapper;
    }

    .header {
        position: relative;
    }
    
    .header:before {
        content: '';
        background-color: var(--color-highlight);
        mask-image: linear-gradient(
                to bottom,
                hsl(0, 0%, 0%) 0%,
                hsla(0, 0%, 0%, 0.738) 19%,
                hsla(0, 0%, 0%, 0.541) 34%,
                hsla(0, 0%, 0%, 0.382) 47%,
                hsla(0, 0%, 0%, 0.278) 56.5%,
                hsla(0, 0%, 0%, 0.194) 65%,
                hsla(0, 0%, 0%, 0.126) 73%,
                hsla(0, 0%, 0%, 0.075) 80.2%,
                hsla(0, 0%, 0%, 0.042) 86.1%,
                hsla(0, 0%, 0%, 0.021) 91%,
                hsla(0, 0%, 0%, 0.008) 95.2%,
                hsla(0, 0%, 0%, 0.002) 98.2%,
                hsla(0, 0%, 0%, 0) 100%
        );
        position: absolute;
        bottom: 0;
        top: calc(-1 * var(--spacing-xxl));
        left: calc(-1 * var(--spacing-xxl));
        right: calc(-1 * var(--spacing-xxl));
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
    }
    
    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        overflow: hidden;
        font-size: 0;
        position: relative;
        box-shadow: var(--shadow-lg);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: -1;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .rating {
        display: inline-block;
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .title {
        line-height: 1;
        text-align: center;
        font-weight: 700;
    }

    .details {
        container: inline-size / artist-details-wrapper;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }
    
    .actions {
        display: flex;
        flex-direction: column-reverse;
    }

    .details:after {
        content: '';
        display: table;
        clear: both;
        padding-bottom: var(--spacing-xxl);
    }

    .album-view-toggle {
        width: 140px;
        text-align: center;
        display: inline-block;
        margin-bottom: var(--spacing-xl);
    }

    .summary {
        max-width: 80ch;
        line-height: 1.5;
    }
</style>