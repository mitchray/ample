<script>
    import "@shoelace-style/shoelace/dist/themes/light.css";
    import "@shoelace-style/shoelace/dist/themes/dark.css";
    import "/src/css/normalize.css";
    import "/src/css/global.css";
    import "@shoelace-style/shoelace/dist/shoelace.js";
    import { setupI18n } from "~/logic/i18n.js";
    import { isLoading as i18nIsLoading } from "@rgglez/svelte-i18n";
    import { loadFromConfig } from "~/logic/ample.js";
    import { validateSession } from "~/logic/user.js";
    import { User } from "~/stores/state.js";
    import { onMount } from "svelte";
    import PageTitleCoordinator from "~/components/pageTitleCoordinator.svelte";
    import ThemeHandler from "~/components/theme/themeHandler.svelte";
    import LoginPage from "~/views/login.svelte";
    import App from "~/App.svelte";

    setupI18n();

    onMount(async () => {
        await loadFromConfig();
        await validateSession();
    });
</script>

<PageTitleCoordinator />
<ThemeHandler />

{#if !$i18nIsLoading}
    {#if $User.isLoggedIn !== null}
        {#if !$User.isLoggedIn}
            <LoginPage />
        {/if}

        <App />
    {/if}
{/if}
