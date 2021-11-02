<script>
    import { fade } from 'svelte/transition';
    import { Link } from 'svelte-routing';

    import { ShowExpandedAlbums, ThemeIsLight } from "../stores/status";

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

    import SVGAlbum from "../../public/images/album.svg";
    import SVGPopular from "../../public/images/trending_up.svg";
    import SVGSongs from "../../public/images/songs.svg";
    import SVGSimilar from "../../public/images/people.svg";
    import SVGArticle from "../../public/images/article.svg";
    import SVGGenre from "../../public/images/label.svg";

    export let id;

    let theme;
    $: theme = $ThemeIsLight ? 'light' : 'dark';

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Discography",         value: "discography", icon: SVGAlbum },
        { label: "Popular songs",       value: "popular",     icon: SVGPopular },
        { label: "All songs",           value: "all",         icon: SVGSongs },
        { label: "Similar artists",     value: "similar",     icon: SVGSimilar },
        { label: "Summary",             value: "summary",     icon: SVGArticle },
        { label: "MusicBrainz compare", value: "musicbrainz" },
    ];

    // Current active tab
    let currentTab;

    function toggleShowExpanded() {
        ShowExpandedAlbums.set(!$ShowExpandedAlbums);
    }
</script>

{#await getArtist(id)}
    <p>Loading artist</p>
{:then artist}
    {#if artist.id}
        {#if artist.useBackground && !$ThemeIsLight}
            <img class="art-background" src="{artist.art}&thumb=10" alt="" loading="lazy" in:fade/>
        {/if}

        <div class="container">
            <img class="art" src="{artist.art}&thumb=32" alt="Image of {artist.name}" width="210" height="210" in:fade/>
            <div class="details">
                <h1 class="title">{artist.name}</h1>
                <p>
                    {#if artist.albumcount > 0}
                        <SVGAlbum class="inline"/> {artist.albumcount} {artist.albumcount !== 1 ? 'releases' : 'release'} &bull;
                    {/if}

                    {#if artist.appearanceCount > 0}
                        <SVGAlbum class="inline"/> {artist.appearanceCount} {artist.appearanceCount !== 1 ? 'appearances' : 'appearance'} &bull;
                    {/if}

                    {artist.songcount} {artist.songcount !== 1 ? 'songs' : 'song'} &bull;
                    {formatTimeToReadable(artist.time)} total
                </p>

                {#if artist.genre.length > 0}
                    <ul class="genres">
                        {#each artist.genre as genre}
                            <li><Link to="genres/{genre.id}"><SVGGenre class="inline" /> {genre.name}</Link></li>
                        {/each}
                    </ul>
                {/if}

                <div class="inline">
                    <Rating type="artist" id="{artist.id}" rating="{artist.rating}" flag="{artist.flag}" averageRating="{artist.averagerating}" />

                    <ThirdPartyServices data={artist} type="artist" />
                </div>

                <Actions
                    type="artist"
                    mode="fullButtons"
                    id="{artist.id}"
                    count={artist.songcount}
                />
            </div>
        </div>

        <Tabs bind:activeTabValue={currentTab} items={tabItems}>
            <div class="discography" style="display: {currentTab === 'discography' ? 'block' : 'none'}">
                <button
                        class="album-view-toggle"
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
        display: flex;
        margin-bottom: var(--spacing-xxl);
    }

    .inline {
        display: flex;
        align-items: center;
        gap: var(--spacing-lg);
        flex-wrap: wrap;
    }

    .art {
        height: 100%;
        border-radius: 999px;
        border: 3px solid var(--color-highlight);
    }

    .details {
        margin-left: var(--spacing-xl);
        margin-bottom: var(--spacing-xl);
    }

    .title {
        text-transform: unset;
        font-size: 40px;
        letter-spacing: -0.02em;
        line-height: 1;
        margin-bottom: 0.2em;
    }

    .genres {
        display: flex;
        gap: var(--spacing-sm) var(--spacing-lg);
        flex-wrap: wrap;
    }

    .discography {
        position: relative;
    }

    .album-view-toggle {
        width: 130px;
        text-align: center;
        display: inline-block;
        margin-bottom: var(--spacing-xl);
    }

    .summary {
        max-width: 80ch;
        line-height: 1.5;
    }
</style>