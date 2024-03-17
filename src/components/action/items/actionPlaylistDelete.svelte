<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { ticks } from "~/logic/ui.js";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { _data } = getContext(contextKey);

    let drawerDelete;
    let loaded = false;

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerDelete.show();
    }
</script>

<sl-menu-item
    on:click={handleAction}
    title={$_("text.playlistDelete")}
    variant="danger"
>
    <MaterialSymbol name="delete" slot="prefix" />
    {$_("text.playlistDelete")}
</sl-menu-item>

{#if loaded}
    <Portal>
        <DrawerDelete
            bind:this={drawerDelete}
            bind:playlist={$_data.playlist}
        />
    </Portal>
{/if}
