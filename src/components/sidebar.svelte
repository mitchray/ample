<script>
    import { onMount, getContext } from 'svelte';
    import { ROUTER } from 'svelte-routing/src/contexts';
    import { Link } from "svelte-routing";

    import { SearchQuery, ShowSearch } from "../stores/status";

    import { logout } from '../logic/user';

    import Search from '../components/search.svelte';
    import SidebarDrawer from './sidebarDrawer.svelte';

    import SVGAmpleLogo from "../../public/images/ample_logo.svg";
    import SVGClose from "../../public/images/close.svg";
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
    import SVGLogout from "../../public/images/logout.svg";
    import SVGArrowLeft from "../../public/images/arrow_left.svg";
    import SVGArrowRight from "../../public/images/arrow_right.svg";
    import SVGGenre from "../../public/images/label.svg";
    import SVGSearch from "../../public/images/search.svg";

    const { activeRoute } = getContext(ROUTER);
    let basePath = '';

    $: {
        if ($activeRoute !== null) {
            basePath = $activeRoute.route._path.split(/\//)[0];

            // remove customColors class if not on our special pages
            // their onMount events will add it back in
            switch ($activeRoute.route._path) {
                case 'albums/:id':
                case 'artists/:id':
                    break;
                default:
                    document.body.classList.remove('useCustomColors');
                    break;
            }
        }
    }

    let timeout;
    let minimumLength = 3;
    let artistsDrawerIsVisible = false;
    let albumsDrawerIsVisible = false;
    let initialized = false;

    function handleFocus() {
        ShowSearch.set(true);
    }

    function handleInputChange(event) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let chars = event.target.value;

            if (chars.length >= 3) {
                ShowSearch.set(true);
                SearchQuery.set(chars);
            } else {
                ShowSearch.set(false);
            }
        }, 600);
    }

    function handleClear() {
        SearchQuery.set('');
        ShowSearch.set(false);
    }

    function toggleArtistsDrawer() {
        artistsDrawerIsVisible = !artistsDrawerIsVisible;
    }

    function toggleAlbumsDrawer() {
        albumsDrawerIsVisible = !albumsDrawerIsVisible;
    }

    function handleLogOut() {
        logout();
    }

    onMount(() => {
        // wait for sidebar to be ready before loading the sidebardrawer components
        initialized = true;
    });
</script>

<div class="site-sidebar">
    <div class="site-sidebar-inner">
        <div class="site-logo-container">
            <Link to="/" class="site-logo"><SVGAmpleLogo /></Link>
        </div>

        <div class="search-container">
            <input
                type="text"
                placeholder="Quick search"
                class="site-search"
                on:focus={handleFocus}
                on:paste={handleInputChange}
                on:keyup={handleInputChange}
                value="{$SearchQuery}"
            />
            {#if $SearchQuery}
                <button class="icon close" on:click={handleClear}><SVGClose /></button>
            {/if}
        </div>
        <Link to="search" class="site-sidebar__link "><SVGSearch class="inline"/> Advanced</Link>

        <h3>Library</h3>
        <ul>
            <li class="{basePath === 'artists' ? 'current' : ''}">
                <Link to="artists" class="site-sidebar__link "><SVGArtist class="inline"/> Artists</Link>
                <button id="js-drawer-artists" class="drawer-toggle icon" class:open={artistsDrawerIsVisible} on:click={toggleArtistsDrawer}>
                    {#if artistsDrawerIsVisible}
                        <SVGArrowLeft />
                    {:else}
                        <SVGArrowRight />
                    {/if}
                </button>
            </li>
            <li class="{basePath === 'albums' ? 'current' : ''}">
                <Link to="albums" class="site-sidebar__link "><SVGAlbum class="inline"/> Albums</Link>
                <button id="js-drawer-albums" class="drawer-toggle icon" class:open={albumsDrawerIsVisible} on:click={toggleAlbumsDrawer}>
                    {#if albumsDrawerIsVisible}
                        <SVGArrowLeft />
                    {:else}
                        <SVGArrowRight />
                    {/if}
                </button>
            </li>
            <li class="{basePath === 'playlists' ? 'current' : ''}"><Link to="playlists" class="site-sidebar__link "><SVGPlaylist class="inline"/> Playlists</Link></li>
            <li class="{basePath === 'smartlists' ? 'current' : ''}"><Link to="smartlists" class="site-sidebar__link "><SVGSmartlist class="inline"/> Smartlists</Link></li>
            <li class="{basePath === 'genres' ? 'current' : ''}"><Link to="genres" class="site-sidebar__link "><SVGGenre class="inline"/> Genres</Link></li>
        </ul>

        <h3>Insights</h3>
        <ul>
            <li class="{basePath === 'favorites' ? 'current' : ''}"><Link to="favorites" class="site-sidebar__link "><SVGFavoriteFull class="inline"/> Favorites</Link></li>
            <li class="{basePath === 'recent' ? 'current' : ''}"><Link to="recent" class="site-sidebar__link "><SVGRecent class="inline"/> Recent</Link></li>
            <li class="{basePath === 'newest' ? 'current' : ''}"><Link to="newest" class="site-sidebar__link "><SVGNew class="inline"/> Newest</Link></li>
            <li class="{basePath === 'trending' ? 'current' : ''}"><Link to="trending" class="site-sidebar__link "><SVGTrending class="inline"/> Trending</Link></li>
            <li class="{basePath === 'top' ? 'current' : ''}"><Link to="top" class="site-sidebar__link "><SVGStarFull class="inline"/> Top Rated</Link></li>
            <li class="{basePath === 'forgotten' ? 'current' : ''}"><Link to="forgotten" class="site-sidebar__link "><SVGForgotten class="inline"/> Forgotten</Link></li>
            <li class="{basePath === 'random' ? 'current' : ''}"><Link to="random" class="site-sidebar__link "><SVGRandom class="inline"/> Random</Link></li>
            <li class="{basePath === 'unrated' ? 'current' : ''}"><Link to="unrated" class="site-sidebar__link "><SVGStarOutline class="inline"/> Unrated</Link></li>
        </ul>

        <button on:click={handleLogOut} class="logout with-icon"><SVGLogout /> Log out</button>
    </div>

    {#if $ShowSearch && $SearchQuery.length >= minimumLength}
        {#key $SearchQuery}
            <Search />
        {/key}
    {/if}

    {#if initialized}
        <SidebarDrawer type="artist" bind:visible={artistsDrawerIsVisible} toggleElement={document.querySelector("#js-drawer-artists")} />
        <SidebarDrawer type="album" bind:visible={albumsDrawerIsVisible} toggleElement={document.querySelector("#js-drawer-albums")} />
    {/if}
</div>

<style>
    :global(.site-logo) {
        display: block;
        max-width: 100px;
        font-weight: 700;
        font-size: 16px;
        margin: 0 0 var(--spacing-lg);
    }

    :global(.site-logo),
    :global(.site-logo:hover) {
        color: var(--color-text-body);
    }

    :global(.ample-logo .amp) {
        color: var(--color-highlight);
    }

    .site-sidebar {
        background-color: var(--color-interface);
        width: var(--size-sidebar-width);
        padding: var(--spacing-lg);
        height: 100%;
        display: flex;
        flex-direction: column;
        border-right: 1px solid var(--color-tint-100);
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

    :global(.site-sidebar__link) {
        display: block;
        padding: 0.45em 0;
    }

    li {
        position: relative;
        z-index: 1;
    }

    :global(.site-sidebar__link svg) {
        padding-right: var(--spacing-sm);
    }

    li.current :global(.site-sidebar__link) {
        position: relative;
        font-weight: 700;
        color: var(--color-link-active);
    }

    li.current:before {
        content: '';
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            to right,
            var(--color-tint-100),
            transparent
        );
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
        border-radius: 999px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
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
        color: var(--color-highlight);
        margin-bottom: var(--spacing-sm);
        margin-top: var(--spacing-xl);
    }

    ul {
        margin: 0;
    }

    .site-search {
        padding-right: 32px;
        position: relative;
        display: block;
    }

    .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        position: absolute;
        right: 2px;
    }

    .search-container {
        display: flex;
        align-items: center;
        position: relative;
        max-width: none;
        width: calc(100% + (var(--spacing-md) * 2));
        left: calc(var(--spacing-md) * -1);
        z-index: 1;
        margin-top: var(--spacing-md);
    }

    .logout {
        margin-top: var(--spacing-lg);
    }
</style>