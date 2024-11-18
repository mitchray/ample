<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import DrawerShareEdit from "~/components/action/drawers/drawerShareEdit.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ticks } from "~/logic/ui.js";

    /** @type {{contextKey: any}} */
    let { contextKey } = $props();

    const { _item, _displayMode } = getContext(contextKey);

    let drawerEdit = $state();
    let loaded = $state(false);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerEdit.show();
    }
</script>

<sl-button
    onclick={handleAction}
    size={$_displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.shareEdit")}
>
    <MaterialSymbol name="edit" />
    <span class="label">{$_("text.shareEdit")}</span>
</sl-button>

{#if loaded}
    <Portal>
        <DrawerShareEdit bind:this={drawerEdit} bind:share={$_item} />
    </Portal>
{/if}
