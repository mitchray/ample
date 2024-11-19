<script>
    import { removeAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { item } = $props();
</script>

<div class="alert-card card {item.style}">
    <div class="style-icon">
        {#if item.style === "info"}
            <MaterialSymbol name="info" />
        {:else if item.style === "success"}
            <MaterialSymbol name="check" />
        {:else if item.style === "warning"}
            <MaterialSymbol name="warning" />
        {:else if item.style === "error"}
            <MaterialSymbol name="error" />
        {/if}
    </div>

    <div class="content">
        {#if item.title}
            <div class="title">{item.title}</div>
        {/if}

        {#if item.message}
            <div class="message">{item.message}</div>
        {/if}
    </div>

    <div class="actions">
        <sl-button
            class="remove"
            onclick={() => {
                removeAlert(item.id);
            }}
            variant="text"
        >
            <MaterialSymbol name="close" />
        </sl-button>
    </div>
</div>

<style>
    .alert-card {
        background-color: var(--color-surface-container-high);
        border-radius: 4px;
        display: flex;
        align-items: stretch;
        gap: var(--spacing-lg);
        flex-direction: row;
        justify-content: center;
        pointer-events: initial;
        position: relative;
    }

    .alert-card.success {
        border-color: var(--swatch-green-500);
    }

    .alert-card.info {
        border-color: var(--swatch-blue-500);
    }

    .alert-card.warning {
        border-color: var(--swatch-yellow-500);
    }

    .alert-card.error {
        border-color: var(--swatch-red-500);
    }

    .style-icon {
        width: 48px;
        color: white;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .success .style-icon {
        background-color: var(--swatch-green-500);
    }

    .info .style-icon {
        background-color: var(--swatch-blue-500);
    }

    .warning .style-icon {
        background-color: var(--color-warning-500);
    }

    .error .style-icon {
        background-color: var(--swatch-red-500);
    }

    .message {
        margin-block-start: var(--spacing-md);
    }

    .content {
        flex: 1;
        overflow: hidden;
        padding: var(--spacing-lg) 0;
    }

    .actions {
        /*margin-inline-start: var(--spacing-md);*/
        /*position: absolute;*/
        /*inset-block-start: var(--spacing-sm);*/
        /*inset-inline-end: var(--spacing-sm);*/
        align-self: start;
        margin-block-start: var(--spacing-sm);
        margin-inline-end: var(--spacing-sm);
    }
</style>
