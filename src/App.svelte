<script>
    import '/src/css/normalize.css';
    import '/src/css/global.css';

    import { onMount } from 'svelte';

    import { isLoggedIn, userToken } from './stores/user';
    import { MediaPlayer, SiteContentBind, SiteInnerBind } from "./stores/player";
    import { Theme, PageTitle } from "./stores/status";
    import { serverURL, serverIsHardcoded } from "./stores/server.js";

    import { extendSession, validateSession } from './logic/user';
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
    import Routes from './components/routes.svelte';
    import LoginPage from './views/login.svelte';

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

    async function getServerURL() {
        let hardcodedServerURL;

        // load from config file if present & set
        try {
            hardcodedServerURL = await fetch(`${import.meta.env.BASE_URL}/ample.json`)
                .then(response => response.json())
                .then(data => {
                    return data.ampacheURL;
                });
        } catch (e) {
        }

        if (hardcodedServerURL) {
            $serverURL = hardcodedServerURL;
            $serverIsHardcoded = true;
        } else {
            $serverURL = JSON.parse(localStorage.getItem('AmpleServerURL')) || '';
        }
    }

    onMount(async () => {
        await getServerURL();
        await validateSession();

        if ($Theme === 'light') {
            document.body.classList.add('theme-is-light');
        }
    });
</script>

<ThemeHandler />

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
                    <Routes />
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



