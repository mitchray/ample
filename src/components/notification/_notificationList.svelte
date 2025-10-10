<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { quintOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import NotificationCard from "~/components/notification/notificationCard.svelte";

    let { notifications } = $props();
</script>

<div class="container">
    {#each notifications as notification (notification.id)}
        <div
            class="card-container"
            out:fade={{ duration: 300, easing: quintOut }}
            animate:flip={{ duration: 300 }}
        >
            <NotificationCard item={notification} />
        </div>
    {/each}

    {#if notifications.length === 0}
        {$_("text.noItemsFound")}
    {/if}
</div>

<style>
    .container {
        overflow-y: auto;
        max-height: 50svh;
        /*scrollbar-gutter: stable;*/
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .card-container {
        border: 1px solid var(--color-outline-variant);
        border-radius: 4px;
    }
</style>
