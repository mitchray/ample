<script>
    import { serverURL } from '../stores/server';

    import SVGData from "../../public/images/text.svg";
    import SVGSearch from "../../public/images/search.svg";
    import SVGMusic from "../../public/images/music_note.svg";

    import Menu from '../components/menu.svelte';

    export let data;
    export let type;

    const musicbrainzRegex = new RegExp('[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}');

    let hasMusicbrainz = musicbrainzRegex.test(data.mbid);

    let isVisible = false;
    let menuType;

    function toggleMenu(type) {
        menuType = type;
        isVisible = !isVisible;
    }
</script>

<div class="container">
    <button
        type="button"
        id="thirdParty-data"
        class="just-icon"
        on:click={() => {toggleMenu('data')}}
        title="Data"
    >
        <SVGData style="padding: 0.15em;" />
    </button>

    <button
        type="button"
        id="thirdParty-search"
        class="just-icon"
        on:click={() => {toggleMenu('search')}}
        title="Search"
    >
        <SVGSearch />
    </button>

    <button
        type="button"
        id="thirdParty-provider"
        class="just-icon"
        on:click={() => {toggleMenu('provider')}}
        title="Providers"
    >
        <SVGMusic />
    </button>

    {#if type === 'artist'}
        {#if isVisible && menuType === 'data'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-data')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`${$serverURL}/artists.php?action=show&artist=${data.id}`}>
                            Ampache
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.discogs.com/search/?q="${encodeURIComponent(data.name)}"&type=artist`}>
                            Discogs
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.last.fm/search/artists?q=${encodeURIComponent(data.name)}`}>
                            Last.fm
                        </a>
                    </li>
                    <li>
                        <a target="_blank"
                            href={hasMusicbrainz ? `https://musicbrainz.org/artist/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=artist&method=indexed`}
                        >
                            MusicBrainz
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}

        {#if isVisible && menuType === 'search'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-search')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`https://www.duckduckgo.com/?q="${encodeURIComponent(data.name)}"`}>
                            Duck Duck Go
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.google.com/search?q="${encodeURIComponent(data.name)}"`}>
                            Google
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`}>
                            Wikipedia
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}

        {#if isVisible && menuType === 'provider'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-provider')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`https://music.apple.com/search?term=${encodeURIComponent(data.name)}`}>
                            Apple Music
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://bandcamp.com/search?q=${encodeURIComponent(data.name)}`}>
                            Bandcamp
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.deezer.com/search/"${encodeURIComponent(data.name)}"/artist`}>
                            Deezer
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://open.spotify.com/search/artist:"${encodeURIComponent(data.name)}"`}>
                            Spotify
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`}>
                            YouTube Music
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}
    {/if}

    {#if type === 'album'}
        {#if isVisible && menuType === 'data'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-data')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`${$serverURL}/albums.php?action=show&album=${data.id}`}>
                            Ampache
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.discogs.com/search/?q="${encodeURIComponent(data.name)}"+"${encodeURIComponent(data.artist.name)}"&type=release`}>
                            Discogs
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.last.fm/search/albums?q=${encodeURIComponent(data.name)}+${encodeURIComponent(data.artist.name)}`}>
                            Last.fm
                        </a>
                    </li>
                    <li>
                        <a target="_blank"
                            href={hasMusicbrainz ? `https://musicbrainz.org/release/${data.mbid}` : `https://musicbrainz.org/search?query=${encodeURIComponent(data.name)}&type=release&method=indexed`}
                        >
                            MusicBrainz
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}

        {#if isVisible && menuType === 'search'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-search')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`https://www.duckduckgo.com/?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`}>
                            Duck Duck Go
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.google.com/search?q="${encodeURIComponent(data.artist.name)}"+"${encodeURIComponent(data.name)}"`}>
                            Google
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://en.wikipedia.org/wiki/Special:Search?search="${encodeURIComponent(data.name)}"&go=Go`}>
                            Wikipedia
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}

        {#if isVisible && menuType === 'provider'}
            <Menu anchor="bottom-left" toggleElement={document.querySelector('#thirdParty-provider')} bind:isVisible={isVisible}>
                <ul class="menu-list">
                    <li>
                        <a target="_blank" href={`https://music.apple.com/search?term=${encodeURIComponent(data.name)} ${encodeURIComponent(data.artist.name)}`}>
                            Apple Music
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://bandcamp.com/search?q=${encodeURIComponent(data.name)}`}>
                            Bandcamp
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://www.deezer.com/search/"${encodeURIComponent(data.name)}" "${encodeURIComponent(data.artist.name)}"/album`}>
                            Deezer
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://open.spotify.com/search/album:"${encodeURIComponent(data.name)}" artist:"${encodeURIComponent(data.artist.name)}"`}>
                            Spotify
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href={`https://music.youtube.com/search?q=${encodeURIComponent(data.name)}`}>
                            YouTube Music
                        </a>
                    </li>
                </ul>
            </Menu>
        {/if}
    {/if}
</div>

<style>
    .container {
        display: flex;
        gap: var(--spacing-sm);
    }

    ul {
        margin: 0;
    }

    button {
        padding: 0.3em;
    }

    a:after {
        display: inline-block;
        content: '';
        background-color: currentColor;
        mask-image: url('/ample/public/images/launch.svg');
        mask-size: contain;
        mask-position: center;
        height: 1em;
        width: 1em;
        margin-left: var(--spacing-sm);
    }
</style>