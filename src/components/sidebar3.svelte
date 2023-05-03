<script>
    import { getContext } from 'svelte';
    import { ROUTER } from 'svelte-routing/src/contexts';
    import { Link } from "svelte-routing";
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';
    import {
        SidebarIsMini,
        SidebarIsOpen,
        SidebarIsPinned,
        customHue,
        IsMobile
    } from '../stores/status';
    import { SiteSidebarBind } from "../stores/player";
    import { tooltip } from "../actions/tooltip";

    import SVGGrid from "/src/images/grid.svg";
    import SVGArtist from "/src/images/artist.svg";
    import SVGArtistHollow from "/src/images/person_outline.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGPlaylist from "/src/images/queue_music.svg";
    import SVGSmartlist from "/src/images/smartlist.svg";
    import SVGStarFull from "/src/images/star_full.svg";
    import SVGStarOutline from "/src/images/star_outline.svg";
    import SVGFavoriteFull from "/src/images/favorite_full.svg";
    import SVGRecent from "/src/images/recent.svg";
    import SVGNew from "/src/images/new.svg";
    import SVGTrending from "/src/images/trending_up.svg";
    import SVGForgotten from "/src/images/trending_down.svg";
    import SVGRandom from "/src/images/random.svg";
    import SVGSearch from "/src/images/search.svg";
    import SVGGenre from "/src/images/label.svg";
    import SVGMultiStar from "/src/images/hotel-star.svg";

    const { activeRoute } = getContext(ROUTER);
    let basePath = '';
    let tooltipPlacement = 'right';

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

    function handleClickOutside() {
        if ($IsMobile) {
            let status = false;
            localStorage.setItem('SidebarIsOpen', JSON.stringify(status));
            SidebarIsOpen.set(status);
        }
    }
</script>

<div class="site-sidebar"
    class:is-list={$IsMobile || $SidebarIsOpen}
    class:is-mini={!$SidebarIsOpen && !$IsMobile}
    class:is-open={$SidebarIsOpen}
    class:is-drawer={$IsMobile}
    bind:this={$SiteSidebarBind}
    use:clickOutsideDetector={{
        toggle: "#sidebar-button",
        ignore: '.site-sidebar'
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="site-sidebar-inner">
        <ul>
            <li class:current={basePath === ''}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Dashboard', placement: tooltipPlacement}}
            >
                <Link to="{import.meta.env.BASE_URL}"
                      class="site-sidebar__link "
                      data-label="Dashboard"
                >
                    <SVGGrid />
                    <span class="label">
                        Dashboard
                    </span>
                </Link>
            </li>
        </ul>

        <h3 class="panel-title">Library</h3>
        <ul>
            <li class:current={basePath === 'artists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Artists', placement: tooltipPlacement}}
            >
                <Link to="artists" class="site-sidebar__link " data-label="Artists">
                    <SVGArtistHollow />
                    <span class="label">
                        Artists
                    </span>
                </Link>
            </li>
            <li class:current={basePath === 'album-artists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Album Artists', placement: tooltipPlacement}}
            >
                <Link to="album-artists" class="site-sidebar__link " data-label="Album Artists">
                    <SVGArtist />
                    <span class="label">
                        Album Artists
                    </span>
                </Link>
            </li>
            <li class:current={basePath === 'albums'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Albums', placement: tooltipPlacement}}
            >
                <Link to="albums" class="site-sidebar__link " data-label="Albums">
                    <SVGAlbum style="transform: scale(0.9)" /> <span class="label">Albums</span>
                </Link>
            </li>
            <li class:current={basePath === 'playlists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Playlists', placement: tooltipPlacement}}
            >
                <Link to="playlists" class="site-sidebar__link " data-label="Playlists">
                    <SVGPlaylist /> <span class="label">Playlists</span>
                </Link>
            </li>
            <li class:current={basePath === 'smartlists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Smartlists', placement: tooltipPlacement}}
            >
                <Link to="smartlists" class="site-sidebar__link " data-label="Smartlists">
                    <SVGSmartlist /> <span class="label">Smartlists</span>
                </Link>
            </li>
            <li class:current={basePath === 'genres'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Genres', placement: tooltipPlacement}}
            >
                <Link to="genres" class="site-sidebar__link " data-label="Genres">
                    <SVGGenre style="transform: scale(0.9)" /> <span class="label">Genres</span>
                </Link>
            </li>
            <!--
            <li class:current={basePath === 'podcasts'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Podcasts', placement: tooltipPlacement}}
            >
                <Link to="podcasts" class="site-sidebar__link " data-label="Podcasts">
                    <SVGPodcast /> <span class="label">Podcasts</span>
                </Link>
            </li>
            -->
        </ul>

        <h3 class="panel-title">Insights</h3>
        <ul>
            <li class:current={basePath === 'recent'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Recent', placement: tooltipPlacement}}
            >
                <Link to="recent" class="site-sidebar__link " data-label="Recent">
                    <SVGRecent /> <span class="label">Recent</span>
                </Link>
            </li>
            <li class:current={basePath === 'newest'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Newest', placement: tooltipPlacement}}
            >
                <Link to="newest" class="site-sidebar__link " data-label="Newest">
                    <SVGNew style="transform: scale(0.85)" /> <span class="label">Newest</span>
                </Link>
            </li>
            <li class:current={basePath === 'favorites'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Favorites', placement: tooltipPlacement}}
            >
                <Link to="favorites" class="site-sidebar__link " data-label="Favorites">
                    <SVGFavoriteFull style="transform: scale(0.85)" /> <span class="label">Favorites</span>
                </Link>
            </li>
            <li class:current={basePath === 'trending'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Trending', placement: tooltipPlacement}}
            >
                <Link to="trending" class="site-sidebar__link " data-label="Trending">
                    <SVGTrending /> <span class="label">Trending</span>
                </Link>
            </li>
            <li class:current={basePath === 'top'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Top Rated', placement: tooltipPlacement}}
            >
                <Link to="top" class="site-sidebar__link " data-label="Top Rated">
                    <SVGStarFull /> <span class="label">Top Rated</span>
                </Link>
            </li>
            <li class:current={basePath === 'forgotten'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Forgotten', placement: tooltipPlacement}}
            >
                <Link to="forgotten" class="site-sidebar__link " data-label="Forgotten">
                    <SVGForgotten /> <span class="label">Forgotten</span>
                </Link>
            </li>
            <li class:current={basePath === 'random'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Random', placement: tooltipPlacement}}
            >
                <Link to="random" class="site-sidebar__link " data-label="Random">
                    <SVGRandom /> <span class="label">Random</span>
                </Link>
            </li>
            <li class:current={basePath === 'unrated'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Unrated', placement: tooltipPlacement}}
            >
                <Link to="unrated" class="site-sidebar__link " data-label="Unrated">
                    <SVGStarOutline /> <span class="label">Unrated</span>
                </Link>
            </li>
        </ul>

        <h3 class="panel-title">Tools</h3>
        <ul>
            <li class:current={basePath === 'search'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Advanced Search', placement: tooltipPlacement}}
            >
                <Link to="search" class="site-sidebar__link " data-label="Advanced Search">
                    <SVGSearch /> <span class="label">Advanced Search</span>
                </Link>
            </li>
            <li class:current={basePath === 'multi-rater'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: 'Multi-rater', placement: tooltipPlacement}}
            >
                <Link to="multi-rater" class="site-sidebar__link " data-label="Multi-rater">
                    <SVGMultiStar style="transform: scale(0.9)" /> <span class="label">Multi-rater</span>
                </Link>
            </li>
        </ul>
    </div>
</div>

<style>
    /* TODO: move to global stylesheet */
    :global(.tooltip) {
        display: none;
        width: max-content;
        position: absolute;
        top: 0;
        left: 0;
        background: #222;
        color: white;
        font-weight: bold;
        padding: 5px;
        border-radius: 4px;
        font-size: 90%;
        z-index: 100000;
    }

    /*
    Base
    */
    .site-sidebar {
        --sidebar-padding: var(--spacing-lg);
        background-color: var(--color-background);
        width: var(--size-sidebar-width);
        padding: 0;
        display: flex;
        flex-direction: column;
        position: relative;
        transform: none;
        left: 0;
        transition: transform 0.3s ease-out;
        z-index: 30;
        will-change: transform;
    }

    .site-sidebar-inner {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
        padding: var(--sidebar-padding) 0;
        padding-right: var(--spacing-sm);
    }

    :global(.site-sidebar__link) {
        display: flex;
        padding: 0.3em var(--sidebar-padding) 0.4em;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    .site-sidebar :global(svg) {
        height: 1.5em;
        width: 1.5em;
        display: inline-flex;
        color: var(--color-icon);
        flex-shrink: 0;
    }

    li.current {
        font-weight: 700;
        font-stretch: 70%;
        background-color: var(--color-interface);
        border-radius: 0 99rem 99rem 0;
        box-shadow: var(--shadow-sm);
    }

    .panel-title {
        margin: var(--spacing-lg) var(--sidebar-padding) var(--spacing-sm);
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: .03em;
        color: var(--color-highlight);
    }

    .label {
        margin-left: var(--spacing-md);
        flex: 1;
        max-width: calc(100% - var(--sidebar-padding));
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .site-sidebar.is-list :global(svg) {
        position: relative;
        bottom: 0.06em;
    }

    /*
    Mini mode
    */
    .site-sidebar.is-mini {
        --size-sidebar-width: 50px;
    }

    .site-sidebar.is-mini .label,
    .site-sidebar.is-mini .panel-title {
        display: none;
    }

    /*
    Drawer mode
    */
    .site-sidebar.is-drawer {
        position: absolute;
        top: var(--size-header-height);
        bottom: var(--size-webplayer-height);
        box-shadow: var(--shadow-xxl);
    }

    .site-sidebar.is-drawer:after {
        content: '';
        height: 100%;
        width: 100vw;
        display: block;
        background-color: rgba(0, 0, 0, 0.5);
        left: 100%;
        position: absolute;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        backdrop-filter: blur(1px);
    }

    .site-sidebar.is-drawer.is-open:after {
        opacity: 1;
    }

    .site-sidebar.is-drawer:not(.is-open) {
        transform: translateX(-100%);
    }
</style>