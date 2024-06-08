<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let tabulator;
    export let playlistID;
    export let songs;

    let selectedCount = 0;
    let confirm = null;

    $: {
        if (tabulator) {
            tabulator.on(
                "rowSelectionChanged",
                function (data, rows, selected, deselected) {
                    selectedCount = data.length;
                },
            );
        }
    }

    function handleApply(e) {
        // close confirmation and reset selectedCount
        confirm.hide();
        selectedCount = 0;

        let selected = tabulator.getSelectedRows();

        selected.forEach(async (row) => {
            let itemData = row.getData();

            // remove on the backend
            let result = await $API.playlistRemoveSong({
                filter: playlistID,
                track: itemData.playlisttrack,
            });

            if (result.error) {
                errorHandler("while remove from playlist", result.error);
                return;
            }

            //remove from tabulator
            row.delete();
        });

        //send data back to tabulator
        songs = tabulator.getData();
    }
</script>

{#if selectedCount > 0}
    <sl-dropdown bind:this={confirm}>
        <sl-button slot="trigger">
            <MaterialSymbol name="cancel" slot="prefix" />
            {$_("text.remove")}
        </sl-button>
        <sl-card>
            <div slot="header">
                {$_("text.confirmRemove")}
            </div>

            <div class="options">
                <sl-button on:click={confirm.hide()} variant="text">
                    {$_("text.cancel")}
                </sl-button>
                <sl-button on:click={handleApply} variant="danger">
                    <MaterialSymbol name="cancel" slot="prefix" />
                    {$_("text.remove")}
                </sl-button>
            </div>
        </sl-card>
    </sl-dropdown>
{/if}

<style>
    .options {
        display: flex;
        gap: var(--spacing-lg);
    }
</style>
