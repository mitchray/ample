<script>
    import { onMount } from 'svelte';
    import { serverURL } from '../stores/server';

    import SVGLaunch from "../../public/images/launch.svg";

    import Menu from '../components/menu.svelte';

    export let data;
    export let type;

    const musicbrainzRegex = new RegExp('[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}');

    let menu = [];

    let hasMusicbrainz = musicbrainzRegex.test(data.mbid);

    let isVisible = false;

    function toggleMenu() {
        isVisible = !isVisible;
    }

    onMount(() => {
        data.artist = data.artist ? data.artist : {};

        menu = [
            {
                id: 'data',
                title: 'Data',
                items: [
                    {
                        id: 'ampache',
                        title: 'Ampache',
                        artistURL: `${$serverURL}/artists.php?action=show&artist=${data.id}`,
                        albumURL: `${$serverURL}/albums.php?action=show&album=${data.id}`
                    },
                    {
                        id: 'discogs',
                        title: 'Discogs',
                        artistURL: `https://www.discogs.com/search/?q="${encodeURIComponent(data.name)}"&type=artist`,
                        albumURL: `https://www.discogs.com/search/?q="${encodeURIComponent(data.name)}"+"${encodeURIComponent(data.artist.name)}"&type=release`
                    },
                    {
                        id: 'lastfm',
                        title: 'Last.fm',
                        artistURL: `https://www.last.fm/search/artists?q=${encodeURIComponent(data.name)}`,
                        albumURL: `https://www.last.fm/search/albums?q=${encodeURIComponent(data.name)}+${encodeURIComponent(data.artist.name)}`
                    },
                    {
                        id: 'musicbrainz',
                        title: 'MusicBrainz',
                        artistURL: hasMusicbrainz ? `https://musicbrainz.org/artist/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=artist&method=indexed`,
                        albumURL: hasMusicbrainz ? `https://musicbrainz.org/release/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=release&method=indexed`
                    },
                ]
            },
            {
                id: 'search',
                title: 'Search',
                items: [
                    {
                        id: 'duckduckgo',
                        title: 'Duck Duck Go',
                        artistURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(data.name)}"`,
                        albumURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`
                    },
                    {
                        id: 'google',
                        title: 'Google',
                        artistURL: `https://www.google.com/search?q="${encodeURIComponent(data.name)}"`,
                        albumURL: `https://www.google.com/search?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`
                    },
                    {
                        id: 'wikipedia',
                        title: 'Wikipedia',
                        artistURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`,
                        albumURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`
                    },
                ]
            },
            {
                id: 'services',
                title: 'Services',
                items: [
                    {
                        id: 'apple',
                        title: 'Apple Music',
                        artistURL: `https://music.apple.com/search?term=${encodeURIComponent(data.name)}`,
                        albumURL: `https://music.apple.com/search?term=${encodeURIComponent(data.name)} ${encodeURIComponent(data.artist.name)}`
                    },
                    {
                        id: 'bandcamp',
                        title: 'Bandcamp',
                        artistURL: `https://bandcamp.com/search?q=${encodeURIComponent(data.name)}`,
                        albumURL: `https://bandcamp.com/search?q=${encodeURIComponent(data.name)}`
                    },
                    {
                        id: 'deezer',
                        title: 'Deezer',
                        artistURL: `https://www.deezer.com/search/"${encodeURIComponent(data.name)}"/artist`,
                        albumURL: `https://www.deezer.com/search/"${encodeURIComponent(data.name)}" "${encodeURIComponent(data.artist.name)}"/album`
                    },
                    {
                        id: 'spotify',
                        title: 'Spotify',
                        artistURL: `https://open.spotify.com/search/artist:"${encodeURIComponent(data.name)}"`,
                        albumURL: `https://open.spotify.com/search/album:"${encodeURIComponent(data.name)}" artist:"${encodeURIComponent(data.artist.name)}"`
                    },
                    {
                        id: 'youtube',
                        title: 'YouTube Music',
                        artistURL: `https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`,
                        albumURL: `https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`
                    },
                ]
            },
        ];
    });
</script>

<div class="container">
    <button
        type="button"
        id="thirdParty-data"
        class="button button--tertiary"
        on:click={toggleMenu}
        title="Data"
    >
        Links
    </button>

    {#if isVisible && data}
        <Menu anchor="bottom-center" toggleElement={document.querySelector('#thirdParty-data')} bind:isVisible={isVisible}>
            <div class="panel-content">
                <div class="groups">
                    {#each menu as category}
                        <div class="group">
                            <h4>{category.title}</h4>
                            <ul class="menu-list">
                                {#each category.items as link}
                                    <li>
                                        {#if type === 'artist'}
                                            <a target="_blank" href={link.artistURL}>
                                                {link.title}
                                            </a>
                                        {/if}
                                        {#if type === 'album'}
                                            <a target="_blank" href={link.albumURL}>
                                                {link.title}
                                            </a>
                                        {/if}
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>
            </div>
        </Menu>
    {/if}
</div>

<style>
    .container {
        display: flex;
        gap: var(--spacing-sm);
    }

    .groups {
        display: flex;
        gap: var(--spacing-xxl);
    }

    button:after {
        content: '';
        background-color: currentColor;
        mask-image: url('/ample/public/images/arrow_left.svg');
        mask-size: cover;
        mask-position: center;
        width: 25px;
        position: absolute;
        left: calc(100% - 5px);
        bottom: 0;
        top: 0;
        transform: rotate(270deg);
    }

    h4 {
        margin-bottom: var(--spacing-md);
        text-transform: uppercase;
        letter-spacing: 0.025em;
    }
</style>