<script>
    import { SiteContentBind } from "~/stores/elements.js";
    import Router from "svelte-spa-router";
    import { wrap } from "svelte-spa-router/wrap";
    import { fade } from "svelte/transition";

    const routes = {
        "/advanced-search": wrap({
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
        "/albums/:section?": wrap({
            asyncComponent: () => import("~/views/albums/index.svelte"),
        }),
        "/albums/year/:year": wrap({
            asyncComponent: () => import("~/views/albumsByYear.svelte"),
        }),
        "/album/:id": wrap({
            asyncComponent: () => import("~/views/album/index.svelte"),
        }),
        "/song/:id": wrap({
            asyncComponent: () => import("~/views/song.svelte"),
        }),
        "/playlist/:id": wrap({
            asyncComponent: () => import("~/views/playlist/index.svelte"),
        }),
        "/playlists/:section?": wrap({
            asyncComponent: () => import("~/views/playlists/index.svelte"),
        }),
        "/smartlist/:id": wrap({
            asyncComponent: () => import("~/views/playlist/index.svelte"),
        }),
        "/smartlists/:section?": wrap({
            asyncComponent: () => import("~/views/smartlists/index.svelte"),
        }),
        "/mix/:mixType/:id": wrap({
            asyncComponent: () => import("~/views/playlist/index.svelte"),
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
        "/shares": wrap({
            asyncComponent: () => import("~/views/shares.svelte"),
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
        "/": wrap({
            asyncComponent: () => import("~/views/home.svelte"),
        }),
        "*": wrap({
            asyncComponent: () => import("~/views/notFound404.svelte"),
        }),
    };

    let thisRoute = "";
</script>

<div bind:this={$SiteContentBind} class="site-content">
    {#key thisRoute}
        <div class="site-content-inner" in:fade>
            <Router
                restoreScrollState={true}
                {routes}
                on:routeLoaded={(e) => {
                    thisRoute =
                        e.detail.route +
                        new URLSearchParams(
                            (({ section, ...rest }) => rest)(
                                e.detail.params || {},
                            ),
                        ).toString();
                }}
            />
        </div>
    {/key}
</div>
