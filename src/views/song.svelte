<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import { formatTotalTime, formatSongQuality, formatFilesize } from '../logic/helper';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/action/actions.svelte';
    import Genres from '../components/genre/genres.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';
    import ArtistList from '../components/artist/artistList.svelte';

    export let params;

    let song;

    let title = $_('text.song');
    $PageTitle = title;

    $: if (params.id) {
        loadData();
    }

    async function loadData() {
        song = await $API.song({ filter: params.id });
    }
</script>

<svelte:head>
    <title>{`${song?.title} by ${song?.artist?.name}` || $_('text.loading')} (song)</title>
</svelte:head>

{#key params.id || 0}
    {#if song?.id}
        <div class="info">
            <h1 class="title">{song.title}</h1>

            <div class="meta">
                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />
                <ThirdPartyServices data={song} type="song" />
            </div>

            <Genres genres="{song.genre}" />

            <Actions
                type="song"
                mode="fullButtons"
                id="{song.id}"
            />
        </div>

        <div class="grid page-main">
            <span class="field"></span> <span></span>
            {#if song.artists?.length > 1}
                <span class="field">{$_('text.songArtists')}</span> <span><ArtistList artists={song.artists} /></span>
            {:else if song.artist.name}
                <span class="field">{$_('text.songArtist')}</span> <span><a href="#/artists/{song.artist.id}">{song.artist.name}</a></span>
            {/if}

            {#if song.albumartist.name}
                <span class="field">{$_('text.albumArtist')}</span> <span><a href="#/artists/{song.albumartist.id}">{song.albumartist.name}</a></span>
            {/if}

            {#if song.album.name}
                <span class="field">{$_('text.album')}</span> <span><a href="#/albums/{song.album.id}">{song.album.name}</a></span>
            {/if}

            {#if song.track}
                <span class="field">{$_('text.track')}</span> <span>{song.track}</span>
            {/if}

            {#if song.disk}
                <span class="field">{$_('text.disk')}</span> <span>{song.disk}</span>
            {/if}

            {#if song.year}
                <span class="field">{$_('text.year')}</span> <span>{song.year}</span>
            {/if}

            {#if song.time}
                <span class="field">{$_('text.length')}</span> <span>{formatTotalTime(song.time)}</span>
            {/if}

            {#if song.playcount}
                <span class="field">{$_('text.plays')}</span> <span>{song.playcount}</span>
            {/if}

            {#if song.filename}
                <span class="field">{$_('text.filename')}</span> <span>{song.filename}</span>
            {/if}

            {#if song.bitrate}
                <span class="field">{$_('text.quality')}</span> <span>{formatSongQuality(song)}</span>
            {/if}

            {#if song.size}
                <span class="field">{$_('text.size')}</span> <span>{formatFilesize(song.size)}</span>
            {/if}

            {#if song.replaygain_album_gain}
                <span class="field">{$_('text.replaygainAlbumGain')}</span> <span>{song.replaygain_album_gain}</span>
            {/if}

            {#if song.replaygain_album_peak}
                <span class="field">{$_('text.replaygainAlbumPeak')}</span> <span>{song.replaygain_album_peak}</span>
            {/if}

            {#if song.replaygain_track_gain}
                <span class="field">{$_('text.replaygainTrackGain')}</span> <span>{song.replaygain_track_gain}</span>
            {/if}

            {#if song.replaygain_track_peak}
                <span class="field">{$_('text.replaygainTrackPeak')}</span> <span>{song.replaygain_track_peak}</span>
            {/if}

            {#if song.r128_album_gain}
                <span class="field">{$_('text.r128AlbumGain')}</span> <span>{song.r128_album_gain}</span>
            {/if}

            {#if song.r128_track_gain}
                <span class="field">{$_('text.r128TrackGain')}</span> <span>{song.r128_track_gain}</span>
            {/if}

            {#if song.language}
                <span class="field">{$_('text.language')}</span> <span>{song.language}</span>
            {/if}

            {#if song.mbid}
                <span class="field">{$_('text.musicbrainzID')}</span>
                <span>
                <a target="_blank" href="https://musicbrainz.org/recording/{song.mbid}">
                    {song.mbid}
                </a>
            </span>
            {/if}

            {#if song.license}
                <span class="field">{$_('text.license')}</span> <span>{song.license}</span>
            {/if}

            {#if song.publisher}
                <span class="field">{$_('text.publisher')}</span> <span>{song.publisher}</span>
            {/if}

            {#if song.lyrics}
                <span class="field">{$_('text.lyrics')}</span> <span>{@html song.lyrics}</span>
            {/if}
        </div>
    {:else}
        <p>{$_('text.loading')}</p>
    {/if}
{/key}

<style>
    .title {
        margin-block-end: 0;
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xl);
    }

    .grid {
        margin-block-start: var(--spacing-xxl);
        margin-block-end: var(--spacing-md);
        display: grid;
        grid-template-columns: minmax(80px, 130px) auto;
        gap: var(--spacing-lg);
        grid-auto-rows: auto;
    }

    .field {
        opacity: 0.6;
        text-align: end;
    }
</style>