<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { ticks } from "~/logic/ui.js";
    import DrawerDelete from "~/components/action/drawers/drawerShareDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { contextKey } = $props();

    const { _item, _displayMode } = getContext(contextKey);

    let drawerDelete = $state();
    let loaded = $state(false);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerDelete.show();
    }
</script>

<sl-button
    onclick={handleAction}
    size={$_displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.shareDelete")}
>
    <MaterialSymbol name="delete" />
    <span class="label">{$_("text.shareDelete")}</span>
</sl-button>

{#if loaded}
    <Portal>
        <DrawerDelete bind:this={drawerDelete} bind:share={$_item} />
    </Portal>
{/if}
