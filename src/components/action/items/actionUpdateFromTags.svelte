<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { useQueryClient } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { contextKey } = $props();

    const { _type, _item } = getContext(contextKey);

    let loading = $state(false);

    async function handleAction() {
        loading = true;

        let urlBefore = window.location.href;

        $API.updateFromTags({ type: $_type, id: $_item.id }).then((result) => {
            if (result.error) {
                errorHandler("updating from tags", result.error);
            }

            if (result.success) {
                let urlAfter = window.location.href;

                if (urlBefore === urlAfter) {
                    try {
                        useQueryClient()?.invalidateQueries();
                    } catch (e) {}
                }

                addAlert({ title: $_("text.tagUpdateDone"), style: "success" });
            }

            loading = false;
        });
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
