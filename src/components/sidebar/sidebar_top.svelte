<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.svelte.js";
    import { ShowSearch } from "~/stores/state.js";
    import { fly } from "svelte/transition";
    import Notifications from "~/components/notification/notifications.svelte";

    function handleSidebarToggle() {
        let inverted = !Settings.current.SidebarIsExpanded;
        Settings.current.SidebarIsExpanded = inverted;
    }

    function handleOpenSearch() {
        ShowSearch.set(true);
    }
</script>

<sl-button id="sidebar-button" onclick={handleSidebarToggle} variant="text">
    <MaterialSymbol name="menu" />
</sl-button>

<Notifications />

<sl-tooltip
    content={$_("text.search")}
    hoist
    placement="right"
    disabled={Settings.current.SidebarIsExpanded}
>
    <sl-button
        id="search-button"
        onclick={handleOpenSearch}
        transition:fly
        disabled={$ShowSearch}
    >
        <MaterialSymbol name="search" slot="prefix" />
    </sl-button>
</sl-tooltip>

<style>
</style>
