<script>
    import { Settings } from "~/stores/settings.js";
    import SidebarTop from "~/components/sidebar/sidebar_top.svelte";
    import SidebarContent from "~/components/sidebar/sidebar_content.svelte";
    import SidebarBottom from "~/components/sidebar/sidebar_bottom.svelte";
</script>

<div
    class="site-sidebar"
    class:is-mini={!$Settings.SidebarIsExpanded}
    data-testid="sidebar"
>
    <div class="start">
        <SidebarTop />
    </div>

    <div class="middle">
        <div class="middle-inner">
            <SidebarContent />
        </div>
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
        padding: 0;
        padding-block-end: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        position: relative;
        inset-inline-start: 0;
        z-index: 30;
    }

    .start {
        display: flex;
        flex-direction: row;
        padding: var(--spacing-sm);
        padding-inline-start: 0;
        justify-content: space-between;
    }

    .middle {
        position: relative;
        flex: 1;
        border-block: 1px solid var(--color-background);
    }

    .middle-inner {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;
        padding: var(--sidebar-padding) 0;
        padding-inline: var(--spacing-md);
    }

    .end {
        display: flex;
        flex-direction: column;
    }

    .site-sidebar :global(svg) {
        position: relative;
        inset-block-end: 0.06em;
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
</style>
