<script>
    import { closeSidebar } from "~/logic/ui.js";
    import { clickOutsideDetector } from "~/actions/clickOutsideDetector.js";
    import { Settings } from "~/stores/settings.js";
    import { IsMobile } from "~/stores/state.js";
    import SidebarContent from "~/components/sidebar/sidebar_content.svelte";

    function handleClickOutside() {
        closeSidebar();
    }
</script>

<div
    class="site-sidebar"
    class:is-drawer={$IsMobile}
    class:is-list={$IsMobile || $Settings.SidebarIsOpen}
    class:is-mini={!$Settings.SidebarIsOpen && !$IsMobile}
    class:is-open={$Settings.SidebarIsOpen}
    onclickedOutside={handleClickOutside}
    use:clickOutsideDetector={{
        toggle: "#sidebar-button",
    }}
>
    <div class="site-sidebar-inner">
        <SidebarContent />
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
        display: flex;
        flex-direction: column;
        position: relative;
        transform: none;
        inset-inline-start: 0;
        transition: transform 0.3s ease-out;
        z-index: 30;
        will-change: transform;
    }

    .site-sidebar-inner {
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
        padding-block-end: 36px; /* space for player toggle button */
    }

    .site-sidebar.is-list :global(svg) {
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

    /*
    Drawer mode
    */
    .site-sidebar.is-drawer {
        position: absolute;
        inset-block-start: var(--size-header-height);
        inset-block-end: var(--size-player-height);
        box-shadow: var(--shadow-xxl);
    }

    .site-sidebar.is-drawer:after {
        content: "";
        height: 100%;
        width: 100vw;
        display: block;
        background-color: hsla(0, 0%, 30%, 0.5);
        inset-inline-start: 100%;
        position: absolute;
        opacity: 0;
        transition: opacity 0.3s ease-in-out;
        pointer-events: none;
    }

    .site-sidebar.is-drawer.is-open:after {
        opacity: 1;
        pointer-events: auto;
    }

    .site-sidebar.is-drawer:not(.is-open) {
        transform: translateX(-100%);
    }
</style>
