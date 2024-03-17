<script>
    import { _ } from "svelte-i18n";
    import { Theme } from "~/stores/settings.js";

    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function toggleTheme() {
        let mode = $Theme.mode === "dark" ? "light" : "dark";
        $Theme = { ...$Theme, mode: mode };
    }

    $: text =
        $Theme.mode === "dark"
            ? $_("text.themeLightMode")
            : $_("text.themeDarkMode");
</script>

<sl-button class="icon-button theme-toggle" on:click={toggleTheme} title={text}>
    {#if $Theme.mode === "dark"}
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
