<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { serverURL } from '../stores/server';
    import MusicBrainz from "../logic/musicbrainz";
    import Menu from '../components/menu.svelte';

    export let data;
    export let type;

    let mb = new MusicBrainz;
    let menu = [];

    let hasMusicbrainz = mb.hasMBID(data);

    let isVisible = false;

    function toggleMenu() {
        isVisible = !isVisible;
    }

    onMount(() => {
        data.artist = data.artist ? data.artist : {};

        menu = [
            {
                id: 'data',
                title: $_('text.thirdpartyData'),
                items: [
                    {
                        id: 'ampache',
                        title: 'Ampache',
                        artistURL: `${$serverURL}/artists.php?action=show&artist=${data.id}`,
                        albumURL: `${$serverURL}/albums.php?action=show&album=${data.id}`,
                        songURL: `${$serverURL}/song.php?action=show_song&song_id=${data.id}`
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
                        albumURL: `https://www.last.fm/search/albums?q=${encodeURIComponent(data.name)}+${encodeURIComponent(data.artist.name)}`,
                        songURL: `https://www.last.fm/search/tracks?q=${encodeURIComponent(data.name)}+${encodeURIComponent(data.artist.name)}`
                    },
                    {
                        id: 'musicbrainz',
                        title: 'MusicBrainz',
                        artistURL: hasMusicbrainz ? `https://musicbrainz.org/artist/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=artist&method=indexed`,
                        albumURL: hasMusicbrainz ? `https://musicbrainz.org/release/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=release&method=indexed`,
                        songURL: hasMusicbrainz ? `https://musicbrainz.org/recording/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=recording&method=indexed`
                    },
                ]
            },
            {
                id: 'search',
                title: $_('text.thirdpartySearch'),
                items: [
                    {
                        id: 'duckduckgo',
                        title: 'Duck Duck Go',
                        artistURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(data.name)}"`,
                        albumURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`,
                        songURL: `https://www.duckduckgo.com/?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`
                    },
                    {
                        id: 'google',
                        title: 'Google',
                        artistURL: `https://www.google.com/search?q="${encodeURIComponent(data.name)}"`,
                        albumURL: `https://www.google.com/search?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`,
                        songURL: `https://www.google.com/search?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`
                    },
                    {
                        id: 'wikipedia',
                        title: 'Wikipedia',
                        artistURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`,
                        albumURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`,
                        songURL: `https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`
                    },
                ]
            },
            {
                id: 'services',
                title: $_('text.thirdpartyServices'),
                items: [
                    {
                        id: 'apple',
                        title: 'Apple Music',
                        artistURL: `https://music.apple.com/search?term=${encodeURIComponent(data.name)}`,
                        albumURL: `https://music.apple.com/search?term=${encodeURIComponent(data.name)} ${encodeURIComponent(data.artist.name)}`,
                        songURL: `https://music.apple.com/search?term=${encodeURIComponent(data.name)} ${encodeURIComponent(data.artist.name)}`
                    },
                    {
                        id: 'bandcamp',
                        title: 'Bandcamp',
                        artistURL: `https://bandcamp.com/search?q=${encodeURIComponent(data.name)}&item_type=b`,
                        albumURL: `https://bandcamp.com/search?q=${encodeURIComponent(data.name)}&item_type=a`,
                        songURL: `https://bandcamp.com/search?q=${encodeURIComponent(data.name)}&item_type=t`
                    },
                    {
                        id: 'deezer',
                        title: 'Deezer',
                        artistURL: `https://www.deezer.com/search/"${encodeURIComponent(data.name)}"/artist`,
                        albumURL: `https://www.deezer.com/search/"${encodeURIComponent(data.name)}" "${encodeURIComponent(data.artist.name)}"/album`,
                        songURL: `https://www.deezer.com/search/"${encodeURIComponent(data.name)}" "${encodeURIComponent(data.artist.name)}"/track`
                    },
                    {
                        id: 'spotify',
                        title: 'Spotify',
                        artistURL: `https://open.spotify.com/search/artist:"${encodeURIComponent(data.name)}"`,
                        albumURL: `https://open.spotify.com/search/album:"${encodeURIComponent(data.name)}" artist:"${encodeURIComponent(data.artist.name)}"`,
                        songURL: `https://open.spotify.com/search/track:"${encodeURIComponent(data.name)}" artist:"${encodeURIComponent(data.artist.name)}"`
                    },
                    {
                        id: 'youtube',
                        title: 'YouTube Music',
                        artistURL: `https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`,
                        albumURL: `https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`,
                        songURL: `https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`
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
        title="{$_('text.links')}"
    >
        {$_('text.links')}
    </button>

    {#if isVisible && data}
        <Menu anchor="bottom" toggleSelector={'#thirdParty-data'} bind:isVisible={isVisible}>
            <div class="panel-content">
                <div class="groups">
                    {#each menu as category}
                        <div class="group">
                            <h4 class="panel-title">{category.title}</h4>
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
                                        {#if type === 'song' && link.songURL}
                                            <a target="_blank" href={link.songURL}>
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
    }

    .groups {
        display: flex;
        gap: var(--spacing-xxl);
    }

    .button {
        margin-inline-end: 0;
        padding-inline-end: 10px;
    }

    button:after {
        content: '';
        background-color: currentColor;
        mask-image: url('/src/images/arrow_left.svg');
        mask-size: cover;
        mask-position: center;
        width: 25px;
        position: absolute;
        inset-inline-start:  calc(100% - 15px);
        inset-block-end: 0;
        inset-block-start: 0;
        transform: rotate(270deg);
        display: inline-block;
    }

    h4 {
        margin-block-end: var(--spacing-md);
    }
</style>