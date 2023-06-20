<script>
    import { PageLoadedKey } from "../stores/status";
    import { Route } from "svelte-routing";
    import NotFound404Page from '../views/notFound404.svelte';
    import HomePage from '../views/home.svelte';
</script>

{#key $PageLoadedKey || 0}
    <Route path="test"              component={() => import('../views/test.svelte')}/>
    <Route path="search"            component={() => import('../views/advancedSearch.svelte')}/>
    <Route path="multi-rater"       component={() => import('../views/multiRater.svelte')}/>
    <Route path="versions/:songTitle/:artistName" component={() => import('../views/songVersions.svelte')}/>
    <Route path="artists/:id"       component={() => import('../views/artist.svelte')}/>
    <Route path="artists"           component={() => import('../views/artists.svelte')}/>
    <Route path="album-artists"     component={() => import('../views/albumArtists.svelte')}/>
    <Route path="albums/:id"        component={() => import('../views/album.svelte')}/>
    <Route path="albums/year/:year" component={() => import('../views/albumsByYear.svelte')}/>
    <Route path="albums/year"       component={() => import('../views/albumsByYear.svelte')}/>
    <Route path="albums"            component={() => import('../views/albums.svelte')}/>
    <Route path="song/:id"          component={() => import('../views/song.svelte')}/>
    <Route path="playlists/:id"     component={() => import('../views/playlist.svelte')}/>
    <Route path="playlists"         component={() => import('../views/playlists.svelte')}/>
    <Route path="smartlists/:id"    component={() => import('../views/playlist.svelte')}/>
    <Route path="smartlists"        component={() => import('../views/smartlists.svelte')}/>
    <Route path="mix/:mixType/:id"  component={() => import('../views/playlist.svelte')}/>
    <Route path="genres/:id"        component={() => import('../views/genre.svelte')}/>
    <Route path="genres"            component={() => import('../views/genres.svelte')}/>
    <Route path="newest"            component={() => import('../views/newest.svelte')}/>
    <Route path="recent"            component={() => import('../views/recent.svelte')}/>
    <Route path="favorites"         component={() => import('../views/favorites.svelte')}/>
    <Route path="trending"          component={() => import('../views/trending.svelte')}/>
    <Route path="top"               component={() => import('../views/topRated.svelte')}/>
    <Route path="forgotten"         component={() => import('../views/forgotten.svelte')}/>
    <Route path="random"            component={() => import('../views/random.svelte')}/>
    <Route path="unrated"           component={() => import('../views/unrated.svelte')}/>
    <Route path=""                  component={HomePage}/>
    <Route path="/"                 component={HomePage}/>
    <Route path="*"                 component={NotFound404Page}/>
{/key}