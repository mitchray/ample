<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { tabulator = $bindable(), type } = $props();

    let selectedCount = $state(0);

    $effect(() => {
        if (tabulator) {
            tabulator.on(
                "rowSelectionChanged",
                function (data, rows, selected, deselected) {
                    selectedCount = data.length;
                },
            );
        }
    });

    function handleApply(e) {
        let newRating = parseInt(e.detail.item.value);
        let selected = tabulator.getSelectedData();

        selected.forEach(async (item) => {
            // rate on the backend
            let result = await $API.rate({
                type: type,
                id: item.id,
                rating: newRating,
            });

            if (result.error) {
                errorHandler("while rating", result.error);
                return;
            }

            // update data in the table
            item.rating = newRating;
        });
    }
</script>

{#if selectedCount > 0}
    <sl-dropdown>
        <sl-button slot="trigger" variant="primary" caret>
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
