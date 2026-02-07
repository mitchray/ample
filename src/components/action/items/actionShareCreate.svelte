<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { ticks } from "~/logic/ui.js";
    import Portal from "~/components/portal.svelte";
    import DrawerShareEdit from "~/components/action/drawers/drawerShareEdit.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { API } from "~/stores/state.js";
    import { userPreference } from "~/logic/preferences.js";

    let { actionContext, ...rest } = $props();

    const { items, apiType } = actionContext;
    const sharePreference = userPreference("share");
    let drawerShare = $state();
    let loaded = $state(false);
    let newShare = $state();

    async function handleAction() {
        loaded = false;

        for (const item of items) {
            newShare = await $API.shareCreate({
                filter: item.id,
                type: apiType,
            });
        }

        loaded = true;
        await ticks(2);
        drawerShare.show();
    }
</script>

{#if $sharePreference}
    <sl-menu-item {...rest} onclick={handleAction} title={$_("text.share")}>
        <MaterialSymbol name="share" slot="prefix" />
        {$_("text.share")}&hellip;
    </sl-menu-item>
{/if}

{#if loaded}
    <Portal>
        <DrawerShareEdit
            bind:this={drawerShare}
            share={newShare}
            isNew={true}
        />
    </Portal>
{/if}
