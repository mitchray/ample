<script>
    import { Link } from 'svelte-routing';

    import { getSong } from '../logic/song';
    import { formatTotalTime, formatSongQuality, formatFilesize } from '../logic/helper';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';
    import Genres from '../components/genre/genres.svelte';
    import ThirdPartyServices from '../components/thirdPartyServices.svelte';

    export let id;
</script>

{#await getSong(id)}
    <p>Loading song</p>
{:then data}
    {#each data as song}
        {#if song.id}
            <h1>{song.title}</h1>

            <div class="meta">
                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />
                <ThirdPartyServices data={song} type="song" />
            </div>

            <Genres genres="{song.genre}" />

            <Actions
                type="song"
                mode="fullButtons"
                id="{song.id}"
                count=1
            />

            <div class="grid">
                <span class="field"></span> <span></span>
                {#if song.artist.name}
                    <span class="field">Song Artist</span> <span><Link to="artists/{song.artist.id}">{song.artist.name}</Link></span>
                {/if}

                {#if song.albumartist.name}
                    <span class="field">Album Artist</span> <span><Link to="artists/{song.albumartist.id}">{song.albumartist.name}</Link></span>
                {/if}

                {#if song.album.name}
                    <span class="field">Album</span> <span><Link to="albums/{song.album.id}">{song.album.name}</Link></span>
                {/if}

                {#if song.track}
                    <span class="field">Track</span> <span>{song.track}</span>
                {/if}

                {#if song.disk}
                    <span class="field">Disk</span> <span>{song.disk}</span>
                {/if}

                {#if song.year}
                    <span class="field">Year</span> <span>{song.year}</span>
                {/if}

                {#if song.time}
                    <span class="field">Length</span> <span>{formatTotalTime(song.time)}</span>
                {/if}

                {#if song.playcount}
                    <span class="field">Play Count</span> <span>{song.playcount}</span>
                {/if}

                {#if song.filename}
                    <span class="field">Filename</span> <span>{song.filename}</span>
                {/if}

                {#if song.bitrate}
                    <span class="field">Quality</span> <span>{formatSongQuality(song)}</span>
                {/if}

                {#if song.size}
                    <span class="field">Size</span> <span>{formatFilesize(song.size)}</span>
                {/if}

                {#if song.replaygain_album_gain}
                    <span class="field">ReplayGain Album Gain</span> <span>{song.replaygain_album_gain}</span>
                {/if}

                {#if song.replaygain_album_peak}
                    <span class="field">ReplayGain Album Peak</span> <span>{song.replaygain_album_peak}</span>
                {/if}

                {#if song.replaygain_track_gain}
                    <span class="field">ReplayGain Track Gain</span> <span>{song.replaygain_track_gain}</span>
                {/if}

                {#if song.replaygain_track_peak}
                    <span class="field">ReplayGain Trach Peak</span> <span>{song.replaygain_track_peak}</span>
                {/if}

                {#if song.r128_album_gain}
                    <span class="field">EBU R128 Album Gain</span> <span>{song.r128_album_gain}</span>
                {/if}

                {#if song.r128_track_gain}
                    <span class="field">EBU R128 Track Gain</span> <span>{song.r128_track_gain}</span>
                {/if}

                {#if song.language}
                    <span class="field">Language</span> <span>{song.language}</span>
                {/if}

                {#if song.mbid}
                    <span class="field">MusicBrainz ID</span>
                    <span>
                        <a target="_blank" href="https://musicbrainz.org/recording/{song.mbid}">
                            {song.mbid}
                        </a>
                    </span>
                {/if}

                {#if song.album_mbid}
                    <span class="field">Album MBID</span>
                    <span>
                        <a target="_blank" href="https://musicbrainz.org/release/{song.album_mbid}">
                            {song.album_mbid}
                        </a>
                    </span>
                {/if}

                {#if song.artist_mbid}
                    <span class="field">Artist MBID</span>
                    <span>
                        <a target="_blank" href="https://musicbrainz.org/artist/{song.artist_mbid}">
                            {song.artist_mbid}
                        </a>
                    </span>
                {/if}

                {#if song.albumartist_mbid}
                    <span class="field">Album Artist MBID</span>
                    <span>
                        <a target="_blank" href="https://musicbrainz.org/artist/{song.albumartist_mbid}">
                            {song.albumartist_mbid}
                        </a>
                    </span>
                {/if}

                {#if song.license}
                    <span class="field">License</span> <span>{song.license}</span>
                {/if}

                {#if song.publisher}
                    <span class="field">Publisher</span> <span>{song.publisher}</span>
                {/if}
            </div>
        {:else}
            <p>Unable to find song with that ID</p>
        {/if}
    {/each}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    .meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xl);
    }

    .grid {
        margin-top: var(--spacing-xxl);
        margin-bottom: var(--spacing-md);
        display: grid;
        grid-template-columns: minmax(80px, 130px) auto;
        gap: var(--spacing-lg);
        grid-auto-rows: auto;
    }

    .field {
        opacity: 0.6;
        text-align: right;
        /*margin-right: var(--spacing-sm);*/
    }

    .field + span {
        /*background-color: lime;*/
    }
</style>