<script>
    import { locale } from "svelte-i18n";
    import { Saved } from "~/stores/settings.js";

    async function handleLocaleChange(e) {
        e.preventDefault();
        let newLanguage = e.target.value;
        locale.set(newLanguage);
        await $Saved?.setItem("Language", newLanguage);
    }
</script>

<sl-select on:sl-change={handleLocaleChange} value={$locale}>
    <sl-option value="en">English (US)</sl-option>
    <sl-option value="en-AU">English (AU)</sl-option>
    <sl-option value="de">Deutsch</sl-option>
</sl-select>
