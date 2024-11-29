<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { Tabulator } from "tabulator-tables";

    let { share = null } = $props();
    export const show = () => drawer.show();

    let drawer = $state();

    function handleDelete() {
        $API.shareDelete({ filter: share.id }).then((result) => {
            if (result.success) {
                let sharesTable = Tabulator.findTable("[data-id=shares]");

                if (Array.isArray(sharesTable)) {
                    sharesTable.forEach((table) => {
                        table.deleteRow(share.id);
                    });
                }

                addAlert({
                    title: $_("text.shareDeleted"),
                    style: "success",
                });
            } else {
                addAlert({
                    title: $_("text.shareDeleteFailed"),
                    message: `${result.error?.errorCode}: ${result.error?.errorMessage}`,
                    style: "warning",
                });
            }
        });

        drawer.hide();
    }
</script>

<sl-drawer bind:this={drawer} label={$_("text.shareConfirmRemoval")}>
    <div>
        {$_("text.shareConfirmRemovalInfo", {
            values: { name: share?.name },
        })}
    </div>

    <sl-button onclick={handleDelete} slot="footer" variant="danger">
        <MaterialSymbol name="delete" slot="prefix" />
        {$_("text.delete")}
    </sl-button>
</sl-drawer>
