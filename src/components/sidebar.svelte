<script>
    import { getContext } from 'svelte';
    import { ROUTER } from 'svelte-routing/src/contexts';
    import { Link } from "svelte-routing";
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';
    import { SidebarIsMini, SidebarIsOpen, SidebarIsPinned, customHue } from '../stores/status';
    import { SiteSidebarBind } from "../stores/player";

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
            <li class:current={basePath === 'podcasts'}>
                <Link to="podcasts" class="site-sidebar__link " data-label="Podcasts">
                    <SVGPodcast /> <span class="label">Podcasts</span>
                </Link>
            </li>
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

<style>
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

    .site-sidebar:not(.is-mini) .site-sidebar-inner {
        padding-top: var(--spacing-xl);
    }

    :global(.site-sidebar__link) {
        display: flex;
        align-items: center;
        padding: 0.45em 0;
        flex: 1;
        gap: var(--spacing-sm);
    }

    .is-mini :global(.site-sidebar__link) {
        justify-content: center;
    }

    li {
        position: relative;
        display: flex;
    }

    .site-sidebar-inner :global(svg) {
        height: 1em;
        width: auto;
        display: inline-block;
        position: relative;
        bottom: 0.1em;
        color: var(--color-icon);
    }

    .site-sidebar.is-mini {
        --size-sidebar-width: 46px;
    }

    .is-mini :global(svg) {
        color: var(--color-text-primary);
    }

    .is-mini .label {
        display: none;
    }

    .is-mini h3 {
        font-size: 0;
    }

    .is-mini .site-sidebar-inner {
        padding-left: 0;
        padding-right: 0;
    }

    .is-mini .site-sidebar-inner :global(svg) {
        height: 1.5em;
    }

    .is-mini li.current :global(svg) {
        color: var(--color-highlight);
    }

    .is-mini li:not(.current) :global(svg) {
        opacity: 0.5;
    }

    .is-mini :global(.site-sidebar__link svg) {
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