<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state";
    import { errorHandler } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { _type, selectedCount, dataDisplay } = getContext(contextKey);

    function handleApply(e) {
        let newRating = parseInt(e.detail.item.value);

        let selected = $dataDisplay.filter((item) => item.selected);

        selected.forEach((item) => {
            let result = $API.rate({
                type: $_type,
                id: item.id,
                rating: newRating,
            });

            if (result.error) {
                errorHandler("while rating", result.error);
            }

            let index = $dataDisplay.findIndex((el) => el.id === item.id);

            if (index !== -1) $dataDisplay[index].rating = newRating;
        });

        $dataDisplay = $dataDisplay;
    }
</script>

{#if $selectedCount > 0}
    <sl-dropdown>
        <sl-button slot="trigger" variant="primary" caret>
            <MaterialSymbol name="star" slot="prefix" />
            {$_("text.rate")}
        </sl-button>

        <sl-menu on:sl-select={handleApply}>
            <sl-menu-item value="5">
                {$_("text.ratingCount", { values: { count: 5 } })}
            </sl-menu-item>
            <sl-menu-item value="4">
                {$_("text.ratingCount", { values: { count: 4 } })}
            </sl-menu-item>
            <sl-menu-item value="3">
                {$_("text.ratingCount", { values: { count: 3 } })}
            </sl-menu-item>
            <sl-menu-item value="2">
                {$_("text.ratingCount", { values: { count: 2 } })}
            </sl-menu-item>
            <sl-menu-item value="1">
                {$_("text.ratingCount", { values: { count: 1 } })}
            </sl-menu-item>
            <sl-menu-item value="0">
                {$_("text.ratingCount", { values: { count: 0 } })}
            </sl-menu-item>
        </sl-menu>
    </sl-dropdown>
{/if}
