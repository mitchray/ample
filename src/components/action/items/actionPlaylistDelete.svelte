<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { ticks } from "~/logic/ui.js";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /** @type {{contextKey: any}} */
    let { contextKey } = $props();

    const { _data } = getContext(contextKey);

    let drawerDelete = $state();
    let loaded = $state(false);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerDelete.show();
    }
</script>

{#if $_data.playlist?.has_access}
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
            bind:playlist={$_data.playlist}
        />
    </Portal>
{/if}
