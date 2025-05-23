<script>
    import { _ } from "svelte-i18n";
    import { SearchQuery, ShowSearch } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ticks } from "~/logic/ui.js";

    let timeout;
    let inputBind = $state();

    function handleInputChange(event) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let chars = event.target.value;
            SearchQuery.set(chars);
        }, 600);
    }

    async function handleClear() {
        SearchQuery.set("");
    }

    $effect(async () => {
        if ($ShowSearch === true) {
            await ticks(1); // regular tick() not working in time?
            inputBind?.focus();
        }
    });
</script>

<sl-input
    bind:this={inputBind}
    class="site-search"
    clearable
    onkeyup={handleInputChange}
    onpaste={handleInputChange}
    onsl-change={handleInputChange}
    onsl-clear={handleClear}
    onsl-input={handleInputChange}
    placeholder={$_("text.search")}
    type="text"
    size="large"
    value={$SearchQuery}
>
    <MaterialSymbol name="search" slot="prefix" />
</sl-input>

<style>
    .site-search {
        width: 300px; /* acts as max size */
    }

    .site-search::part(input) {
        width: 100%; /* auto size */
    }

    .site-search::part(clear-button) {
        flex-shrink: 0;
    }
</style>
