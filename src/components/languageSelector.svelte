<script>
    import { _, getLocaleFromNavigator, locale } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import { setTabulatorLang } from "~/logic/i18n.js";

    async function handleLocaleChange(e) {
        e.preventDefault();
        let newLanguage = e.target.value;
        locale.set(newLanguage);
        $Settings.Language = newLanguage;

        // update Tabulator instances
        setTabulatorLang(newLanguage);
    }
</script>

<sl-select onsl-change={handleLocaleChange} value={$locale}>
    <sl-option value={getLocaleFromNavigator()}>
        ({$_("text.autodetect")})
    </sl-option>
    <sl-option value="en">English (US)</sl-option>
    <sl-divider></sl-divider>
    <sl-option value="en-AU">English (AU)</sl-option>
    <sl-option value="de" data-lang="German">Deutsch</sl-option>
    <sl-option value="ko" data-lang="Korean">한국어</sl-option>
    <sl-option value="it" data-lang="Italian">Italiano</sl-option>
    <sl-option value="hu" data-lang="Hungarian">Magyar</sl-option>
    <sl-option value="pl" data-lang="Polish">Polski</sl-option>
    <sl-option value="fr" data-lang="French">Français</sl-option>
    <sl-option value="pt" data-lang="Portuguese">Português</sl-option>
    <sl-option value="pt-BR" data-lang="Portuguese-brazil">
        Português Brasil
    </sl-option>
    <sl-option value="es" data-lang="Spanish">Español</sl-option>
</sl-select>

<style>
    sl-select::part(listbox) {
        max-height: 200px;
    }
</style>
