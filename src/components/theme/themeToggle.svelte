<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.js";

    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function toggleTheme() {
        $Settings.Theme.mode =
            $Settings.Theme.mode === "dark" ? "light" : "dark";
    }

    let text = $derived(
        $Settings.Theme.mode === "dark"
            ? $_("text.themeLightMode")
            : $_("text.themeDarkMode"),
    );
</script>

<sl-button class="icon-button theme-toggle" onclick={toggleTheme} title={text}>
    {#if $Settings.Theme.mode === "dark"}
        <MaterialSymbol name="light_mode" slot="prefix" />
    {:else}
        <MaterialSymbol name="dark_mode" slot="prefix" />
    {/if}

    {text}
</sl-button>

<style>
    .theme-toggle {
        display: flex;
        gap: var(--spacing-sm);
    }
</style>
