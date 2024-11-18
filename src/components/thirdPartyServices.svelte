<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { Server } from "~/stores/state.js";
    import { replaceSpacesWithHyphens } from "~/logic/helper.js";
    import MusicBrainz from "~/logic/musicbrainz";

    import AmpacheLogo from "/src/assets/logos/ampache.svg";
    import BandsintownLogo from "/src/assets/logos/bandsintown.svg";
    import DiscogsLogo from "/src/assets/logos/discogs.svg";
    import GeniusLogo from "/src/assets/logos/genius.svg";
    import LastfmLogo from "/src/assets/logos/lastfm.svg";
    import MusicbrainzLogo from "/src/assets/logos/musicbrainz_simple.svg";
    import SetlistfmLogo from "/src/assets/logos/setlistfm.svg";
    import SongkickLogo from "/src/assets/logos/songkick.svg";
    import WikipediaLogo from "/src/assets/logos/wikipedia.svg";
    import BingLogo from "/src/assets/logos/bing.svg";
    import DuckduckgoLogo from "/src/assets/logos/duckduckgo.svg";
    import GoogleLogo from "/src/assets/logos/google.svg";
    import AmazonLogo from "/src/assets/logos/amazon.svg";
    import ApplemusicLogo from "/src/assets/logos/applemusic.svg";
    import BandcampLogo from "/src/assets/logos/bandcamp.svg";
    import DeezerLogo from "/src/assets/logos/deezer.svg";
    import HdtracksLogo from "/src/assets/logos/hdtracks.svg";
    import QobuzLogo from "/src/assets/logos/qobuz.svg";
    import SpotifyLogo from "/src/assets/logos/spotify.svg";
    import TidalLogo from "/src/assets/logos/tidal.svg";
    import YoutubeLogo from "/src/assets/logos/youtubemusic.svg";

    /** @type {{data: any, type: any}} */
    let { data = $bindable(), type } = $props();

    let mb = new MusicBrainz();
    let menu = $state([]);
    let hasMusicbrainz = mb.hasMBID(data);

    onMount(() => {
        data.artist = data.artist ? data.artist : {};

        menu = [
            {
                id: "data",
                title: $_("text.thirdpartyData"),
                items: [
                    {
                        id: "ampache",
                        title: "Ampache",
                        icon: AmpacheLogo,
                        artistURL: `${$Server.ampacheURL}/artists.php?action=show&artist=${data.id}`,
                        albumURL: `${$Server.ampacheURL}/albums.php?action=show&album=${data.id}`,
                        songURL: `${$Server.ampacheURL}/song.php?action=show_song&song_id=${data.id}`,
                    },
                    {
                        id: "bandsintown",
                        title: "Bandsintown",
                        icon: BandsintownLogo,
                        artistURL: `https://www.bandsintown.com/${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://www.bandsintown.com/${encodeURIComponent(
                            data.artist.name,
                        )}`,
                        songURL: `https://www.bandsintown.com/${encodeURIComponent(
                            data.artist.name,
                        )}`,
                    },
                    {
                        id: "discogs",
                        title: "Discogs",
                        icon: DiscogsLogo,
                        artistURL: `https://www.discogs.com/search/?q="${encodeURIComponent(
                            data.name,
                        )}"&type=artist`,
                        albumURL: `https://www.discogs.com/search/?q="${encodeURIComponent(
                            data.name,
                        )}"+"${encodeURIComponent(
                            data.artist.name,
                        )}"&type=release`,
                        songURL: `https://www.discogs.com/search/?type=all&artist=${encodeURIComponent(
                            data.artist.name,
                        )}&track=${encodeURIComponent(data.name)}`,
                    },
                    {
                        id: "genius",
                        title: "Genius",
                        icon: GeniusLogo,
                        artistURL: `https://genius.com/artists/${encodeURIComponent(
                            replaceSpacesWithHyphens(data.name),
                        )}`,
                        albumURL: `https://genius.com/albums/${encodeURIComponent(
                            replaceSpacesWithHyphens(data.artist.name),
                        )}/${encodeURIComponent(
                            replaceSpacesWithHyphens(data.name),
                        )}`,
                        songURL: `https://genius.com/${encodeURIComponent(
                            replaceSpacesWithHyphens(data.artist.name),
                        )}-${encodeURIComponent(
                            replaceSpacesWithHyphens(data.name),
                        )}-lyrics`,
                    },
                    {
                        id: "lastfm",
                        title: "Last.fm",
                        icon: LastfmLogo,
                        artistURL: `https://www.last.fm/search/artists?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://www.last.fm/search/albums?q=${encodeURIComponent(
                            data.name,
                        )}+${encodeURIComponent(data.artist.name)}`,
                        songURL: `https://www.last.fm/search/tracks?q=${encodeURIComponent(
                            data.name,
                        )}+${encodeURIComponent(data.artist.name)}`,
                    },
                    {
                        id: "musicbrainz",
                        title: "MusicBrainz",
                        icon: MusicbrainzLogo,
                        artistURL: hasMusicbrainz
                            ? `https://musicbrainz.org/artist/${data.mbid}`
                            : `https://musicbrainz.org/search?query=${encodeURIComponent(
                                  data.name,
                              )}&type=artist&method=indexed`,
                        albumURL: hasMusicbrainz
                            ? `https://musicbrainz.org/release/${data.mbid}`
                            : `https://musicbrainz.org/search?query=${encodeURIComponent(
                                  data.name,
                              )}&type=release&method=indexed`,
                        songURL: hasMusicbrainz
                            ? `https://musicbrainz.org/recording/${data.mbid}`
                            : `https://musicbrainz.org/search?query=${encodeURIComponent(
                                  data.name,
                              )}&type=recording&method=indexed`,
                    },
                    {
                        id: "setlistfm",
                        title: "Setlist.fm",
                        icon: SetlistfmLogo,
                        artistURL: `https://www.setlist.fm/search?query=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://www.setlist.fm/search?query=${encodeURIComponent(
                            data.artist.name,
                        )}`,
                        songURL: `https://www.setlist.fm/search?query=${encodeURIComponent(
                            data.artist.name,
                        )}`,
                    },
                    {
                        id: "songkick",
                        title: "Song Kick",
                        icon: SongkickLogo,
                        artistURL: `https://www.songkick.com/search?query=${encodeURIComponent(
                            data.name,
                        )}&type=artists`,
                        albumURL: `https://www.songkick.com/search?query=${encodeURIComponent(
                            data.artist.name,
                        )}&type=artists`,
                        songURL: `https://www.songkick.com/search?query=${encodeURIComponent(
                            data.artist.name,
                        )}&type=artists`,
                    },
                    {
                        id: "wikipedia",
                        title: "Wikipedia",
                        icon: WikipediaLogo,
                        artistURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(
                            data.name,
                        )}"&go=Go`,
                        albumURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(
                            data.name,
                        )}"&go=Go`,
                        songURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(
                            data.name,
                        )}"&go=Go`,
                    },
                ],
            },
            {
                id: "search",
                title: $_("text.thirdpartySearch"),
                items: [
                    {
                        id: "bing",
                        title: "Bing",
                        icon: BingLogo,
                        artistURL: `https://www.bing.com/search?q="${encodeURIComponent(
                            data.name,
                        )}"`,
                        albumURL: `https://www.bing.com/search?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                        songURL: `https://www.bing.com/search?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                    },
                    {
                        id: "duckduckgo",
                        title: "Duck Duck Go",
                        icon: DuckduckgoLogo,
                        artistURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(
                            data.name,
                        )}"`,
                        albumURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                        songURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                    },
                    {
                        id: "google",
                        title: "Google",
                        icon: GoogleLogo,
                        artistURL: `https://www.google.com/search?q="${encodeURIComponent(
                            data.name,
                        )}"`,
                        albumURL: `https://www.google.com/search?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                        songURL: `https://www.google.com/search?q="${encodeURIComponent(
                            data.artist.name,
                        )}"+"${encodeURIComponent(data.name)}"`,
                    },
                ],
            },
            {
                id: "services",
                title: $_("text.thirdpartyServices"),
                items: [
                    {
                        id: "amazon",
                        title: "Amazon Music",
                        icon: AmazonLogo,
                        artistURL: `https://music.amazon.com/search/${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://music.amazon.com/search/${encodeURIComponent(
                            data.name,
                        )} ${encodeURIComponent(data.artist.name)}`,
                        songURL: `https://music.amazon.com/search/${encodeURIComponent(
                            data.name,
                        )} ${encodeURIComponent(data.artist.name)}`,
                    },
                    {
                        id: "apple",
                        title: "Apple Music",
                        icon: ApplemusicLogo,
                        artistURL: `https://music.apple.com/search?term=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://music.apple.com/search?term=${encodeURIComponent(
                            data.name,
                        )} ${encodeURIComponent(data.artist.name)}`,
                        songURL: `https://music.apple.com/search?term=${encodeURIComponent(
                            data.name,
                        )} ${encodeURIComponent(data.artist.name)}`,
                    },
                    {
                        id: "bandcamp",
                        title: "Bandcamp",
                        icon: BandcampLogo,
                        artistURL: `https://bandcamp.com/search?q=${encodeURIComponent(
                            data.name,
                        )}&item_type=b`,
                        albumURL: `https://bandcamp.com/search?q=${encodeURIComponent(
                            data.name,
                        )}&item_type=a`,
                        songURL: `https://bandcamp.com/search?q=${encodeURIComponent(
                            data.name,
                        )}&item_type=t`,
                    },
                    {
                        id: "deezer",
                        title: "Deezer",
                        icon: DeezerLogo,
                        artistURL: `https://www.deezer.com/search/"${encodeURIComponent(
                            data.name,
                        )}"/artist`,
                        albumURL: `https://www.deezer.com/search/"${encodeURIComponent(
                            data.name,
                        )}" "${encodeURIComponent(data.artist.name)}"/album`,
                        songURL: `https://www.deezer.com/search/"${encodeURIComponent(
                            data.name,
                        )}" "${encodeURIComponent(data.artist.name)}"/track`,
                    },
                    {
                        id: "hdtracks",
                        title: "HDtracks",
                        icon: HdtracksLogo,
                        artistURL: `https://www.hdtracks.com/#/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://www.hdtracks.com/#/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        songURL: `https://www.hdtracks.com/#/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                    },
                    {
                        id: "qobuz",
                        title: "Qobuz",
                        icon: QobuzLogo,
                        artistURL: `https://www.qobuz.com/us-en/search/artists/${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://www.qobuz.com/us-en/search/albums/${encodeURIComponent(
                            data.name,
                        )}`,
                        songURL: `https://www.qobuz.com/us-en/search/tracks/${encodeURIComponent(
                            data.name,
                        )}`,
                    },
                    {
                        id: "spotify",
                        title: "Spotify",
                        icon: SpotifyLogo,
                        artistURL: `https://open.spotify.com/search/artist:"${encodeURIComponent(
                            data.name,
                        )}"`,
                        albumURL: `https://open.spotify.com/search/album:"${encodeURIComponent(
                            data.name,
                        )}" artist:"${encodeURIComponent(data.artist.name)}"`,
                        songURL: `https://open.spotify.com/search/track:"${encodeURIComponent(
                            data.name,
                        )}" artist:"${encodeURIComponent(data.artist.name)}"`,
                    },
                    {
                        id: "tidal",
                        title: "Tidal",
                        icon: TidalLogo,
                        artistURL: `https://listen.tidal.com/search/artists?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://listen.tidal.com/search/albums?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        songURL: `https://listen.tidal.com/search/tracks?q=${encodeURIComponent(
                            data.name,
                        )}`,
                    },
                    {
                        id: "youtube",
                        title: "YouTube Music",
                        icon: YoutubeLogo,
                        artistURL: `https://music.youtube.com/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        albumURL: `https://music.youtube.com/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                        songURL: `https://music.youtube.com/search?q=${encodeURIComponent(
                            data.name,
                        )}`,
                    },
                ],
            },
        ];
    });
</script>

<sl-dropdown hoist>
    <sl-button caret size="small" slot="trigger">Links</sl-button>

    <sl-card>
        <div class="groups">
            {#each menu as category}
                <div class="group">
                    <h4>{category.title}</h4>
                    <ul class="menu-list">
                        {#each category.items as link}
                            {@const url = (() => {
                                switch (type) {
                                    case "artist":
                                        return link.artistURL;
                                    case "album":
                                        return link.albumURL;
                                    default:
                                        return link.songURL;
                                }
                            })()}
                            <li>
                                <sl-button
                                    size="small"
                                    target="_blank"
                                    href={url}
                                    variant="neutral"
                                >
                                    {#if link.icon}
                                        <sl-icon
                                            src={link.icon}
                                            slot="prefix"
                                        ></sl-icon>
                                    {/if}
                                    {link.title}
                                </sl-button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/each}
        </div>
    </sl-card>
</sl-dropdown>

<style>
    sl-card {
        display: flex;
        overflow: auto;
        max-width: 100vw;
        width: 380px;
    }

    .groups {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    h4 {
        margin-block-end: var(--spacing-sm);
    }

    .menu-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }
</style>
