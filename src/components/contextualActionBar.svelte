<script>
    import { contextualActions } from "~/stores/contextualActionBar.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    const visibleActions = $derived(
        $contextualActions.filter((a) => a.visible !== false),
    );
    const hasActions = $derived(visibleActions.length > 0);

    function handleClick(action) {
        if (!action.disabled && typeof action.onClick === "function") {
            action.onClick();
        }
    }
</script>

{#if hasActions}
    <div class="contextual-action-bar">
        <div class="contextual-action-bar__inner">
            {#each visibleActions as action (action.id)}
                <sl-button
                    class="contextual-action-bar__btn"
                    variant={action.variant === "primary"
                        ? "primary"
                        : "default"}
                    size="small"
                    disabled={action.disabled === true}
                    loading={action.loading === true}
                    onclick={() => handleClick(action)}
                >
                    {#if action.icon}
                        <MaterialSymbol name={action.icon} slot="prefix" />
                    {/if}
                    {action.label}
                </sl-button>
            {/each}
        </div>
    </div>
{/if}

<style>
    .contextual-action-bar {
        flex-shrink: 0;
        position: sticky;
        top: 0;
        z-index: 2;
        align-content: center;
        padding-inline: var(--spacing-md);
        background: var(--color-surface-container);
        height: 36px;
    }

    .contextual-action-bar__inner {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
    }

    .contextual-action-bar__btn {
        flex-shrink: 0;
    }
</style>
