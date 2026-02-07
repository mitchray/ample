<script>
    import { _ } from "@rgglez/svelte-i18n";
    import DrawerShareEdit from "~/components/action/drawers/drawerShareEdit.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ticks } from "~/logic/ui.js";

    let { actionContext } = $props();

    const { items, displayMode } = actionContext;
    let share = $state(items[0]);

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
    size={displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.shareEdit")}
>
    <MaterialSymbol name="edit" />
    <span class="label">{$_("text.shareEdit")}</span>
</sl-button>

{#if loaded}
    <Portal>
        <DrawerShareEdit bind:this={drawerEdit} bind:share={share} />
    </Portal>
{/if}
