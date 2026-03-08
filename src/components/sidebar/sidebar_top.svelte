<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.svelte.js";
    import { ShowSearch, User } from "~/stores/state.js";
    import { fly } from "svelte/transition";
    import Notifications from "~/components/notification/notifications.svelte";
    import UserMenu from "~/components/userMenu.svelte";

    function handleSidebarToggle() {
        let inverted = !Settings.SidebarIsExpanded;
        Settings.SidebarIsExpanded = inverted;
    }

    function handleOpenSearch() {
        ShowSearch.set(true);
    }
</script>

<div class="container">
    <sl-button id="sidebar-button" onclick={handleSidebarToggle} variant="text">
        <MaterialSymbol name="menu" />
    </sl-button>

    <sl-tooltip
        content={$User.username}
        placement={Settings.SidebarIsExpanded ? "bottom" : "right"}
    >
        <UserMenu />
    </sl-tooltip>

    <!-- <Notifications /> -->

    <sl-tooltip
        content={$_("text.search")}
        hoist
        placement="right"
        disabled={Settings.SidebarIsExpanded}
    >
        <sl-button
            id="search-button"
            onclick={handleOpenSearch}
            transition:fly
            variant="text"
            disabled={$ShowSearch}
        >
            <MaterialSymbol name="search" />
        </sl-button>
    </sl-tooltip>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        padding-inline: var(--spacing-sm);
        justify-content: space-around;
        align-items: center;
        position: absolute;
        top: var(--sidebar-padding);
        left: var(--sidebar-padding);
        right: var(--sidebar-padding);
        backdrop-filter: blur(12px) saturate(1.5);
        background: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.05));
        z-index: 20;
        border-radius: 6px;
        border-width: 1px;
        border-style: solid;
        border-top-color: rgba(255, 255, 255, 0.3);
        border-right-color: rgba(255, 255, 255, 0.1);
        border-left-color: rgba(255, 255, 255, 0.3);
        border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .container :global(sl-button) {
        max-width: 100%;
    }

    :global(.site-sidebar.is-mini) .container {
        flex-direction: column;
    }
</style>
