<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { ticks } from "~/logic/ui.js";
    import Portal from "~/components/portal.svelte";
    import DrawerAddTo from "~/components/action/drawers/drawerPlaylistAddTo.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext, ...rest } = $props();

    const { getSongs } = actionContext;

    let loaded = $state(false);
    let drawerAddTo = $state();
    let songsForPlaylistAdd = $state([]);

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerAddTo.show();
        songsForPlaylistAdd = await getSongs();
    }
</script>

<sl-menu-item {...rest} onclick={handleAction} title={$_("text.playlistAddTo")}>
    <MaterialSymbol name="queue_music" slot="prefix" />
    {$_("text.playlistAddTo")}&hellip;
</sl-menu-item>

{#if loaded}
    <Portal>
        <DrawerAddTo
            bind:this={drawerAddTo}
            bind:songs={songsForPlaylistAdd}
            on:sl-after-hide={() => (loaded = false)}
        />
    </Portal>
{/if}
