<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { ticks } from "~/logic/ui.js";
    import Portal from "~/components/portal.svelte";
    import DrawerShare from "~/components/action/drawers/drawerShareCreate.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    let drawerShare;
    let loaded = false;

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerShare.show();
    }
</script>

<sl-menu-item on:click={handleAction} title={$_("text.share")} {...$$restProps}>
    <MaterialSymbol name="share" slot="prefix" />
    {$_("text.share")}&hellip;
</sl-menu-item>

{#if loaded}
    <Portal>
        <DrawerShare bind:this={drawerShare} {name} />
    </Portal>
{/if}
