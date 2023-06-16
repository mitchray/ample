<script>
    import '/src/css/normalize.css';
    import '/src/css/global.css';

    import { onMount } from 'svelte';
    import { Router, Route } from "svelte-routing";

    import { serverVersion, serverPathname } from "./stores/server";
    import { isLoggedIn, userToken } from './stores/user';
    import { MediaPlayer, SiteContentBind, SiteInnerBind } from "./stores/player";
    import { Theme, PageTitle, PageLoadedKey } from "./stores/status";

    import { extendSession, validateSession } from './logic/user';
    import { getServerVersion } from './logic/server';
    import { isLoading as i18nIsLoading } from 'svelte-i18n'
    import { setupI18n } from "./logic/i18n.js";

    // Use custom string as dnd-action ID
    import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";
    overrideItemIdKeyNameBeforeInitialisingDndZones("_id");

    import ThemeHandler from './components/themeHandler.svelte';
    import SiteLoading from './components/siteLoading.svelte';
    import Header from './components/header.svelte';
    import Sidebar from './components/sidebar.svelte';
    import Queue from './components/queue.svelte';
    import Player from './components/player/player.svelte';
    import Fullscreen from './components/fullscreen/fullscreen.svelte';
    import Notifications from './components/notification/notificationsContainer.svelte';
    import Alerts from './components/alert/alertsContainer.svelte';
    import Lyrics from './components/lyrics.svelte';
    import ArtistsSync from './components/artistsSync.svelte';

    import LoginPage from './views/login.svelte';
    import NotFound404Page from './views/notFound404.svelte';
    import HomePage from './views/home.svelte';

    setupI18n();

    window.setInterval(function(){
        extendSession();
    }, 1000*60*15);

    // hook into page navigation
    history.pushState = new Proxy(history.pushState, {
        apply (target, thisArg, argumentsList) {
            $MediaPlayer.setWaveColors();

            // reset scroll position after each 'page' load
            document.querySelector('.site-content-inner').scrollTop = 0;

            Reflect.apply(target, thisArg, argumentsList);

            // reset page title
            $PageTitle = "";
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

        await validateSession();

        if ($Theme === 'light') {
            document.body.classList.add('theme-is-light');
        }
    });
</script>

<ThemeHandler />

<Router basepath="{$serverPathname}/ample">
    {#if !$i18nIsLoading}
        {#if $isLoggedIn === null && $userToken === null}
            <SiteLoading/>
        {/if}

        {#if $isLoggedIn === false}
            <LoginPage/>
        {/if}

        {#if $isLoggedIn}
            <ArtistsSync />
            <Header/>
            <div class="site-inner" bind:this={$SiteInnerBind}>
                <Sidebar/>
                <div class="site-content" bind:this={$SiteContentBind}>
                    <div class="site-content-inner">
                        {#key $PageLoadedKey || 0}
                            <Route path="test"              component={() => import('./views/test.svelte')}/>
                            <Route path="search"            component={() => import('./views/advancedSearch.svelte')}/>
                            <Route path="multi-rater"       component={() => import('./views/multiRater.svelte')}/>
                            <Route path="versions/:songTitle/:artistName" component={() => import('./views/songVersions.svelte')}/>
                            <Route path="artists/:id"       component={() => import('./views/artist.svelte')}/>
                            <Route path="artists"           component={() => import('./views/artists.svelte')}/>
                            <Route path="album-artists"     component={() => import('./views/albumArtists.svelte')}/>
                            <Route path="albums/:id"        component={() => import('./views/album.svelte')}/>
                            <Route path="albums/year/:year" component={() => import('./views/albumsByYear.svelte')}/>
                            <Route path="albums/year"       component={() => import('./views/albumsByYear.svelte')}/>
                            <Route path="albums"            component={() => import('./views/albums.svelte')}/>
                            <Route path="song/:id"          component={() => import('./views/song.svelte')}/>
                            <Route path="playlists/:id"     component={() => import('./views/playlist.svelte')}/>
                            <Route path="playlists"         component={() => import('./views/playlists.svelte')}/>
                            <Route path="smartlists/:id"    component={() => import('./views/playlist.svelte')}/>
                            <Route path="smartlists"        component={() => import('./views/smartlists.svelte')}/>
                            <Route path="mix/:mixType/:id"  component={() => import('./views/playlist.svelte')}/>
                            <Route path="genres/:id"        component={() => import('./views/genre.svelte')}/>
                            <Route path="genres"            component={() => import('./views/genres.svelte')}/>
                            <Route path="newest"            component={() => import('./views/newest.svelte')}/>
                            <Route path="recent"            component={() => import('./views/recent.svelte')}/>
                            <Route path="favorites"         component={() => import('./views/favorites.svelte')}/>
                            <Route path="trending"          component={() => import('./views/trending.svelte')}/>
                            <Route path="top"               component={() => import('./views/topRated.svelte')}/>
                            <Route path="forgotten"         component={() => import('./views/forgotten.svelte')}/>
                            <Route path="random"            component={() => import('./views/random.svelte')}/>
                            <Route path="unrated"           component={() => import('./views/unrated.svelte')}/>
                            <Route path=""                  component={HomePage}/>
                            <Route path="/"                 component={HomePage}/>
                            <Route path="*"                 component={NotFound404Page}/>
                        {/key}
                    </div>
                </div>
                <Queue/>
            </div>
            <Player/>
            <Fullscreen/>
            <Lyrics/>
            <Notifications/>
            <Alerts/>
        {/if}
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
        flex: 1;
        z-index: -10;
    }

    :global(.site-content-inner) {
        --content-padding: var(--spacing-lg);
        container-name: site-content-inner;
        container-type: size;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow-y: auto;
        padding-block-start: var(--spacing-xxl);
        padding-block-end: var(--spacing-xxl);
        display: grid;
        grid-template-columns:
            [full-start]
            var(--content-padding)
            [content-start]
            1fr
            [content-end]
            var(--content-padding)
            [full-end];
        grid-auto-rows: min-content;
    }

    :global(.site-content-inner > *) {
        grid-column: content;
    }

    :global(.site-player) {
        flex-shrink: 0;
    }
</style>



