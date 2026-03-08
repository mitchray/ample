<script>
    import { Settings } from "~/stores/settings.svelte.js";
    import SidebarTop from "~/components/sidebar/sidebar_top.svelte";
    import SidebarContent from "~/components/sidebar/sidebar_content.svelte";
</script>

<div
    class="site-sidebar"
    class:is-mini={!Settings.SidebarIsExpanded}
    data-testid="sidebar"
>
    <SidebarTop />
    <SidebarContent />
</div>

<style>
    /*
    Base
    */
    .site-sidebar {
        --sidebar-padding: var(--spacing-md);
        --sidebar-padding-inline: var(--spacing-md);
        --sidebar-item-height: 30px;
        background-color: var(--color-surface-container);
        color: var(--color-tertiary);
        width: var(--size-sidebar-width);
        z-index: 30;
        position: relative;
    }

    /*
    Mini mode
    */
    .site-sidebar.is-mini {
        --size-sidebar-width: 46px;
    }

    .site-sidebar.is-mini :global(.site-sidebar__link .icon) {
        transform: scale(1.4);
    }
</style>
