<script>
    import { locale } from "svelte-i18n";

    function handleLocaleChange(e) {
        e.preventDefault();
        let newLanguage = e.target.value;
        locale.set(newLanguage);
        localStorage.setItem('AmpleLanguage', JSON.stringify(newLanguage));
    }
</script>

<select bind:value={$locale} on:change={handleLocaleChange}>
    <option value="en">English</option>
    <option value="en-AU">English (AU)</option>
    <option value="de">Deutsch</option>
</select>