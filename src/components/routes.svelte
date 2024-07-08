<script>
    import { SiteContentBind } from "~/stores/elements.js";
    import Router from "svelte-spa-router";
    import { wrap } from "svelte-spa-router/wrap";
    import { closeSidebar } from "~/logic/ui.js";
    import NotFound404Page from "~/views/notFound404.svelte";
    import HomePage from "~/views/home.svelte";
    import AdvancedSearch from "~/views/advancedSearch.svelte";
    import SongVersions from "~/views/songVersions.svelte";
    import ArtistIndex from "~/views/artist/index.svelte";
    import ArtistsIndex from "~/views/artists/index.svelte";
    import AlbumArtistsIndex from "~/views/album-artists/index.svelte";
    import AlbumsIndex from "~/views/albums/index.svelte";
    import Album from "~/views/album/index.svelte";
    import Song from "~/views/song.svelte";
    import Genre from "~/views/genre/index.svelte";
    import Genres from "~/views/genres.svelte";
    import Podcast from "~/views/podcast.svelte";
    import Podcasts from "~/views/podcasts.svelte";
    import PodcastEpisode from "~/views/podcastEpisode.svelte";
    import Playlist from "~/views/playlist.svelte";
    import Playlists from "~/views/playlists/index.svelte";
    import Smartlists from "~/views/smartlists.svelte";
    import LiveStreams from "~/views/liveStreams.svelte";
    import LiveStream from "~/views/liveStream.svelte";
    import Newest from "~/views/newest.svelte";
    import Recent from "~/views/recent.svelte";
    import FavoritesIndex from "~/views/favorites/index.svelte";
    import TrendingIndex from "~/views/trending/index.svelte";
    import TopRatedIndex from "~/views/top-rated/index.svelte";
    import ForgottenIndex from "~/views/forgotten/index.svelte";
    import RandomIndex from "~/views/random/index.svelte";
    import UnratedIndex from "~/views/unrated/index.svelte";

    const routes = {
        "/search": AdvancedSearch,
        "/versions/:songTitle/:artistName": SongVersions,
        "/artist/:id/:section?": ArtistIndex,
        "/artists/:section?": ArtistsIndex,
        "/album-artists/:section?": AlbumArtistsIndex,
        // "/albums/year/:year": AlbumsByYear,
        // "/albums/year": AlbumsByYear,
        "/albums/:section?": AlbumsIndex,
        "/album/:id": Album,
        "/song/:id": Song,
        "/playlist/:id": Playlist,
        "/playlists/:section?": Playlists,
        "/smartlist/:id": Playlist,
        "/smartlists/:section?": Smartlists,
        "/mix/:mixType/:id": Playlist,
        "/genre/:id/:section?": Genre,
        "/genres": Genres,
        "/podcasts": Podcasts,
        "/podcast/:id": Podcast,
        "/podcast-episode/:id": PodcastEpisode,
        "/radio": LiveStreams,
        "/radio-station/:id": LiveStream,
        "/newest": Newest,
        "/recent": Recent,
        "/favorites/:section?": FavoritesIndex,
        "/trending/:section?": TrendingIndex,
        "/top-rated/:section?": TopRatedIndex,
        "/forgotten/:section?": ForgottenIndex,
        "/random/:section?": RandomIndex,
        "/unrated/:section?": UnratedIndex,
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

<div bind:this={$SiteContentBind} class="site-content">
    <div class="site-content-inner">
        <Router
            on:routeLoading={routeLoading}
            restoreScrollState={true}
            {routes}
        />
    </div>
</div>
