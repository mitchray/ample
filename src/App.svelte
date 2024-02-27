<script>
    import "@shoelace-style/shoelace/dist/themes/light.css";
    import "@shoelace-style/shoelace/dist/themes/dark.css";
    import "/src/css/normalize.css";
    import "/src/css/global.css";
    import "@shoelace-style/shoelace/dist/shoelace.js";
    import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
    import { onMount } from "svelte";
    import { User, Server, PageTitle, ShowSearch } from "~/stores/state.js";
    import { loadSettings, Theme } from "~/stores/settings";
    import { extendSession, validateSession } from "~/logic/user";
    import { isLoading as i18nIsLoading } from "svelte-i18n";
    import { setupI18n } from "~/logic/i18n.js";

    // Use custom string as dnd-action ID
    import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";
    overrideItemIdKeyNameBeforeInitialisingDndZones("_id");

    import ThemeHandler from "~/components/theme/themeHandler.svelte";
    import Header from "~/components/header.svelte";
    import Sidebar from "~/components/sidebar/sidebar.svelte";
    import Queue from "~/components/queue/queue.svelte";
    import Player from "~/components/player/player2.svelte";
    import Alerts from "~/components/alert/alertsContainer.svelte";
    import Lyrics from "~/components/lyrics.svelte";
    import Preferences from "~/views/preferences/preferences.svelte";
    import ItemSync from "~/components/itemSync.svelte";
    import Routes from "~/components/routes.svelte";
    import NotificationToasts from "~/components/notification/notificationToasts.svelte";
    import LoginPage from "~/views/login.svelte";
    import { hideLoadingOverlay } from "~/logic/ui.js";
    import localforage from "localforage";

    setupI18n();

    window.setInterval(
        function () {
            extendSession();
        },
        1000 * 60 * 15,
    );

    // hook into back/forward events
    window.onpopstate = () => {
        // close search after navigating
        $ShowSearch = false;

        // reset page title
        $PageTitle = "";
    };

    $: {
        if ($User.isLoggedIn) {
            loadSettings();
        }
    }

    async function loadFromConfig() {
        let configFile = {};

        // just `config/ample.json` when developing locally,
        try {
            configFile = await fetch(
                `${import.meta.env.BASE_URL}/config/ample.json`,
            )
                .then((response) => response.json())
                .then((data) => {
                    return data;
                });
        } catch (e) {}

        let newObject = {
            ...configFile,
            url:
                configFile?.ampacheURL ||
                (await localforage.getItem("AmpleServerURL")) ||
                "",
            isHardcodedURL: configFile?.ampacheURL?.length > 1,
        };

        // we don't need this anymore as it becomes the url property
        delete newObject.ampacheURL;

        $Server = { ...$Server, ...newObject };
    }

    const queryClient = new QueryClient();

    onMount(async () => {
        await loadFromConfig();
        await validateSession();

        // remove the starting sl-theme-dark
        document.documentElement.classList.remove("sl-theme-dark");

        if ($Theme.mode === "light") {
            document.documentElement.classList.add("sl-theme-light");
        } else {
            document.documentElement.classList.add("sl-theme-dark");
        }

        hideLoadingOverlay();
    });
</script>

<ThemeHandler />
<ItemSync />

{#if !$i18nIsLoading}
    {#if !$User.isLoggedIn}
        <LoginPage />
    {:else}
        <QueryClientProvider client={queryClient}>
            <Header />
            <div class="site-inner">
                <Sidebar />

                <Routes />

                <Queue />
            </div>
            <Player />
            <Lyrics />
            <Preferences />
            <NotificationToasts />
            <Alerts />
        </QueryClientProvider>
    {/if}
{/if}

<style>
    :global(body),
    :global(#app) {
        background-color: var(--color-surface-container);
        color: var(--color-on-surface);
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
        background-color: var(--color-background);
        border: 1px solid var(--color-background);
        position: relative;
        flex: 1;
        z-index: -10;
        border-radius: 15px;
        overflow: hidden;
        margin-block-end: var(--spacing-lg);
    }

    :global(.site-content-inner) {
        --content-padding: var(--spacing-xxl);
        container-name: site-content-inner;
        container-type: size;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow-y: auto;
        padding-block-start: var(--spacing-xl);
        padding-block-end: var(--spacing-xl);
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
