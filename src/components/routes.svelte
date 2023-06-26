<script>
    import { customHue, PageLoadedKey } from "../stores/status";
    import Router from 'svelte-spa-router';
    import { wrap } from 'svelte-spa-router/wrap';
    import { closeSidebar } from "../logic/ui.js";
    import NotFound404Page from '../views/notFound404.svelte';
    import HomePage from '../views/home.svelte';

    const routes = {
        '/test': wrap({
            asyncComponent: () => import('../views/test.svelte')
        }),
        '/search': wrap({
            asyncComponent: () => import('../views/advancedSearch.svelte')
        }),
        '/multi-rater': wrap({
            asyncComponent: () => import('../views/multiRater.svelte')
        }),
        '/versions/:songTitle/:artistName': wrap({
            asyncComponent: () => import('../views/songVersions.svelte')
        }),
        '/artists/:id': wrap({
            asyncComponent: () => import('../views/artist.svelte')
        }),
        '/artists': wrap({
            asyncComponent: () => import('../views/artists.svelte')
        }),
        '/album-artists': wrap({
            asyncComponent: () => import('../views/albumArtists.svelte')
        }),
        '/albums/:id': wrap({
            asyncComponent: () => import('../views/album.svelte')
        }),
        '/albums/year/:year': wrap({
            asyncComponent: () => import('../views/albumsByYear.svelte')
        }),
        '/albums/year': wrap({
            asyncComponent: () => import('../views/albumsByYear.svelte')
        }),
        '/albums': wrap({
            asyncComponent: () => import('../views/albums.svelte')
        }),
        '/song/:id': wrap({
            asyncComponent: () => import('../views/song.svelte')
        }),
        '/playlists/:id': wrap({
            asyncComponent: () => import('../views/playlist.svelte')
        }),
        '/playlists': wrap({
            asyncComponent: () => import('../views/playlists.svelte')
        }),
        '/smartlists/:id': wrap({
            asyncComponent: () => import('../views/playlist.svelte')
        }),
        '/smartlists': wrap({
            asyncComponent: () => import('../views/smartlists.svelte')
        }),
        '/mix/:mixType/:id': wrap({
            asyncComponent: () => import('../views/playlist.svelte')
        }),
        '/genres/:id': wrap({
            asyncComponent: () => import('../views/genre.svelte')
        }),
        '/genres': wrap({
            asyncComponent: () => import('../views/genres.svelte')
        }),
        '/newest': wrap({
            asyncComponent: () => import('../views/newest.svelte')
        }),
        '/recent': wrap({
            asyncComponent: () => import('../views/recent.svelte')
        }),
        '/favorites': wrap({
            asyncComponent: () => import('../views/favorites.svelte')
        }),
        '/trending': wrap({
            asyncComponent: () => import('../views/trending.svelte')
        }),
        '/top': wrap({
            asyncComponent: () => import('../views/topRated.svelte')
        }),
        '/forgotten': wrap({
            asyncComponent: () => import('../views/forgotten.svelte')
        }),
        '/random': wrap({
            asyncComponent: () => import('../views/random.svelte')
        }),
        '/unrated': wrap({
            asyncComponent: () => import('../views/unrated.svelte')
        }),
        '/': HomePage,
        '*': NotFound404Page,
    }

    function routeLoading(event) {
        closeSidebar();

        // reset customHue if not on our special pages to avoid flash;
        // their onMount events will add it back in
        switch (event.detail.route) {
            case '/albums/:id':
            case '/artists/:id':
                break;
            default:
                customHue.set(null);
                break;
        }
    }
</script>

{#key $PageLoadedKey || 0}
    <Router {routes} on:routeLoading={routeLoading}/>
{/key}