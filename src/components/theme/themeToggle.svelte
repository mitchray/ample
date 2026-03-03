<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.svelte.js";

    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-select
    value={Settings.Theme.mode}
    onsl-change={(e) => {
        Settings.Theme.mode = e.target.value;
    }}
>
    <sl-option value="light">
        <MaterialSymbol name="light_mode" slot="prefix" />
        {$_("text.themeLightMode")}
    </sl-option>
    <sl-option value="dark">
        <MaterialSymbol name="dark_mode" slot="prefix" />
        {$_("text.themeDarkMode")}
    </sl-option>
    <sl-option value="system">
        <MaterialSymbol name="brightness_auto" slot="prefix" />
        {$_("text.themeSystemMode")}
    </sl-option>
</sl-select>
