<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { onDestroy } from "svelte";
    import {
        setContextualActions,
        clearContextualActions,
    } from "~/stores/contextualActionBar.js";
    import {
        selectedTabulatorRowsFlat,
        clearAllSelections,
    } from "~/stores/selectedTabulatorRows.js";

    let { tabulator = $bindable(), playlistID, songs = $bindable() } = $props();

    let confirm = $state(null);

    $effect(() => {
        if ($selectedTabulatorRowsFlat.length > 0) {
            setContextualActions([
                {
                    id: "playlist-remove-from",
                    component: removeAction,
                },
            ]);
        } else {
            clearContextualActions();
        }
    });

    onDestroy(() => {
        clearContextualActions();
    });

    async function handleApply(e) {
        confirm.hide();

        const tabulatorRows = tabulator.getSelectedRows();

        await Promise.all(
            tabulatorRows.map(async (row) => {
                let itemData = row.getData();

                let result = await $API.playlistRemoveSong({
                    filter: playlistID,
                    track: itemData.playlisttrack,
                });

                if (result.error) {
                    errorHandler("while remove from playlist", result.error);
                }

                if (!result.error) {
                    row.delete();
                }
            }),
        );

        clearAllSelections();
        songs = tabulator.getData();
    }
</script>

{#snippet removeAction()}
    <sl-dropdown bind:this={confirm} placement="bottom-start">
        <sl-button slot="trigger" size="small" variant="danger">
            <MaterialSymbol name="delete" slot="prefix" />
            {$_("text.remove")}
        </sl-button>
        <sl-card>
            <div slot="header">
                {$_("text.confirmRemove")}
            </div>

            <div class="options">
                <sl-button onclick={() => confirm.hide()} variant="text">
                    {$_("text.cancel")}
                </sl-button>

                <sl-button onclick={handleApply} variant="danger">
                    <MaterialSymbol name="delete" slot="prefix" />
                    {$_("text.remove")}
                </sl-button>
            </div>
        </sl-card>
    </sl-dropdown>
{/snippet}

<style>
    .options {
        display: flex;
        gap: var(--spacing-lg);
    }
</style>
