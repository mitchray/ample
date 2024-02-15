<script>
    import active from "svelte-spa-router/active";
    import { SidebarIsOpen } from "~/stores/settings.js";
    import { IsMobile } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let href;
    export let activePath;
    export let icon;
    export let label;
</script>

<sl-tooltip
    content={label}
    placement="right"
    hoist
    disabled={$IsMobile || $SidebarIsOpen}
>
    <a {href} use:active={activePath} class="site-sidebar__link">
        <MaterialSymbol name={icon} />
        <span class="label truncate">{label}</span>
    </a>
</sl-tooltip>

<style>
    .site-sidebar__link {
        display: flex;
        padding-block: var(--spacing-sm);
        padding-inline: var(--sidebar-padding-inline);
        align-items: center;
        overflow: hidden;
        font-weight: 400;
        height: var(--sidebar-item-height);
        gap: var(--spacing-md);
        color: var(--color-tertiary);
    }

    .site-sidebar__link:global(.active) {
        background-color: var(--color-tertiary-container);
        color: var(--color-on-tertiary-container);
        border-radius: 6px;
    }

    .site-sidebar__link :global(.icon) {
        transform: scale(1.2);
    }
</style>
