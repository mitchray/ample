<script>
    import { SidebarIsOpen } from "~/stores/settings.js";
    import { IsMobile } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let icon = null;
    export let label;
</script>

<sl-tooltip
    content={label}
    disabled={$IsMobile || $SidebarIsOpen}
    hoist
    placement="right"
>
    <div class="heading">
        {#if icon}
            <MaterialSymbol name={icon} />
        {/if}
        <span class="sidebar-title truncate">{label}</span>
    </div>
</sl-tooltip>

<style>
    .heading :global(.icon) {
        flex-shrink: 0;
    }

    .heading {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        padding-inline: var(--sidebar-padding-inline);
        height: var(--sidebar-item-height);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.9em;
        letter-spacing: 0.05em;
    }

    :global(.site-sidebar.is-mini) .heading {
        padding-inline-start: 10px;
    }
</style>
