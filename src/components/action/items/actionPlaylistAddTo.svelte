<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { ticks } from "~/logic/ui.js";
    import Portal from "~/components/portal.svelte";
    import DrawerAddTo from "~/components/action/drawers/drawerPlaylistAddTo.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    let loaded = false;
    let drawerAddTo;
    let songsForPlaylistAdd = [];

    async function handleAction() {
        loaded = true;
        await ticks(2);
        drawerAddTo.show();
        songsForPlaylistAdd = await getSongs();
    }
</script>

<sl-menu-item
    {...$$restProps}
    on:click={handleAction}
    title={$_("text.playlistAddTo")}
>
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
