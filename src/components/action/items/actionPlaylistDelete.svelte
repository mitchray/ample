<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { ticks } from "~/logic/ui.js";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext } = $props();

    const { items, data } = actionContext;
    let playlist = $state(items[0] ?? data.playlist);

    let drawerDelete = $state();
    let loaded = $state(false);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerDelete.show();
    }
</script>

{#if playlist?.has_access}
    <sl-menu-item
        onclick={handleAction}
        title={$_("text.playlistDelete")}
        variant="danger"
    >
        <MaterialSymbol name="delete" slot="prefix" />
        {$_("text.playlistDelete")}
    </sl-menu-item>
{/if}

{#if loaded}
    <Portal>
        <DrawerDelete
            bind:this={drawerDelete}
            bind:playlist={playlist}
        />
    </Portal>
{/if}
