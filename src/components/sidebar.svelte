<script>
    import { onMount, getContext } from 'svelte';
    import { ROUTER } from 'svelte-routing/src/contexts';
    import { Link } from "svelte-routing";

    import { SidebarIsMini } from '../stores/status';
    import { customHue } from "../stores/status";

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
    import SVGSearch from "../../public/images/search.svg";
    import SVGGenre from "../../public/images/label.svg";
    import SVGMultiStar from "../../public/images/hotel-star.svg";


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

    function toggleMini() {
        let inverted = !$SidebarIsMini;
        localStorage.setItem('SidebarIsMini', JSON.stringify(inverted));
        SidebarIsMini.set(inverted);
    }
</script>

<div class="site-sidebar" class:isMini={$SidebarIsMini}>
    <button class="sidebar-toggle" on:click={toggleMini}>
        {$SidebarIsMini ? ">>" : "<<"}
    </button>
    <div class="site-sidebar-inner">
        <h3 class="panel-title">Library</h3>
        <ul>
            <li class="{basePath === 'artists' ? 'current' : ''}">
                <Link to="artists" class="site-sidebar__link " data-label="Artists">
                    <SVGArtist class="inline"/> <span class="label">Artists</span>
                </Link>
            </li>
            <li class="{basePath === 'albums' ? 'current' : ''}">
                <Link to="albums" class="site-sidebar__link " data-label="Albums">
                    <SVGAlbum class="inline"/> <span class="label">Albums</span>
                </Link>
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

        <h3 class="panel-title">Insights</h3>
        <ul>
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
            <li class="{basePath === 'favorites' ? 'current' : ''}">
                <Link to="favorites" class="site-sidebar__link " data-label="Favorites">
                    <SVGFavoriteFull class="inline"/> <span class="label">Favorites</span>
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

        <h3 class="panel-title">Tools</h3>
        <ul>
            <li class="{basePath === 'search' ? 'current' : ''}">
                <Link to="search" class="site-sidebar__link " data-label="Advanced Search">
                    <SVGSearch class="inline"/> <span class="label">Advanced Search</span>
                </Link>
            </li>
            <li class="{basePath === 'multi-rater' ? 'current' : ''}">
                <Link to="multi-rater" class="site-sidebar__link " data-label="Multi-rater">
                    <SVGMultiStar class="inline"/> <span class="label">Multi-rater</span>
                </Link>
            </li>
        </ul>
    </div>
</div>

<style>
    .sidebar-toggle {
        display: flex;
        position: sticky;
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
        z-index: 100;
    }

    .site-sidebar {
        background-color: var(--color-interface);
        border-right: 1px solid var(--color-border);
        width: var(--size-sidebar-width);
        padding: 0;
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
        padding: var(--spacing-lg);
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

    .site-sidebar.isMini :global(svg) {
        color: var(--color-text-primary);
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

    .isMini h3 {
        font-size: 0;
    }

    .isMini :global(svg) {
        transform: scale(1.5);
    }

    .isMini li.current :global(svg) {
        color: var(--color-highlight);
    }

    .isMini li:not(.current) :global(svg) {
        opacity: 0.5;
    }

    /* hover label for mini mode */
    .isMini :global(a:after) {
        background-color: var(--color-interface);
        color: var(--color-text-primary);
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
        opacity: 0;
        display: none; /* disabled in favor of scrollable mini mode, pending solution */
    }

    .isMini :global(a:hover:after) {
        opacity: 1;
    }

    :global(.site-sidebar__link svg) {
        padding-right: var(--spacing-sm);
    }

    li.current :global(.site-sidebar__link) {
        position: relative;
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

    h3 {
        margin-top: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
    }

    ul + h3 {
        margin-top: var(--spacing-xl);
    }

    ul {
        margin: 0;
    }
</style>