<script>
    import { _ } from "@rgglez/svelte-i18n";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import Portal from "~/components/portal.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ticks } from "~/logic/ui.js";

    let { actionContext } = $props();

    const { items, data } = actionContext;
    let playlist = $state(items[0] ?? data.playlist);

    let drawerEdit = $state();
    let loaded = $state(false);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerEdit.show();
    }
</script>

{#if playlist?.has_access}
    <sl-menu-item onclick={handleAction} title={$_("text.playlistEdit")}>
        <MaterialSymbol name="edit" slot="prefix" />
        {$_("text.playlistEdit")}
    </sl-menu-item>
{/if}

{#if loaded}
    <Portal>
        <DrawerEdit bind:this={drawerEdit} bind:playlist={playlist} />
    </Portal>
{/if}
