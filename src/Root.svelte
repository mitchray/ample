<script>
    import "@shoelace-style/shoelace/dist/themes/light.css";
    import "@shoelace-style/shoelace/dist/themes/dark.css";
    import "/src/css/normalize.css";
    import "/src/css/global.css";
    import "@shoelace-style/shoelace/dist/shoelace.js";
    import { setupI18n } from "~/logic/i18n.js";
    import { hideLoadingOverlay } from "~/logic/ui.js";
    import { isLoading as i18nIsLoading } from "@rgglez/svelte-i18n";
    import { loadFromConfig } from "~/logic/ample.js";
    import { validateSession } from "~/logic/user.js";
    import { Settings } from "~/stores/settings.js";
    import { User } from "~/stores/state.js";
    import { onMount, tick } from "svelte";
    import PageTitleCoordinator from "~/components/pageTitleCoordinator.svelte";
    import ThemeHandler from "~/components/theme/themeHandler.svelte";
    import LoginPage from "~/views/login.svelte";
    import App from "~/App.svelte";

    setupI18n();

    onMount(async () => {
        await loadFromConfig();
        await validateSession();

        // remove the starting sl-theme-dark
        document.documentElement.classList.remove("sl-theme-dark");

        if ($Settings.Theme.mode === "light") {
            document.documentElement.classList.add("sl-theme-light");
        } else {
            document.documentElement.classList.add("sl-theme-dark");
        }
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
