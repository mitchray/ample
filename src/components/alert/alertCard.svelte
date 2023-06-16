<script>
    import { removeAlert } from "../../logic/alert";

    import SVGClose from '/src/images/close.svg';
    import SVGInfo from "/src/images/info.svg";
    import SVGSuccess from "/src/images/check.svg";
    import SVGWarning from "/src/images/warning.svg";
    import SVGError from "/src/images/error.svg";

    export let item;
</script>

<div class="alert-card card {item.style}">
    <div class="style-icon">
        {#if item.style === "info"}
            <SVGInfo />
        {:else if item.style === "success"}
            <SVGSuccess />
        {:else if item.style === "warning"}
            <SVGWarning />
        {:else if item.style === "error"}
            <SVGError />
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
        <button class="icon-button remove" on:click={e => { removeAlert(item.id) }}><SVGClose /></button>
    </div>
</div>

<style>
    .alert-card {
        background-color: var(--color-interface);
        /*padding: var(--spacing-lg);*/
        border-radius: 4px;
        border-inline-start: 4px solid var(--color-regular-background);
        display: flex;
        align-items: stretch;
        gap: var(--spacing-lg);
        flex-direction: row;
        justify-content: center;
        /*align-items: center;*/
        pointer-events: initial;
        position: relative;
    }

    .alert-card.success {
        border-color: var(--color-primary-background);
    }

    .alert-card.info {
        border-color: var(--color-secondary-background);
    }

    .alert-card.warning {
        border-color: var(--color-warning-background);
    }

    .alert-card.error {
        border-color: var(--color-danger-background);
    }

    .style-icon {
        width: 48px;
        color: white;
        align-items: center;
        display: flex;
        justify-content: center;
    }

    .success .style-icon {
        background-color: var(--color-primary-background);
    }

    .info .style-icon {
        background-color: var(--color-secondary-background);
    }

    .warning .style-icon {
        background-color: var(--color-warning-background);
    }

    .error .style-icon {
        background-color: var(--color-danger-background);
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