<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, recentRating } from "~/stores/state.js";
    import { errorHandler, toApiType } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { items: itemsProp = null, type } = $props();

    let items = $derived(Array.isArray(itemsProp) ? itemsProp : []);

    let apiType = $derived(toApiType(type));

    function handleApply(e) {
        let newRating = parseInt(e.detail.item.value);

        items.forEach(async (item) => {
            // rate on the backend
            let result = await $API.rate({
                type: apiType,
                id: item.id,
                rating: newRating,
            });

            if (result.error) {
                errorHandler("while rating", result.error);
                return;
            }

            // update data in the table (mutate selection copy)
            item.rating = newRating;

            // notify Rating components
            recentRating.set({
                type: apiType,
                id: item.id,
                rating: newRating,
            });
        });
    }
</script>

{#if items.length > 0}
    <sl-dropdown>
        <sl-button slot="trigger" variant="primary" size="small" caret>
            <MaterialSymbol name="star" slot="prefix" />
            {$_("text.rate")}
        </sl-button>

        <sl-menu onsl-select={handleApply}>
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
