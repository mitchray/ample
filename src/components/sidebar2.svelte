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
        SidebarIsGrid
    } from '../stores/status';
    import { SiteSidebarBind } from "../stores/player";

    import Menu from '../components/menu.svelte';

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
    import SVGPodcast from "/src/images/podcasts.svg";
    import SVGMultiStar from "/src/images/hotel-star.svg";
    import SVGLock from "/src/images/lock.svg";
    import SVGUnlock from "/src/images/lock_open.svg";
    import SVGLeft from "/src/images/double_arrow_left.svg";
    import SVGRight from "/src/images/double_arrow_right.svg";
    import SVGMenu from "/src/images/more-hori.svg";

    const { activeRoute } = getContext(ROUTER);
    let basePath = '';
    let menuIsVisible = false;

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

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function handleDisplayMode() {
        let inverted = !$SidebarIsGrid;
        localStorage.setItem('SidebarIsGrid', JSON.stringify(inverted));
        SidebarIsGrid.set(inverted);
    }

    function toggleMini() {
        let inverted = !$SidebarIsMini;
        localStorage.setItem('SidebarIsMini', JSON.stringify(inverted));
        SidebarIsMini.set(inverted);
    }

    function togglePinned() {
        let inverted = !$SidebarIsPinned;
        localStorage.setItem('SidebarIsPinned', JSON.stringify(inverted));
        SidebarIsPinned.set(inverted);
    }

    function handleClickOutside() {
        if (!$SidebarIsPinned) {
            let status = false;
            localStorage.setItem('SidebarIsOpen', JSON.stringify(status));
            SidebarIsOpen.set(status);
        }
    }
</script>

<div class="site-sidebar"
    class:is-mini={$SidebarIsMini}
    class:is-open={$SidebarIsOpen}
    class:is-pinned={$SidebarIsPinned}
    class:is-grid={$SidebarIsGrid || $SidebarIsMini}
    bind:this={$SiteSidebarBind}
    use:clickOutsideDetector={{
        toggle: "#sidebar-button",
        ignore: '.site-sidebar'
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="panel-actions">
        <button class="panel-action" on:click={toggleMini}>
            {#if $SidebarIsMini}
                <SVGRight />
            {:else}
                <SVGLeft />
            {/if}
        </button>

        <button class="panel-action" on:click={togglePinned}>
            {#if $SidebarIsPinned}
                <SVGLock style="transform: scale(0.8)" />
            {:else}
                <SVGUnlock style="transform: scale(0.8)" />
            {/if}
        </button>

        <button
            id="sidebarMenu"
            class="panel-action"
            title="Sidebar settings"
            on:click={toggleMenu}
        >
            <SVGMenu />
        </button>
    </div>
    <div class="site-sidebar-inner">
        <h3 class="panel-title">Library</h3>
        <ul>
            <li class:current={basePath === 'artists'}>
                <Link to="artists" class="site-sidebar__link " data-label="Artists">
                    <SVGArtistHollow />
                    <span class="label">
                        Artists
                    </span>
                </Link>
            </li>
            <li class:current={basePath === 'album-artists'}>
                <Link to="album-artists" class="site-sidebar__link " data-label="Album Artists">
                    <SVGArtist />
                    <span class="label">
                        Album Artists
                    </span>
                </Link>
            </li>
            <li class:current={basePath === 'albums'}>
                <Link to="albums" class="site-sidebar__link " data-label="Albums">
                    <SVGAlbum /> <span class="label">Albums</span>
                </Link>
            </li>
            <li class:current={basePath === 'playlists'}>
                <Link to="playlists" class="site-sidebar__link " data-label="Playlists">
                    <SVGPlaylist /> <span class="label">Playlists</span>
                </Link>
            </li>
            <li class:current={basePath === 'smartlists'}>
                <Link to="smartlists" class="site-sidebar__link " data-label="Smartlists">
                    <SVGSmartlist /> <span class="label">Smartlists</span>
                </Link>
            </li>
            <li class:current={basePath === 'genres'}>
                <Link to="genres" class="site-sidebar__link " data-label="Genres">
                    <SVGGenre /> <span class="label">Genres</span>
                </Link>
            </li>
            <!--
            <li class:current={basePath === 'podcasts'}>
                <Link to="podcasts" class="site-sidebar__link " data-label="Podcasts">
                    <SVGPodcast /> <span class="label">Podcasts</span>
                </Link>
            </li>
            -->
        </ul>

        <h3 class="panel-title">Insights</h3>
        <ul>
            <li class:current={basePath === 'recent'}>
                <Link to="recent" class="site-sidebar__link " data-label="Recent">
                    <SVGRecent /> <span class="label">Recent</span>
                </Link>
            </li>
            <li class:current={basePath === 'newest'}>
                <Link to="newest" class="site-sidebar__link " data-label="Newest">
                    <SVGNew /> <span class="label">Newest</span>
                </Link>
            </li>
            <li class:current={basePath === 'favorites'}>
                <Link to="favorites" class="site-sidebar__link " data-label="Favorites">
                    <SVGFavoriteFull /> <span class="label">Favorites</span>
                </Link>
            </li>
            <li class:current={basePath === 'trending'}>
                <Link to="trending" class="site-sidebar__link " data-label="Trending">
                    <SVGTrending /> <span class="label">Trending</span>
                </Link>
            </li>
            <li class:current={basePath === 'top'}>
                <Link to="top" class="site-sidebar__link " data-label="Top Rated">
                    <SVGStarFull /> <span class="label">Top Rated</span>
                </Link>
            </li>
            <li class:current={basePath === 'forgotten'}>
                <Link to="forgotten" class="site-sidebar__link " data-label="Forgotten">
                    <SVGForgotten /> <span class="label">Forgotten</span>
                </Link>
            </li>
            <li class:current={basePath === 'random'}>
                <Link to="random" class="site-sidebar__link " data-label="Random">
                    <SVGRandom /> <span class="label">Random</span>
                </Link>
            </li>
            <li class:current={basePath === 'unrated'}>
                <Link to="unrated" class="site-sidebar__link " data-label="Unrated">
                    <SVGStarOutline /> <span class="label">Unrated</span>
                </Link>
            </li>
        </ul>

        <h3 class="panel-title">Tools</h3>
        <ul>
            <li class:current={basePath === 'search'}>
                <Link to="search" class="site-sidebar__link " data-label="Advanced Search">
                    <SVGSearch /> <span class="label">Advanced Search</span>
                </Link>
            </li>
            <li class:current={basePath === 'multi-rater'}>
                <Link to="multi-rater" class="site-sidebar__link " data-label="Multi-rater">
                    <SVGMultiStar /> <span class="label">Multi-rater</span>
                </Link>
            </li>
        </ul>
    </div>
</div>

{#if menuIsVisible}
    <Menu anchor="bottom-left" toggleSelector={"#sidebarMenu"} bind:isVisible={menuIsVisible} >
        <div class="header panel-header">
            <h4 class="title panel-title">Sidebar Settings</h4>
        </div>

        <div class="panel-content">
            <div class="group">
                <label class="toggle">
                    <input type="checkbox" on:change={handleDisplayMode} bind:checked={$SidebarIsGrid} />
                    Display as grid
                </label>

                <div class="info">Menu items will be shown in a grid</div>
            </div>
        </div>
    </Menu>
{/if}

<style>
    /*
    Sidebar base
    */
    .site-sidebar {
        background-color: var(--color-interface);
        border-right: 1px solid var(--color-border);
        width: var(--size-sidebar-width);
        padding: 0;
        display: flex;
        flex-direction: column;
        position: absolute;
        transform: translateX(-100%);
        left: 0;
        transition: transform 0.3s ease-out;
        z-index: 30;
        will-change: transform;
    }

    .site-sidebar:not(.is-pinned) {
        top: var(--size-header-height);
        bottom: var(--size-webplayer-height);
    }

    .site-sidebar.is-open {
        transform: none;
    }

    .site-sidebar.is-pinned {
        position: relative;
        transition-duration: 0s;
    }

    .site-sidebar.is-pinned:not(.is-open) {
        display: none;
    }

    .site-sidebar-inner:after {
        content: '';
        padding-bottom: var(--spacing-md);
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
    }

    .site-sidebar:not(.is-mini) .site-sidebar-inner {
        padding-top: var(--spacing-xl);
    }

    /*
    Contents - Common
    */
    .site-sidebar .panel-title {
        padding: var(--spacing-md) var(--spacing-lg) 0;
    }

    .site-sidebar-inner :global(svg) {
        fill: var(--color-icon);
    }

    .site-sidebar ul {
        margin-top: var(--spacing-sm);
    }

    /*
    Contents - List
    */
    .site-sidebar:not(.is-grid) .label {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .site-sidebar:not(.is-grid) :global(a) {
        padding-left: var(--spacing-lg);
    }

    .site-sidebar:not(.is-grid) :global(.site-sidebar__link) {
        display: flex;
        align-items: center;
        padding: 0.45em var(--spacing-md) 0.45em var(--spacing-lg);
        flex: 1;
        gap: var(--spacing-sm);
    }

    .site-sidebar:not(.is-grid) .site-sidebar-inner :global(svg) {
        height: 1em;
        width: 1em;
        display: inline-block;
        position: relative;
        bottom: 0.1em;
        color: var(--color-icon);
        flex-shrink: 0;
    }

    .site-sidebar:not(.is-grid) li.current :global(a) {
        background-color: var(--color-background);
    }

    /*
    Contents - Grid
    */
    .is-grid ul {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3px;
        padding: 5px;
    }

    .is-grid li :global(a) {
        display: grid;
        border: 1px solid var(--color-border);
        border-radius: 3px;
        aspect-ratio: 1 / 1;
        grid-template-rows: 1fr 1fr;
        line-height: 1.1;
        font-size: 11px;
        letter-spacing: 0.03em;
        padding: var(--spacing-md) 0 var(--spacing-md);
    }

    @media (hover: hover) {
        .is-grid .site-sidebar-inner :global(a:hover) {
            background-color: var(--color-regular-background);
            border-color: var(--color-regular-background);
            color: var(--color-regular-foreground-hover);

        }

        .is-grid .site-sidebar-inner :global(a:hover svg) {
            fill: var(--color-regular-foreground-hover);
        }
    }

    .is-grid li.current :global(a) {
        border-color: var(--color-highlight);
        box-shadow: inset 0 0 0 1px var(--color-highlight);
    }

    .is-grid li :global(a > *)  {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        text-align: center;
        padding-left: var(--spacing-md);
        padding-right: var(--spacing-md);
    }

    .is-grid li :global(a > svg)  {
        height: 100%;
        width: 100%;
    }

    .site-sidebar.is-grid .label {
        word-break: break-word;
    }

    /*
    Contents - Mini
    */
    .site-sidebar.is-mini {
        --size-sidebar-width: 60px;
    }

    .site-sidebar.is-mini .site-sidebar-inner {
        padding-top: var(--spacing-lg);
    }

    .site-sidebar.is-mini h3 {
        display: none;
    }

    .site-sidebar.is-mini ul {
        grid-template-columns: 1fr;
    }

    .site-sidebar.is-mini li :global(a) {
        grid-template-rows: 1fr;
        padding: var(--spacing-sm);
    }

    .site-sidebar.is-mini .label {
        display: none;
    }
</style>