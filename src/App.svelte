<script>
    import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
    import {
        ampleVersion,
        ShowLyrics,
        ShowSearch,
        User,
    } from "~/stores/state.js";
    import { loadSettings } from "~/stores/settings";
    import { extendSession } from "~/logic/user.js";
    import { handleMigrations } from "~/logic/migrations.js";

    // Use custom string as dnd-action ID
    import { overrideItemIdKeyNameBeforeInitialisingDndZones } from "svelte-dnd-action";
    import Sidebar from "~/components/sidebar/sidebar.svelte";
    import Queue from "~/components/queue/queue.svelte";
    import Player from "~/components/player/player.svelte";
    import Alerts from "~/components/alert/alertsContainer.svelte";
    import Lyrics from "~/components/lyrics.svelte";
    import Routes from "~/components/routes.svelte";
    import NotificationToasts from "~/components/notification/notificationToasts.svelte";
    import Search from "~/components/search/search.svelte";
    import { tick } from "svelte";
    import { hideLoadingOverlay } from "~/logic/ui.js";

    handleMigrations($ampleVersion);

    overrideItemIdKeyNameBeforeInitialisingDndZones("_id");

    window.setInterval(
        function () {
            if ($User.isLoggedIn) {
                extendSession();
            }
        },
        1000 * 60 * 15,
    );

    // hook into back/forward events
    window.onpopstate = () => {
        $ShowSearch = false;
        $ShowLyrics = false;
    };

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false, // default: true
            },
        },
    });

    $effect(async () => {
        if ($User.isLoggedIn) {
            await loadSettings();
            await tick();
            hideLoadingOverlay();
        }
    });
</script>

<QueryClientProvider client={queryClient}>
    <div class="site-inner">
        <Sidebar />
        <Search />
        <Routes />
        <Queue />
    </div>
    <Player />
    <Lyrics />
    <NotificationToasts />
    <Alerts />
</QueryClientProvider>

<svg width="0" height="0">
    <filter
        id="blur-and-scale"
        y="-50%"
        x="-50%"
        width="300%"
        height="300%"
        color-interpolation-filters="sRGB"
    >
        <!-- blur -->
        <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="100"
            result="Blurred"
        />
        <!-- blur opacity -->
        <feComponentTransfer in="Blurred" result="TransparentBlur">
            <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <!-- saturate -->
        <feColorMatrix
            type="saturate"
            in="TransparentBlur"
            values="10"
            result="Saturated"
        />
        <!-- merge -->
        <feMerge>
            <feMergeNode in="Saturated" />
            <feMergeNode in="SourceGraphic" />
        </feMerge>
    </filter>
</svg>

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
        border-radius: 0 0 15px 15px;
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
        z-index: 1; /* for some reason things became unclickable without this, even in 3.1.1... */
    }

    :global(.site-content-inner > *) {
        grid-column: content;
        overflow-y: hidden; /* prevent Tabulator from growing horizontally */
    }

    :global(.site-player) {
        flex-shrink: 0;
    }
</style>
