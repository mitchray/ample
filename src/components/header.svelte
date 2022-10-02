<script>
    import { onDestroy, onMount } from 'svelte';
    import { Link, link } from "svelte-routing";

    import { logout } from "../logic/user";

    import { SearchQuery, ShowSearch, SidebarIsOpen } from "../stores/status";
    import { SiteContentBind, SiteSidebarBind, SiteQueueBind } from '../stores/player';
    import { serverURL } from '../stores/server';

    import Search from '../components/search.svelte';
    import ThemeToggle from '../components/themeToggle.svelte';
    import Notifications from '../components/notification/notifications.svelte';

    import SVGAmpleLogo from "../../public/images/ample_logo.svg";
    import SVGAmpleLetter from "../../public/images/ample_letter.svg";
    import SVGClose from "../../public/images/close.svg";
    import SVGSearch from "../../public/images/search.svg";
    import SVGLogout from "../../public/images/logout.svg";
    import SVGMenu from "../../public/images/menu.svg";

    let timeout;
    let minimumLength = 3;

    let contentObserver;
    let sidebarObserver;
    let queueObserver;

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

    function handleSidebarToggle() {
        let inverted = !$SidebarIsOpen;
        localStorage.setItem('SidebarIsOpen', JSON.stringify(inverted));
        SidebarIsOpen.set(inverted);
    }

    function handleLogOut() {
        logout();
    }

    onMount(() => {
        // use ResizeObserver to monitor changes in dimension,
        // done in Header to give the binds time to initialise
        contentObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteContentBind = $SiteContentBind;
            });
        });

        sidebarObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteSidebarBind = $SiteSidebarBind;
            });
        });

        queueObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteQueueBind = $SiteQueueBind;
            });
        });

        contentObserver.observe($SiteContentBind);
        sidebarObserver.observe($SiteSidebarBind);
        queueObserver.observe($SiteQueueBind);
    });

    onDestroy(() => {
        if (contentObserver) {
            contentObserver.disconnect();
        }

        if (sidebarObserver) {
            sidebarObserver.disconnect();
        }

        if (queueObserver) {
            queueObserver.disconnect();
        }
    });
</script>

<div class="site-header">
    <div class="site-logo-container">
        <button class="icon-button" on:click={handleSidebarToggle}><SVGMenu /></button>
        <a href="{$serverURL}/ample" use:link class="site-logo"><SVGAmpleLetter /><SVGAmpleLogo /></a>
    </div>

    <div class="search-container">
        <SVGSearch class="search-icon" />
        <input
            type="text"
            placeholder="Search"
            class="site-search"
            on:focus={handleFocus}
            on:paste={handleInputChange}
            on:keyup={handleInputChange}
            value="{$SearchQuery}"
        />
        {#if $SearchQuery}
            <button class="icon-button close" on:click={handleClear}><SVGClose /></button>
        {/if}
    </div>

    <Link to="search" class="advanced-search">Advanced Search</Link>

    <Notifications />

    <button
        on:click={handleLogOut}
        class="logout visuallyLink"
        title="Log out"
    >
        <SVGLogout style="transform: scale(0.8);" />
        <span class="text">Log out</span>
    </button>

    <ThemeToggle />
</div>

{#if $ShowSearch && $SearchQuery.length >= minimumLength}
    {#key $SearchQuery}
        <Search />
    {/key}
{/if}

<style>
    .site-header {
        border-bottom: 1px solid var(--color-border);
        background-color: var(--color-interface);
        width: 100%;
        height: var(--size-header-height);
        display: flex;
        align-items: center;
        z-index: 20;
        line-height: 1;
    }

    .site-logo-container {
        padding: 0 var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    :global(.site-logo) {
        display: block;
        width: 100%;
        line-height: 0;
        margin-right: var(--spacing-sm);
    }

    .site-header :global(.ample-logo) {
        display: none;
    }

    :global(.ample-letter) {
        height: 14px;
    }

    :global(.ample-logo),
    :global(.ample-letter) {
        color: var(--color-highlight);
    }

    :global(.ample-logo > *) {
        opacity: 0.7;
    }

    :global(.ample-logo .amp) {
        opacity: 1;
    }

    :global(.ample-logo:hover),
    :global(.ample-letter:hover) {
        color: var(--color-text-primary);
    }

    .search-container {
        width: 100%;
        max-width: 250px;
    }

    input.site-search {
        padding-left: var(--spacing-xxl);
        padding-right: var(--spacing-xxl);
        position: relative;
        display: block;
        margin-right: var(--spacing-md);
        width: 100%;
    }

    .search-container :global(.search-icon) {
        position: absolute;
        left: var(--spacing-md);
    }

    .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        position: absolute;
        right: var(--spacing-md);
        background: unset;
        border: unset;
        box-shadow: unset;
    }

    .search-container {
        display: flex;
        align-items: center;
        position: relative;
        z-index: 1;
    }

    .site-header :global(.advanced-search) {
        margin-right: var(--spacing-lg);
        display: none;
        flex-shrink: 0;
    }

    .site-header :global(.notifications-toggle) {
        margin-right: auto;
    }

    .logout {
        margin-left: var(--spacing-lg);
    }

    .logout .text {
        display: none;
    }

    @media all and (min-width: 500px) {
        .site-header :global(.advanced-search) {
            display: inline-block;
        }
    }

    @media all and (min-width: 720px) {
        .site-logo-container {
            width: var(--size-sidebar-width);
        }

        .site-header :global(.ample-logo) {
            display: block;
        }

        :global(.ample-letter) {
            display: none;
        }

        .logout .text {
            display: block;
        }
    }
</style>