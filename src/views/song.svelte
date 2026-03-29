<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import {
        formatFilesize,
        formatSongQuality,
        formatTotalTime,
    } from "~/logic/formatters.js";
    import Rating from "~/components/rating/rating.svelte";
    import Actions from "~/components/action/actions.svelte";
    import GenreList from "~/components/genreList.svelte";
    import ThirdPartyServices from "~/components/thirdPartyServices.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import DOMPurify from "dompurify";

    let { params = {} } = $props();

    const query = createQuery(() => ({
        queryKey: ["song", params.id],
        queryFn: async () => {
            let result = await $API.song({ filter: params.id });

            if (result.error) {
                errorHandler("getting song", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let song = $derived(query.data || {});

    $effect(() => {
        $PageTitle = song?.name || $_("text.song");
    });
</script>

<QueryError {query} />

{#if query.isSuccess && song.id}
    {#key song.id}
            <div class="info">
                <h1 class="title">{$PageTitle}</h1>

                <div class="meta">
                    <Rating type="song" data={song} />
                    <ThirdPartyServices data={song} type="song" />
                </div>

                <GenreList items={song.genre} limit={5} />

                <Actions type="song" displayMode="fullButtons" items={[song]} />
            </div>

            <sl-tab-group>
                <sl-tab slot="nav" panel="info">
                    {$_("text.information")}
                </sl-tab>
                <sl-tab slot="nav" panel="lyrics">{$_("text.lyrics")}</sl-tab>

                <sl-tab-panel name="info">
                    <div class="grid">
                        {#if song.artists?.length > 1}
                            <span class="field">
                                {$_("text.songArtists")}
                            </span>
                            <span>
                                <ArtistList data={song} />
                            </span>
                        {:else if song.artist?.name && song.artist?.id}
                            <span class="field">
                                {$_("text.songArtist")}
                            </span>
                            <span>
                                <a href="#/artist/{song.artist.id}">
                                    {song.artist.name}
                                </a>
                            </span>
                        {/if}

                        {#if song.albumartist?.name}
                            <span class="field">
                                {$_("text.albumArtist")}
                            </span>
                            <span>
                                <a href="#/artist/{song.albumartist.id}">
                                    {song.albumartist.name}
                                </a>
                            </span>
                        {/if}

                        {#if song.album?.name}
                            <span class="field">{$_("text.album")}</span>
                            <span>
                                <a href="#/album/{song.album.id}">
                                    {song.album.name}
                                </a>
                            </span>
                        {/if}

                        {#if song.track}
                            <span class="field">{$_("text.track")}</span>
                            <span>{song.track}</span>
                        {/if}

                        {#if song.disk}
                            <span class="field">{$_("text.disk")}</span>
                            <span>{song.disk}</span>
                        {/if}

                        {#if song.year}
                            <span class="field">{$_("text.year")}</span>
                            <span>{song.year}</span>
                        {/if}

                        {#if song.time}
                            <span class="field">{$_("text.length")}</span>
                            <span>{formatTotalTime(song.time)}</span>
                        {/if}

                        {#if song.playcount}
                            <span class="field">{$_("text.plays")}</span>
                            <span>{song.playcount}</span>
                        {/if}

                        {#if song.filename}
                            <span class="field">{$_("text.filename")}</span>
                            <span>{song.filename}</span>
                        {/if}

                        {#if song.bitrate}
                            <span class="field">{$_("text.quality")}</span>
                            <span>{formatSongQuality(song)}</span>
                        {/if}

                        {#if song.size}
                            <span class="field">{$_("text.size")}</span>
                            <span>{formatFilesize(song.size)}</span>
                        {/if}

                        {#if (song.replaygain_album_gain ?? null) !== null}
                            <span class="field">
                                {$_("text.replaygainAlbumGain")}
                            </span>
                            <span>{song.replaygain_album_gain}</span>
                        {/if}

                        {#if (song.replaygain_album_peak ?? null) !== null}
                            <span class="field">
                                {$_("text.replaygainAlbumPeak")}
                            </span>
                            <span>{song.replaygain_album_peak}</span>
                        {/if}

                        {#if (song.replaygain_track_gain ?? null) !== null}
                            <span class="field">
                                {$_("text.replaygainTrackGain")}
                            </span>
                            <span>{song.replaygain_track_gain}</span>
                        {/if}

                        {#if (song.replaygain_track_peak ?? null) !== null}
                            <span class="field">
                                {$_("text.replaygainTrackPeak")}
                            </span>
                            <span>{song.replaygain_track_peak}</span>
                        {/if}

                        {#if (song.r128_album_gain ?? null) !== null}
                            <span class="field">
                                {$_("text.r128AlbumGain")}
                            </span>
                            <span>{song.r128_album_gain}</span>
                        {/if}

                        {#if (song.r128_track_gain ?? null) !== null}
                            <span class="field">
                                {$_("text.r128TrackGain")}
                            </span>
                            <span>{song.r128_track_gain}</span>
                        {/if}

                        {#if song.language}
                            <span class="field">{$_("text.language")}</span>
                            <span>{song.language}</span>
                        {/if}

                        {#if song.mbid}
                            <span class="field">
                                {$_("text.musicbrainzID")}
                            </span>
                            <span>
                                <a
                                    target="_blank"
                                    href="https://musicbrainz.org/recording/{song.mbid}"
                                >
                                    {song.mbid}
                                </a>
                            </span>
                        {/if}

                        {#if song.license}
                            <span class="field">{$_("text.license")}</span>
                            <span>{song.license}</span>
                        {/if}

                        {#if song.publisher}
                            <span class="field">
                                {$_("text.publisher")}
                            </span>
                            <span>{song.publisher}</span>
                        {/if}
                    </div>
                </sl-tab-panel>

                <sl-tab-panel name="lyrics">
                    {#if song.lyrics}
                        <span>{@html DOMPurify.sanitize(song.lyrics)}</span>
                    {:else}
                        <p>{$_("text.noItemsFound")}</p>
                    {/if}
                </sl-tab-panel>
            </sl-tab-group>
        {/key}
{:else if query.isSuccess && !song.id}
    <p>{$_("text.noItemsFound")}</p>
{/if}

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
