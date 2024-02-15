<script>
    import { PageLoadedKey } from "~/stores/state.js";
    import { SiteContentBind } from "~/stores/elements.js";
    import Router from "svelte-spa-router";
    import { wrap } from "svelte-spa-router/wrap";
    import { closeSidebar } from "~/logic/ui.js";
    import NotFound404Page from "~/views/notFound404.svelte";
    import HomePage from "~/views/home.svelte";

    const routes = {
        "/search": wrap({
            asyncComponent: () => import("~/views/advancedSearch.svelte"),
        }),
        "/versions/:songTitle/:artistName": wrap({
            asyncComponent: () => import("~/views/songVersions.svelte"),
        }),
        "/artist/:id/:section?": wrap({
            asyncComponent: () => import("~/views/artist/index.svelte"),
        }),
        "/artists/:section?": wrap({
            asyncComponent: () => import("~/views/artists/index.svelte"),
        }),
        "/album-artists/:section?": wrap({
            asyncComponent: () => import("~/views/album-artists/index.svelte"),
        }),
        // "/albums/year/:year": wrap({
        //     asyncComponent: () => import("~/views/albumsByYear.svelte"),
        // }),
        // "/albums/year": wrap({
        //     asyncComponent: () => import("~/views/albumsByYear.svelte"),
        // }),
        "/albums/:section?": wrap({
            asyncComponent: () => import("~/views/albums/index.svelte"),
        }),
        "/album/:id": wrap({
            asyncComponent: () => import("~/views/album.svelte"),
        }),
        "/song/:id": wrap({
            asyncComponent: () => import("~/views/song.svelte"),
        }),
        "/playlist/:id": wrap({
            asyncComponent: () => import("~/views/playlist.svelte"),
        }),
        "/playlists": wrap({
            asyncComponent: () => import("~/views/playlists.svelte"),
        }),
        "/smartlist/:id": wrap({
            asyncComponent: () => import("~/views/playlist.svelte"),
        }),
        "/smartlists": wrap({
            asyncComponent: () => import("~/views/smartlists.svelte"),
        }),
        "/mix/:mixType/:id": wrap({
            asyncComponent: () => import("~/views/playlist.svelte"),
        }),
        "/genre/:id/:section?": wrap({
            asyncComponent: () => import("~/views/genre/index.svelte"),
        }),
        "/genres": wrap({
            asyncComponent: () => import("~/views/genres.svelte"),
        }),
        "/podcasts": wrap({
            asyncComponent: () => import("~/views/podcasts.svelte"),
        }),
        "/podcast/:id": wrap({
            asyncComponent: () => import("~/views/podcast.svelte"),
        }),
        "/podcast-episode/:id": wrap({
            asyncComponent: () => import("~/views/podcastEpisode.svelte"),
        }),
        "/radio": wrap({
            asyncComponent: () => import("~/views/liveStreams.svelte"),
        }),
        "/radio-station/:id": wrap({
            asyncComponent: () => import("~/views/liveStream.svelte"),
        }),
        "/newest": wrap({
            asyncComponent: () => import("~/views/newest.svelte"),
        }),
        "/recent": wrap({
            asyncComponent: () => import("~/views/recent.svelte"),
        }),
        "/favorites/:section?": wrap({
            asyncComponent: () => import("~/views/favorites/index.svelte"),
        }),
        "/trending/:section?": wrap({
            asyncComponent: () => import("~/views/trending/index.svelte"),
        }),
        "/top-rated/:section?": wrap({
            asyncComponent: () => import("~/views/top-rated/index.svelte"),
        }),
        "/forgotten/:section?": wrap({
            asyncComponent: () => import("~/views/forgotten/index.svelte"),
        }),
        "/random/:section?": wrap({
            asyncComponent: () => import("~/views/random/index.svelte"),
        }),
        "/unrated/:section?": wrap({
            asyncComponent: () => import("~/views/unrated/index.svelte"),
        }),
        "/test/:section?": wrap({
            asyncComponent: () => import("~/views/test/index.svelte"),
        }),
        "/": HomePage,
        "*": NotFound404Page,
    };

    function routeLoading(event) {
        closeSidebar();
    }
</script>

<div class="site-content" bind:this={$SiteContentBind}>
    <div class="site-content-inner">
        {#key $PageLoadedKey || 0}
            <Router
                {routes}
                on:routeLoading={routeLoading}
                restoreScrollState={true}
            />
        {/key}
    </div>
</div>
