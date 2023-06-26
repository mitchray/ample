<script>
    import { _ } from 'svelte-i18n'
    import { location } from 'svelte-spa-router';
    import active from 'svelte-spa-router/active';
    import { closeSidebar } from "../logic/ui.js";
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';
    import {
        SidebarIsOpen,
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

    let tooltipPlacement = 'right';

    function handleClickOutside() {
        closeSidebar();
    }
</script>

<div class="site-sidebar"
    class:is-list={$IsMobile || $SidebarIsOpen}
    class:is-mini={!$SidebarIsOpen && !$IsMobile}
    class:is-open={$SidebarIsOpen}
    class:is-drawer={$IsMobile}
    bind:this={$SiteSidebarBind}
    use:clickOutsideDetector={{
        toggle: "#sidebar-button"
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="site-sidebar-inner">
        <ul>
            <li use:active={'/'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.home'), placement: tooltipPlacement}}
            >
                <a href="#/"
                    class="site-sidebar__link "
                >
                    <SVGGrid />
                    <span class="label">
                        {$_('text.home')}
                    </span>
                </a>
            </li>
        </ul>

        <h3 class="panel-title">{$_('text.library')}</h3>
        <ul>
            <li use:active={'/artists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.artists'), placement: tooltipPlacement}}
            >
                <a href="#/artists" class="site-sidebar__link ">
                    <SVGArtistHollow />
                    <span class="label">
                        {$_('text.artists')}
                    </span>
                </a>
            </li>
            <li use:active={'/album-artists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.albumArtists'), placement: tooltipPlacement}}
            >
                <a href="#/album-artists" class="site-sidebar__link ">
                    <SVGArtist />
                    <span class="label">
                        {$_('text.albumArtists')}
                    </span>
                </a>
            </li>
            <li use:active={'/albums'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.albums'), placement: tooltipPlacement}}
            >
                <a href="#/albums" class="site-sidebar__link ">
                    <SVGAlbum style="transform: scale(0.9)" /> <span class="label">{$_('text.albums')}</span>
                </a>
            </li>
            <li use:active={'/playlists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.playlists'), placement: tooltipPlacement}}
            >
                <a href="#/playlists" class="site-sidebar__link ">
                    <SVGPlaylist /> <span class="label">{$_('text.playlists')}</span>
                </a>
            </li>
            <li use:active={'/smartlists'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.smartlists'), placement: tooltipPlacement}}
            >
                <a href="#/smartlists" class="site-sidebar__link ">
                    <SVGSmartlist /> <span class="label">{$_('text.smartlists')}</span>
                </a>
            </li>
            <li use:active={'/genres'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.genres'), placement: tooltipPlacement}}
            >
                <a href="#/genres" class="site-sidebar__link ">
                    <SVGGenre style="transform: scale(0.9)" /> <span class="label">{$_('text.genres')}</span>
                </a>
            </li>
        </ul>

        <h3 class="panel-title">{$_('text.insights')}</h3>
        <ul>
            <li use:active={'/recent'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.recent'), placement: tooltipPlacement}}
            >
                <a href="#/recent" class="site-sidebar__link ">
                    <SVGRecent /> <span class="label">{$_('text.recent')}</span>
                </a>
            </li>
            <li use:active={'/newest'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.newest'), placement: tooltipPlacement}}
            >
                <a href="#/newest" class="site-sidebar__link ">
                    <SVGNew style="transform: scale(0.85)" /> <span class="label">{$_('text.newest')}</span>
                </a>
            </li>
            <li use:active={'/favorites'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.favorites'), placement: tooltipPlacement}}
            >
                <a href="#/favorites" class="site-sidebar__link ">
                    <SVGFavoriteFull style="transform: scale(0.85)" /> <span class="label">{$_('text.favorites')}</span>
                </a>
            </li>
            <li use:active={'/trending'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.trending'), placement: tooltipPlacement}}
            >
                <a href="#/trending" class="site-sidebar__link ">
                    <SVGTrending /> <span class="label">{$_('text.trending')}</span>
                </a>
            </li>
            <li use:active={'/top'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.topRated'), placement: tooltipPlacement}}
            >
                <a href="#/top" class="site-sidebar__link ">
                    <SVGStarFull /> <span class="label">{$_('text.topRated')}</span>
                </a>
            </li>
            <li use:active={'/forgotten'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.forgotten'), placement: tooltipPlacement}}
            >
                <a href="#/forgotten" class="site-sidebar__link ">
                    <SVGForgotten /> <span class="label">{$_('text.forgotten')}</span>
                </a>
            </li>
            <li use:active={'/random'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.random'), placement: tooltipPlacement}}
            >
                <a href="#/random" class="site-sidebar__link ">
                    <SVGRandom /> <span class="label">{$_('text.random')}</span>
                </a>
            </li>
            <li use:active={'/unrated'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.unrated'), placement: tooltipPlacement}}
            >
                <a href="#/unrated" class="site-sidebar__link ">
                    <SVGStarOutline /> <span class="label">{$_('text.unrated')}</span>
                </a>
            </li>
        </ul>

        <h3 class="panel-title">{$_('text.tools')}</h3>
        <ul>
            <li use:active={'/search'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.advancedSearch'), placement: tooltipPlacement}}
            >
                <a href="#/search" class="site-sidebar__link ">
                    <SVGSearch /> <span class="label">{$_('text.advancedSearch')}</span>
                </a>
            </li>
            <li use:active={'/multi-rater'}
                data-tooltip-disabled={$SidebarIsOpen}
                use:tooltip={{text: $_('text.multiRater'), placement: tooltipPlacement}}
            >
                <a href="#/multi-rater" class="site-sidebar__link ">
                    <SVGMultiStar style="transform: scale(0.9)" /> <span class="label">{$_('text.multiRater')}</span>
                </a>
            </li>
        </ul>
    </div>
</div>

<style>
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
        inset-inline-start: 0;
        transition: transform 0.3s ease-out;
        z-index: 30;
        will-change: transform;
    }

    .site-sidebar-inner {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
        padding: var(--sidebar-padding) 0;
        padding-inline-end: var(--spacing-sm);
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

    .site-sidebar :global(li.active) {
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
        margin-inline-start: var(--spacing-md);
        flex: 1;
        max-width: calc(100% - var(--sidebar-padding));
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .site-sidebar.is-list :global(svg) {
        position: relative;
        inset-block-end: 0.06em;
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
        inset-block-start: var(--size-header-height);
        inset-block-end:  var(--size-webplayer-height);
        box-shadow: var(--shadow-xxl);
    }

    .site-sidebar.is-drawer:after {
        content: '';
        height: 100%;
        width: 100vw;
        display: block;
        background-color: hsla(0, 0%, 30%, 0.5);
        inset-inline-start: 100%;
        position: absolute;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: none;
    }

    .site-sidebar.is-drawer.is-open:after {
        opacity: 1;
        pointer-events: auto;
    }

    .site-sidebar.is-drawer:not(.is-open) {
        transform: translateX(-100%);
    }
</style>