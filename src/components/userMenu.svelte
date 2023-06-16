<script>
    import { _ } from 'svelte-i18n';
    import { logout } from "../logic/user";
    import { isLoggedIn } from "../stores/user.js";
    import ThemeToggle from '../components/themeToggle.svelte';
    import LanguageSelector from '../components/languageSelector.svelte';
    import Menu from '../components/menu.svelte';
    import SVGLogout from "/src/images/logout.svg";
    import SVGProfile from "/src/images/account_circle.svg";

    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function handleLogOut() {
        logout();
    }
</script>

<button id="userMenu-toggle" class="icon-button userMenu-toggle" on:click={toggleMenu}>
    <SVGProfile />
</button>

{#if menuIsVisible}
    <Menu anchor="bottom" toggleSelector={"#userMenu-toggle"} bind:isVisible={menuIsVisible}>
        <div class="container">
            {#if $isLoggedIn}
                <button
                        on:click={handleLogOut}
                        class="visuallyLink logout"
                        title="{$_('text.logOut')}"
                >
                    <SVGLogout />
                    <span class="text">{$_('text.logOut')}</span>
                </button>
            {/if}

            <ThemeToggle />

            <LanguageSelector />
        </div>
    </Menu>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .container :global(svg) {
        height: 1.5em;
        width: auto;
        color: var(--color-highlight);
    }

    .container :global(button),
    .container :global(a) {
        display: flex;
        gap: var(--spacing-sm);
    }

    .container :global(.theme-toggle) {
        background-color: transparent;
        padding: 0;
        font-weight: normal;
        color: inherit;
    }

    .userMenu-toggle {
        margin-inline-end: var(--spacing-sm);
    }
</style>