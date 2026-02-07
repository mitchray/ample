<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { useQueryClient } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { actionContext } = $props();

    const { items, apiType } = actionContext;

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let urlBefore = window.location.href;

        for (const item of items) {
            let result = await $API.updateFromTags({ type: apiType, id: item.id });
            if (result.error) {
                errorHandler("updating from tags", result.error);
            }
        }

        if (items.length > 0) {
            try {
                useQueryClient()?.invalidateQueries();
            } catch (e) {}
            addAlert({ title: $_("text.tagUpdateDone"), style: "success" });
        }

        loading = false;
    }
</script>

<sl-menu-item
    {loading}
    onclick={handleAction}
    title={$_("text.updateFromTags")}
>
    <MaterialSymbol name="sync" slot="prefix" />
    {$_("text.updateFromTags")}
</sl-menu-item>
