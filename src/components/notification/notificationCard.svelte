<script>
    import { removeNotification } from "~/logic/notification.js";
    import Rating from "~/components/rating/rating.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let item;
</script>

<div class="notification-card card {item.style}">
    <div class="style-icon">
        <sl-tooltip content={item.title}>
            {#if item.style === "info"}
                <MaterialSymbol name="info" />
            {:else if item.style === "success"}
                <MaterialSymbol name="check" />
            {:else if item.style === "warning"}
                <MaterialSymbol name="warning" />
            {:else if item.style === "error"}
                <MaterialSymbol name="error" />
            {/if}
        </sl-tooltip>
    </div>

    <div class="content truncate">
        <div class="action-title">
            {#if item.type === "ratingMissing"}
                <Rating type="song" data={item.data} />
            {:else if item.type === "alternateVersions"}
                <a
                    href="#/versions/{item.data.title}/{item.data.artist.name}"
                    title={item.title}
                >
                    {item.title}
                </a>
            {:else if item.title}
                <div>{item.title}</div>
            {/if}
        </div>

        <div class="link truncate">
            <a href="#/song/{item.data.id}" title={item.data.name}>
                {item.data.name}
            </a>
        </div>
    </div>

    <div class="actions">
        <sl-button
            class="remove"
            variant="text"
            on:click={() => {
                removeNotification(item.id);
            }}
        >
            <MaterialSymbol name="close" />
        </sl-button>
    </div>
</div>

<style>
    .notification-card {
        border-radius: 4px;
        /*border-inline-start: 4px solid red;*/
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--spacing-md);
        font-size: 0.9em;
        line-height: 1.3;
        padding: var(--spacing-md);
        padding-inline-end: 0;
    }

    .notification-card.success {
        border-color: var(--swatch-green-500);
    }

    .notification-card.info {
        border-color: var(--swatch-blue-500);
    }

    .notification-card.warning {
        border-color: var(--swatch-yellow-500);
    }

    .notification-card.error {
        border-color: var(--swatch-red-500);
    }

    .style-icon {
        font-size: 20px;
    }

    .success .style-icon {
        color: var(--swatch-green-500);
    }

    .info .style-icon {
        color: var(--swatch-blue-500);
    }

    .warning .style-icon {
        color: var(--swatch-yellow-500);
    }

    .error .style-icon {
        color: var(--swatch-red-500);
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .action-title {
        display: flex;
        gap: var(--spacing-sm);
    }
</style>
