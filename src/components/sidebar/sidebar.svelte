<script>
    import { Settings } from "~/stores/settings.svelte.js";
    import SidebarTop from "~/components/sidebar/sidebar_top.svelte";
    import SidebarContent from "~/components/sidebar/sidebar_content.svelte";
    import SidebarBottom from "~/components/sidebar/sidebar_bottom.svelte";
</script>

<div
    class="site-sidebar"
    class:is-mini={!Settings.SidebarIsExpanded}
    data-testid="sidebar"
>
    <div class="start">
        <SidebarTop />
    </div>

    <div class="middle">
        <SidebarContent />
    </div>

    <div class="end">
        <SidebarBottom />
    </div>
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

    .start,
    .end {
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

    .start {
        display: flex;
        flex-direction: row;
        padding-inline: var(--spacing-sm);
        justify-content: space-between;
        position: absolute;
        top: var(--sidebar-padding);
        left: var(--sidebar-padding);
        right: var(--sidebar-padding);
    }

    .start :global(sl-button) {
        max-width: 100%;
    }

    .middle {
        overflow-x: hidden;
        overflow-y: auto;
        position: absolute;
        inset: 0;
        padding-block-start: 50px;
        padding-block-end: 60px;
        padding-inline: var(--sidebar-padding-inline);
    }

    .end {
        position: absolute;
        bottom: var(--sidebar-padding);
        left: var(--sidebar-padding);
        right: var(--sidebar-padding);
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

    .site-sidebar.is-mini :global(.label) {
        display: none;
    }

    .site-sidebar.is-mini .start {
        flex-direction: column;
    }

    .site-sidebar.is-mini .middle {
        padding-block-start: 113px;
        padding-block-end: 50px;
    }

    .site-sidebar.is-mini .end {
        backdrop-filter: none;
        background: none;
        border: none;
    }
</style>
