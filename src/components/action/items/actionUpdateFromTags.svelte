<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API, PageLoadedKey } from "~/stores/state.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { _type, _item } = getContext(contextKey);

    let loading = false;

    async function handleAction() {
        loading = true;

        addAlert({ title: $_("text.tagUpdateStart"), style: "info" });

        let urlBefore = window.location.href;

        $API.updateFromTags({ type: $_type, id: $_item.id }).then((result) => {
            if (result.error) {
                console.error("Ample error updating from tags:", result.error);
            }

            if (result.success) {
                let urlAfter = window.location.href;

                if (urlBefore === urlAfter) {
                    // $PageLoadedKey = Date.now().toString(); //disabling for now as there are too many cases where this isn't practical
                }

                addAlert({ title: $_("text.tagUpdateDone"), style: "success" });
            }

            loading = false;
        });
    }
</script>

<sl-menu-item
    on:click={handleAction}
    title={$_("text.updateFromTags")}
    {loading}
>
    <MaterialSymbol name="sync" slot="prefix" />
    {$_("text.updateFromTags")}
</sl-menu-item>
