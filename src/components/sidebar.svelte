<script>
    import { onMount, getContext } from 'svelte';
    import { ROUTER } from 'svelte-routing/src/contexts';
    import { Link } from "svelte-routing";

    import { SidebarIsMini } from '../stores/status';
    import { customHue } from "../stores/status";

    import SidebarDrawer from './sidebarDrawer.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGPlaylist from "../../public/images/queue_music.svg";
    import SVGSmartlist from "../../public/images/smartlist.svg";
    import SVGStarFull from "../../public/images/star_full.svg";
    import SVGStarOutline from "../../public/images/star_outline.svg";
    import SVGFavoriteFull from "../../public/images/favorite_full.svg";
    import SVGRecent from "../../public/images/recent.svg";
    import SVGNew from "../../public/images/new.svg";
    import SVGTrending from "../../public/images/trending_up.svg";
    import SVGForgotten from "../../public/images/trending_down.svg";
    import SVGRandom from "../../public/images/random.svg";
    import SVGArrowLeft from "../../public/images/arrow_left.svg";
    import SVGArrowRight from "../../public/images/arrow_right.svg";
    import SVGGenre from "../../public/images/label.svg";


    const { activeRoute } = getContext(ROUTER);
    let basePath = '';

    $: {
        if ($activeRoute !== null) {
            basePath = $activeRoute.route._path.split(/\//)[0];

            // reset customHue if not on our special pages
            // their onMount events will add it back in
            switch ($activeRoute.route._path) {
                case 'albums/:id':
                case 'artists/:id':
                    break;
                default:
                    customHue.set(null);
                    break;
            }
        }
    }

    let artistsDrawerIsVisible = false;
    let albumsDrawerIsVisible = false;
    let initialized = false;

    function toggleArtistsDrawer() {
        artistsDrawerIsVisible = !artistsDrawerIsVisible;
    }

    function toggleAlbumsDrawer() {
        albumsDrawerIsVisible = !albumsDrawerIsVisible;
    }

    function toggleMini() {
        let inverted = !$SidebarIsMini;
        localStorage.setItem('SidebarIsMini', JSON.stringify(inverted));
        SidebarIsMini.set(inverted);
    }

    onMount(() => {
        // wait for sidebar to be ready before loading the sidebardrawer components
        initialized = true;
    });
</script>

<div class="site-sidebar" class:isMini={$SidebarIsMini}>
    <div class="site-sidebar-inner">
        <button class="sidebar-toggle" on:click={toggleMini}>
            {$SidebarIsMini ? ">>" : "<<"}
        </button>
        <h3>Library</h3>
        <ul>
            <li class="{basePath === 'artists' ? 'current' : ''}">
                <Link to="artists" class="site-sidebar__link " data-label="Artists">
                    <SVGArtist class="inline"/> <span class="label">Artists</span>
                </Link>
                <button id="js-drawer-artists" class="drawer-toggle icon" class:open={artistsDrawerIsVisible} on:click={toggleArtistsDrawer}>
                    {#if artistsDrawerIsVisible}
                        <SVGArrowLeft />
                    {:else}
                        <SVGArrowRight />
                    {/if}
                </button>
            </li>
            <li class="{basePath === 'albums' ? 'current' : ''}">
                <Link to="albums" class="site-sidebar__link " data-label="Albums">
                    <SVGAlbum class="inline"/> <span class="label">Albums</span>
                </Link>
                <button id="js-drawer-albums" class="drawer-toggle icon" class:open={albumsDrawerIsVisible} on:click={toggleAlbumsDrawer}>
                    {#if albumsDrawerIsVisible}
                        <SVGArrowLeft />
                    {:else}
                        <SVGArrowRight />
                    {/if}
                </button>
            </li>
            <li class="{basePath === 'playlists' ? 'current' : ''}">
                <Link to="playlists" class="site-sidebar__link " data-label="Playlists">
                    <SVGPlaylist class="inline"/> <span class="label">Playlists</span>
                </Link>
            </li>
            <li class="{basePath === 'smartlists' ? 'current' : ''}">
                <Link to="smartlists" class="site-sidebar__link " data-label="Smartlists">
                    <SVGSmartlist class="inline"/> <span class="label">Smartlists</span>
                </Link>
            </li>
            <li class="{basePath === 'genres' ? 'current' : ''}">
                <Link to="genres" class="site-sidebar__link " data-label="Genres">
                    <SVGGenre class="inline"/> <span class="label">Genres</span>
                </Link>
            </li>
        </ul>

        <h3>Insights</h3>
        <ul>
            <li class="{basePath === 'favorites' ? 'current' : ''}">
                <Link to="favorites" class="site-sidebar__link " data-label="Favorites">
                    <SVGFavoriteFull class="inline"/> <span class="label">Favorites</span>
                </Link>
            </li>
            <li class="{basePath === 'recent' ? 'current' : ''}">
                <Link to="recent" class="site-sidebar__link " data-label="Recent">
                    <SVGRecent class="inline"/> <span class="label">Recent</span>
                </Link>
            </li>
            <li class="{basePath === 'newest' ? 'current' : ''}">
                <Link to="newest" class="site-sidebar__link " data-label="Newest">
                    <SVGNew class="inline"/> <span class="label">Newest</span>
                </Link>
            </li>
            <li class="{basePath === 'trending' ? 'current' : ''}">
                <Link to="trending" class="site-sidebar__link " data-label="Trending">
                    <SVGTrending class="inline"/> <span class="label">Trending</span>
                </Link>
            </li>
            <li class="{basePath === 'top' ? 'current' : ''}">
                <Link to="top" class="site-sidebar__link " data-label="Top Rated">
                    <SVGStarFull class="inline"/> <span class="label">Top Rated</span>
                </Link>
            </li>
            <li class="{basePath === 'forgotten' ? 'current' : ''}">
                <Link to="forgotten" class="site-sidebar__link " data-label="Forgotten">
                    <SVGForgotten class="inline"/> <span class="label">Forgotten</span>
                </Link>
            </li>
            <li class="{basePath === 'random' ? 'current' : ''}">
                <Link to="random" class="site-sidebar__link " data-label="Random">
                    <SVGRandom class="inline"/> <span class="label">Random</span>
                </Link>
            </li>
            <li class="{basePath === 'unrated' ? 'current' : ''}">
                <Link to="unrated" class="site-sidebar__link " data-label="Unrated">
                    <SVGStarOutline class="inline"/> <span class="label">Unrated</span>
                </Link>
            </li>
        </ul>
    </div>

    {#if initialized}
<!--        <SidebarDrawer type="artist" bind:visible={artistsDrawerIsVisible} toggleElement={document.querySelector("#js-drawer-artists")} />-->
<!--        <SidebarDrawer type="album" bind:visible={albumsDrawerIsVisible} toggleElement={document.querySelector("#js-drawer-albums")} />-->
    {/if}
</div>

<style>
    .sidebar-toggle {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        border-radius: 0;
        text-align: center;
        line-height: 1;
        background-color: var(--color-interface);
        border-bottom: 1px solid var(--color-border);
        justify-content: center;
        align-items: center;
        padding-bottom: 2px;
    }

    .site-sidebar {
        background-color: var(--color-interface);
        border-right: 1px solid var(--color-border);
        width: var(--size-sidebar-width);
        padding: var(--spacing-lg);
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
    }

    .site-sidebar-inner:after {
        content: '';
        padding: inherit;
        padding-top: 0;
        display: block;
    }

    .site-sidebar-inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        padding: inherit;
    }

    .site-sidebar:not(.isMini) .site-sidebar-inner {
        padding-top: var(--spacing-xl);
    }

    :global(.site-sidebar__link) {
        display: block;
        padding: 0.45em 0;
        position: relative;
    }

    li {
        position: relative;
        z-index: 1;
    }

    li :global(svg) {
        color: var(--color-icon);
    }

    .site-sidebar.isMini {
        --size-sidebar-width: 46px;
    }

    .isMini .label {
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }

    .isMini .site-sidebar-inner {
        overflow: unset;
    }

    .isMini h3 {
        font-size: 0;
    }

    .isMini :global(svg) {
        transform: scale(1.5);
    }

    .isMini li:not(.current) :global(svg) {
        /*color: unset;*/
    }

    /* hover label for mini mode */
    .isMini :global(a:after) {
        background-color: var(--color-interface);
        box-shadow: var(--shadow-sm);
        clip-path: inset(-10px -10px -10px 0px); /* clip shadow */
        content: attr(data-label);
        display: flex;
        align-items: center;
        position: absolute;
        left: calc(100% + var(--spacing-lg));
        top: 0;
        bottom: 0;
        z-index: 5;
        padding: var(--spacing-sm) var(--spacing-md);
        pointer-events: none;
        white-space: nowrap;
        font-weight: 700;
        opacity: 0;
    }

    .isMini :global(a:hover:after) {
        opacity: 1;
    }

    :global(.site-sidebar__link svg) {
        padding-right: var(--spacing-sm);
    }

    li.current :global(.site-sidebar__link) {
        position: relative;
        font-weight: 700;
    }

    li.current:before {
        content: '';
        width: calc(100% + 2 * var(--spacing-lg));
        height: 100%;
        background-color: var(--color-card-primary);
        position: absolute;
        left: calc(-1 * var(--spacing-lg));
        top: 50%;
        transform: translateY(-50%);
    }

    .drawer-toggle.open {
        background-color: var(--color-lines);
    }

    .drawer-toggle {
        padding: 0;
        width: 20px;
        height: 20px;
        border-radius: 100vh;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
        display: none; /* TODO restore if all artists/albums can be handled well */
    }

    .isMini .drawer-toggle {
        display: none;
    }

    /* increase click area */
    .drawer-toggle:before {
        content: '';
        top: -10px;
        right: -10px;
        bottom: -10px;
        left: -10px;
        display: block;
        position: absolute;
        z-index: -1;
    }

    .drawer-toggle :global(svg) {
        color: var(--color-highlight);
        transform: scale(1.5);
    }

    h3 {
        margin-top: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        text-transform: uppercase;
        letter-spacing: 0.025em;
        font-size: 14px;
    }

    ul + h3 {
        margin-top: var(--spacing-xl);
    }

    ul {
        margin: 0;
    }
</style>