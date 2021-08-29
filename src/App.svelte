<script>
    // TODO when rollup-plugin-css-only releases v4
    // import '../src/css/normalize.css';
    // import '../src/css/global.css';

    import { onMount } from 'svelte';
    import { Router, Route } from "svelte-routing";

    import { serverVersion } from "./stores/server";
    import { isLoggedIn, userToken } from './stores/user';
    import { MediaPlayer } from "./stores/player";

    import { validateAuthToken, extendSession } from './logic/user';
    import { getServerVersion } from './logic/server';

    // Use custom string as dnd-action ID
    import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";
    overrideItemIdKeyNameBeforeInitialisingDndZones("_id");

    import ThemeHandler from './components/themeHandler.svelte';
    import SiteLoading from './components/siteLoading.svelte';
    import Sidebar from './components/sidebar.svelte';
    import Player from './components/player/player.svelte';

    import LoginPage from './views/login.svelte';
    import NotFound404Page from './views/notFound404.svelte';
    import HomePage from './views/home.svelte';
    import ArtistsPage from './views/artists.svelte';
    import ArtistsAll from './views/artistsAll.svelte';
    import ArtistPage from './views/artist.svelte';
    import AlbumsPage from './views/albums.svelte';
    import AlbumsAll from './views/albumsAll.svelte';
    import AlbumsByYearPage from './views/albumsByYear.svelte';
    import AlbumPage from './views/album.svelte';
    import PlaylistsPage from './views/playlists.svelte';
    import PlaylistPage from './views/playlist.svelte';
    import SmartlistsPage from './views/smartlists.svelte';
    import GenresPage from './views/genres.svelte';
    import GenrePage from './views/genre.svelte';
    import NewestPage from './views/newest.svelte';
    import RecentPage from './views/recent.svelte';
    import FavoritesPage from './views/favorites.svelte';
    import TrendingPage from './views/trending.svelte';
    import TopRatedPage from './views/topRated.svelte';
    import ForgottenPage from './views/forgotten.svelte';
    import RandomPage from './views/random.svelte';
    import UnratedPage from './views/unrated.svelte';

    import TestPage from './views/test.svelte';
    import AdvancedSearchPage from './views/advancedSearch.svelte';

    validateAuthToken();

    let intervalId = window.setInterval(function(){
        extendSession();
    }, 1000*60*15);

    // reset scroll position after each 'page' load
    history.pushState = new Proxy(history.pushState, {
        apply (target, thisArg, argumentsList) {
            $MediaPlayer.setWaveColors();
            document.querySelector('.site-content-inner').scrollTop = 0;
            Reflect.apply(target, thisArg, argumentsList);
        }
    })

    onMount(async () => {
        // get Ampache server version
        serverVersion.set(await getServerVersion());
    });
</script>

<ThemeHandler />

<Router basepath="/ample">
    {#if $isLoggedIn === null && $userToken === null}
        <SiteLoading/>
    {/if}

    {#if $isLoggedIn === false}
        <LoginPage/>
    {/if}

    {#if $isLoggedIn}
        <div class="site-inner">
            <Sidebar/>
            <div class="site-content">
                <div class="site-content-inner">
                    <Route path="test" component={TestPage}/>
                    <Route path="search" component={AdvancedSearchPage}/>

                    <Route path="artists/all" component={ArtistsAll}/>
                    <Route path="artists/:id" component={ArtistPage}/>
                    <Route path="artists" component={ArtistsPage}/>
                    <Route path="albums/:id" component={AlbumPage}/>
                    <Route path="albums/all" component={AlbumsAll}/>
                    <Route path="albums/year/:year" component={AlbumsByYearPage}/>
                    <Route path="albums/year" component={AlbumsByYearPage}/>
                    <Route path="albums" component={AlbumsPage}/>
                    <Route path="playlists/:id" component={PlaylistPage}/>
                    <Route path="playlists" component={PlaylistsPage}/>
                    <Route path="smartlists/:id" component={PlaylistPage}/>
                    <Route path="smartlists" component={SmartlistsPage}/>
                    <Route path="genres/:id/:type" component={GenrePage}/>
                    <Route path="genres/:id" component={GenrePage}/>
                    <Route path="genres" component={GenresPage}/>
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
                </div>
            </div>
        </div>
        <Player/>
    {/if}
</Router>

<style>
    :global(body) {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
        background-color: var(--color-background);
        color: var(--color-text-body);
    }

    :global(.site-header) {
        flex-shrink: 0;
    }

    :global(.site-sidebar) {
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
        box-shadow: inset 20px 0px 20px -20px rgba(0,0,0,0.2);
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



