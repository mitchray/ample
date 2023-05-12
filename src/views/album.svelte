<script>
    import { Link } from 'svelte-routing';
    import { PageLoadedKey, PageTitle, Theme } from '../stores/status';
    import { serverURL } from "../stores/server";
    import { getAlbum } from "../logic/album";
    import { cleanArtURL, formatTotalTime } from "../logic/helper";
    import MusicBrainz from "../logic/musicbrainz";

    import Rating from '../components/rating.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions2 from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';
    import Lister2 from '../components/lister/lister.svelte';
    import AlbumsAround from '../components/album/albumsAround.svelte';

    export let id;

    let mb = new MusicBrainz;
    let theme;

    $: theme = $Theme;
    $: if (id || $PageLoadedKey) {
        loadData();
    }

    $PageTitle = "Album";

    let album;

    async function loadData() {
        album = await getAlbum({id: id, withTracks: true, artAnalysis: true});

        album.discsubtitles = [];

        if (mb.hasMBID(album)) {
            album.discsubtitles = await loadMBData(album.mbid);
        }
    }

    async function loadMBData(mbid) {
        let queryURL = `https://musicbrainz.org/ws/2/release/${mbid}?inc=discids&fmt=json`;

        return await fetch(queryURL, {
            method  : 'GET',
            headers : mb.headers
        })
            .then(response => response.json())
            .then(data => {
                return data.media;
            })
            .catch(err => {
                console.log("Error Reading data " + err);
                return err;
            });
    }
</script>

<svelte:head>
    <title>{`${album?.name} by ${album?.artist?.name}` || 'Loading'} (album)</title>
</svelte:head>

{#key $PageLoadedKey || 0}
    {#if album?.id}
        <div class="page-wrapper">
            <div class="details-container">
                <div class="details">
                    <div class="cover-rating">
                        <div class="art-container">
                            <img class="art"
                                 src="{cleanArtURL(album.art)}&thumb=32"
                                 alt="Image of {album.name}"
                                 width="384"
                                 height="384"
                                 data-id="art-album-{album.id}"
                                 on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=32' }}
                            />
                        </div>

                        <div class="below-image">
                            <div class="rating">
                                <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}" />
                            </div>

                            <div class="third-party-links">
                                <ThirdPartyServices data={album} type="album" />
                            </div>
                        </div>
                    </div>

                    <div class="info">
                        <div class="name">
                            {#if album.type}
                                <div class="release-type-label">
                                    {album.type}
                                </div>
                            {/if}
                            <h1 class="title">{album.name}</h1>
                            <div class="artist">
                                <Link to="artists/{album.artist.id}">{album.artist.name}</Link>
                            </div>
                        </div>

                        <Actions2
                                type="album"
                                mode="fullButtons"
                                id="{album.id}"
                                showShuffle={album.songcount > 1}
                                data={Object.create({artist: album.artist})}
                        />

                        <div class="meta">
                            <div class="entry">
                                <span class="value"><Link to="albums/year/{album.year}" title="{album.year}">{album.year}</Link></span>
                                <span class="field">Year</span>
                            </div>

                            {#if album.diskcount > 1}
                                <div class="entry">
                                    <span class="value">{album.diskcount}</span>
                                    <span class="field">{album.diskcount !== 1 ? 'Discs' : 'Disc'}</span>
                                </div>
                            {/if}

                            <div class="entry">
                                <span class="value">{album.songcount}</span>
                                <span class="field">{album.songcount !== 1 ? 'Songs' : 'Song'}</span>
                            </div>

                            <div class="entry">
                                <span class="value">{formatTotalTime(album.time)}</span>
                                <span class="field">Length</span>
                            </div>
                        </div>

                        <Genres genres="{album.genre}" />
                    </div>
                </div>
            </div>
            <div class="songs-container">
                <div class="songs page-main">
                    {#each [...album.ampleSongs] as [key, value]}
                        {@const subtitle = (album.discsubtitles.length > 0) ? album.discsubtitles.find((disc) => disc.position === key).title : null}
                        <section>
                            <Lister2
                                    data={value}
                                    type="song"
                                    tableOnly={true}
                                    zone="album-contents"
                                    showArtist={album.artist.name === "Various Artists"}
                                    showArt={false}
                                    discSubtitle={subtitle}
                                    actionData={{
                                    disable: [...album.ampleSongs].length < 2,
                                    type: "album",
                                    id: album.id,
                                    mode: "miniButtons",
                                    showShuffle: value.length > 1,
                                    data: Object.create({songs: value})
                                }}
                            />
                        </section>
                    {/each}
                </div>

                <div class="albums-around-time">
                    <AlbumsAround album={album} />
                </div>
            </div>
        </div>
    {:else}
        <p>Loading album</p>
    {/if}
{/key}

<style>
    .page-wrapper {
        display: grid;
        gap: var(--spacing-xxl);
    }

    .details-container {
        container-name: album-details-wrapper;
        container-type: inline-size;
    }

    .details {
        display: grid;
        gap: var(--spacing-xl);
        grid-template-areas:
            "image"
            "info"
        ;
    }

    .info {
        grid-area: info;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .cover-rating {
        grid-area: image;
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
        padding-top: var(--spacing-md);
    }

    .art-container {
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        font-size: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .name {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: start;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        margin-bottom: 0;
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
        text-wrap: balance;
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

    section:not(:first-of-type) {
        margin-top: var(--spacing-xxxl);
    }

    @container album-details-wrapper (min-width: 530px) {
        .details {
            grid-template-areas:
                "image info"
            ;
            grid-template-columns: min-content 1fr;
        }
    }

    @container album-details-wrapper (min-width: 800px) {
        .title {
            font-size: 40px;
            font-weight: 200;
        }

        .cover-rating {
            width: 250px;
        }
    }

    @container site-content-inner (min-width: 1400px) {
        .page-wrapper {
            grid-template-columns: 400px 1fr;
            grid-template-rows: 1fr;
            min-height: 0;
            overflow: hidden;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0;
            grid-column: full;
            gap: 0;
        }

        .details-container,
        .songs-container {
            padding: var(--spacing-xxl);
            overflow: auto;
        }
    }
</style>