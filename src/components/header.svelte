<script>
    import { onMount } from 'svelte';
    import { Link } from "svelte-routing";

    import { logout } from "../logic/user";

    import { SearchQuery, ShowSearch } from "../stores/status";
    import { SiteContentBind } from '../stores/player';

    import Search from '../components/search.svelte';
    import ThemeToggle from '../components/themeToggle.svelte';
    import SongDuplicates from '../components/player/player_duplicates.svelte';

    import SVGAmpleLogo from "../../public/images/ample_logo.svg";
    import SVGClose from "../../public/images/close.svg";
    import SVGSearch from "../../public/images/search.svg";
    import SVGLogout from "../../public/images/logout.svg";

    let timeout;
    let minimumLength = 3;
    let contentObserver;

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

    function handleLogOut() {
        logout();
    }

    onMount(() => {
        // use ResizeObserver on .site-content to monitor changes in dimension,
        // done in Header to give the bind time to initialise
        contentObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                $SiteContentBind = $SiteContentBind;
                // console.debug($SiteContentBind.clientWidth);
            });
        });

        contentObserver.observe($SiteContentBind);
    });
</script>

<div class="site-header">
    <div class="site-logo-container">
        <Link to="/" class="site-logo"><SVGAmpleLogo /></Link>
    </div>

    <div class="search-container">
        <SVGSearch class="search-icon" />
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
            <button class="icon-button close" on:click={handleClear}><SVGClose /></button>
        {/if}
    </div>

    <Link to="search" class="advanced-search">Advanced Search</Link>

    <SongDuplicates />

    <button on:click={handleLogOut} class="logout visuallyLink"><SVGLogout style="transform: scale(0.8);" /> Log out</button>

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
        width: var(--size-sidebar-width);
        padding: 0 var(--spacing-xl);
        margin-right: var(--spacing-sm);
        display: flex;
        align-items: center;
    }

    :global(.site-logo) {
        display: block;
        width: 100%;
        line-height: 0;
    }

    :global(.ample-logo) {
        color: var(--color-highlight);
    }

    :global(.ample-logo > *) {
        opacity: 0.7;
    }

    :global(.ample-logo .amp) {
        opacity: 1;
    }

    :global(.ample-logo:hover) {
        color: var(--color-text-primary);
    }

    input.site-search {
        padding-left: var(--spacing-xxl);
        padding-right: var(--spacing-xxl);
        position: relative;
        display: block;
        margin-right: var(--spacing-md);
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
        display: inline-block;
        margin-right: var(--spacing-lg);
    }

    .site-header :global(.song-duplicates) {
        display: inline-block;
        margin-right: auto;
    }
</style>