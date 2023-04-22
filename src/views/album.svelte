<script>
    import { Link } from 'svelte-routing';
    import { Theme } from '../stores/status';
    import { serverURL } from "../stores/server";
    import { getAlbum } from "../logic/album";
    import { formatTotalTime } from "../logic/helper";
    import MusicBrainz from "../logic/musicbrainz";

    import Rating from '../components/rating.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import Actions2 from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGYear from "/src/images/year.svg";
    import SVGTrack from "/src/images/music_note.svg";
    import SVGClock from "/src/images/clock.svg";

    export let id;

    let mb = new MusicBrainz;
    let hash;
    let theme;

    $: theme = $Theme;
    $: if (id) {
        loadData();
    }

    let album;

    async function loadData() {
        album = await getAlbum({id: id, withTracks: true, artAnalysis: true});
        hash = Date.now().toString();

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

<svelte:window on:hashchange={loadData}/>

{#key hash || 0}
    {#if album?.id}
        <div class="wrapper">
            <div class="container">
                <div class="details-container">
                    <div class="details">
                        <div class="cover-rating">
                            <div class="art-container">
                                <img class="art"
                                     src="{album.art}&thumb=32"
                                     alt="Image of {album.name}"
                                     width="384"
                                     height="384"
                                     data-id="art-album-{album.id}"
                                     on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=32' }}
                                />
                            </div>

                            <div class="rating">
                                <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}" />
                            </div>
                        </div>

                        <div class="info">
                            <div class="name">
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
                                <span class="date"><Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link></span>
                                <span><SVGClock class="inline"/> {formatTotalTime(album.time)}</span>
                                <span><SVGTrack class="inline"/> {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}</span>
                                <ThirdPartyServices data={album} type="album" />
                            </div>

                            <Genres genres="{album.genre}" />
                        </div>
                    </div>
                </div>
                <div class="songs-container">
                    <div class="songs">
                        {#each [...album.ampleSongs] as [key, value]}
                            {@const subtitle = (album.discsubtitles.length > 0) ? album.discsubtitles.find((disc) => disc.position === key).title : null}
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
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <p>Loading album</p>
    {/if}
{/key}

<style>
    .wrapper {
        container-name: album-page-wrapper;
        container-type: size;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .container {
        height: 100%;
        width: 100%;
        position: absolute;
        overflow: auto;
    }

    .details-container,
    .songs-container {
        overflow: auto;
        height: auto;
        padding: var(--spacing-xxl);
    }

    .container {
        container-name: album-wrapper;
        container-type: inline-size;
    }

    .details-container {
        container-name: album-details-wrapper;
        container-type: inline-size;
        padding-bottom: 0;
        background-color: var(--color-interface-secondary);
    }

    .details {
        margin-bottom: var(--spacing-xl);
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: var(--shadow-lg);
        font-size: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
    }

    .art {
        object-fit: cover;
        width: 100%;
        height: 100%;
        position: relative;
    }

    .rating {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .name {
        margin-bottom: var(--spacing-lg);
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        margin-bottom: var(--spacing-sm);
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md) var(--spacing-lg);
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    @container album-details-wrapper (min-width: 500px) {
        .details {
            display: flex;
            gap: var(--spacing-xl);
            margin-bottom: 0;
            padding: unset;
        }

        .details,
        .name {
            background-color: unset;
            box-shadow: unset;
        }

        .name {
            padding: unset;
        }

        .title {
            text-align: left;
        }

        .artist {
            text-align: left;
        }

        .art-container {
            max-width: 180px;
        }
    }

    @container album-details-wrapper (min-width: 800px) {
        .title {
            font-size: 40px;
            font-weight: 200;
        }

        .art-container {
            max-width: 240px;
        }
    }

    @container album-page-wrapper (min-width: 1200px) {
        .wrapper > .container {
            display: flex;
            overflow: hidden;
        }

        .details-container {
            width: 400px;
            padding-right: var(--spacing-xl);
            flex-shrink: 0;
        }

        .songs-container {
            flex: 1;
        }
    }
</style>