<script>
    import '/src/css/normalize.css';
    import '/src/css/global.css';

    import { onMount } from 'svelte';
    import { Router, Route } from "svelte-routing";

    import { serverVersion, serverPathname } from "./stores/server";
    import { isLoggedIn, userToken } from './stores/user';
    import { MediaPlayer, SiteContentBind } from "./stores/player";

    import { validateCachedAuth, extendSession } from './logic/user';
    import { getServerVersion } from './logic/server';

    // Use custom string as dnd-action ID
    import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";
    overrideItemIdKeyNameBeforeInitialisingDndZones("_id");

    import ThemeHandler from './components/themeHandler.svelte';
    import SiteLoading from './components/siteLoading.svelte';
    import Header from './components/header.svelte';
    import Sidebar2 from './components/sidebar2.svelte';
    import Queue from './components/queue.svelte';
    import Player from './components/player/player.svelte';
    import Fullscreen from './components/fullscreen/fullscreen.svelte';
    import Toasts from './components/notification/toasts.svelte';
    import Lyrics from './components/lyrics.svelte';
    import ArtistsSync from './components/artistsSync.svelte';

    import LoginPage from './views/login.svelte';
    import NotFound404Page from './views/notFound404.svelte';
    import HomePage from './views/home.svelte';
    import AlbumArtistsPage from './views/albumArtists.svelte';
    import ArtistsPage from './views/artists.svelte';
    import ArtistPage from './views/artist.svelte';
    import AlbumsPage from './views/albums.svelte';
    import AlbumsByYearPage from './views/albumsByYear.svelte';
    import AlbumPage from './views/album.svelte';
    import SongPage from './views/song.svelte';
    import PlaylistsPage from './views/playlists.svelte';
    import PlaylistPage from './views/playlist.svelte';
    import SmartlistsPage from './views/smartlists.svelte';
    import GenresPage from './views/genres.svelte';
    import GenrePage from './views/genre.svelte';
    import PodcastsPage from './views/podcasts.svelte';
    import NewestPage from './views/newest.svelte';
    import RecentPage from './views/recent.svelte';
    import FavoritesPage from './views/favorites.svelte';
    import TrendingPage from './views/trending.svelte';
    import TopRatedPage from './views/topRated.svelte';
    import ForgottenPage from './views/forgotten.svelte';
    import RandomPage from './views/random.svelte';
    import UnratedPage from './views/unrated.svelte';
    import MultiRaterPage from './views/multiRater.svelte';

    import TestPage from './views/test.svelte';
    import AdvancedSearchPage from './views/advancedSearch.svelte';
    import SongVersionsPage from './views/songVersions.svelte';

    validateCachedAuth();

    let intervalId = window.setInterval(function(){
        extendSession();
    }, 1000*60*15);

    // hook into page navigation
    history.pushState = new Proxy(history.pushState, {
        apply (target, thisArg, argumentsList) {
            $MediaPlayer.setWaveColors();

            //reset scroll position after each 'page' load
            document.querySelector('.site-content-inner').scrollTop = 0;

            Reflect.apply(target, thisArg, argumentsList);
        }
    })

    // hook into back/forward events
    window.onpopstate = () => {
        // Needs to be in a zero-length timeout
        setTimeout(() => $MediaPlayer.setWaveColors(), 0);
    };

    onMount(async () => {
        // get Ampache server version
        serverVersion.set(await getServerVersion());
    });
</script>

<ThemeHandler />

<Router basepath="{$serverPathname}">
    {#if $isLoggedIn === null && $userToken === null}
        <SiteLoading/>
    {/if}

    {#if $isLoggedIn === false}
        <LoginPage/>
    {/if}

    {#if $isLoggedIn}
        <ArtistsSync />
        <Toasts />
        <Header/>
        <div class="site-inner">
            <Sidebar2/>
            <div class="site-content" bind:this={$SiteContentBind}>
                <div class="site-content-inner">
                    <Route path="test" component={TestPage}/>

                    <Route path="search" component={AdvancedSearchPage}/>
                    <Route path="multi-rater" component={MultiRaterPage}/>
                    <Route path="versions/:songTitle/:artistName" component={SongVersionsPage}/>

                    <Route path="artists/:id" component={ArtistPage}/>
                    <Route path="artists" component={ArtistsPage}/>
                    <Route path="album-artists" component={AlbumArtistsPage}/>
                    <Route path="albums/:id" component={AlbumPage}/>
                    <Route path="albums/year/:year" component={AlbumsByYearPage}/>
                    <Route path="albums/year" component={AlbumsByYearPage}/>
                    <Route path="albums" component={AlbumsPage}/>
                    <Route path="song/:id" component={SongPage}/>
                    <Route path="playlists/:id" component={PlaylistPage}/>
                    <Route path="playlists" component={PlaylistsPage}/>
                    <Route path="smartlists/:id" component={PlaylistPage}/>
                    <Route path="smartlists" component={SmartlistsPage}/>
                    <Route path="genres/:id" component={GenrePage}/>
                    <Route path="genres" component={GenresPage}/>
                    <Route path="podcasts" component={PodcastsPage}/>
                    <Route path="newest" component={NewestPage}/>
                    <Route path="recent" component={RecentPage}/>
                    <Route path="favorites" component={FavoritesPage}/>
                    <Route path="trending" component={TrendingPage}/>
                    <Route path="top" component={TopRatedPage}/>
                    <Route path="forgotten" component={ForgottenPage}/>
                    <Route path="random" component={RandomPage}/>
                    <Route path="unrated" component={UnratedPage}/>
                    <Route path="" component={HomePage}/>
                    <Route path="/" component={HomePage}/>
                    <Route path="*" component={NotFound404Page}/>

                    <Lyrics/>
                </div>
            </div>
            <Queue/>
        </div>
        <Player/>
        <Fullscreen/>
    {/if}
</Router>

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--color-background);
        color: var(--color-text-primary);
    }

    :global(.site-header) {
        flex-shrink: 0;
    }

    :global(.site-sidebar) {
        flex-shrink: 0;
    }

    :global(.site-queue) {
        flex-shrink: 0;
    }

    :global(.site-inner) {
        flex: 1;
        display: flex;
        flex-direction: row;
        z-index: 1;
    }

    :global(.site-content) {
        position: relative;
        padding: var(--spacing-xxl);
        flex: 1;
        z-index: -10;
    }

    :global(.site-content-inner) {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        padding: inherit;
    }

    /* needed as flex doesn't include padding in height calc */
    :global(.site-content-inner:after) {
        content: '';
        padding: inherit;
        padding-top: 0;
        display: block;
    }

    :global(.site-player) {
        flex-shrink: 0;
    }
</style>



