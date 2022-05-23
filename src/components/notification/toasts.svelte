<script>
    import { quintOut } from 'svelte/easing';
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    import { SiteContentBind } from '../../stores/player';
    import { NotificationsList } from '../../stores/notification';

    import NotificationCard from '../../components/notification/notificationCard.svelte';

    let height = "100%";
    let timeout;
    let freshNotifications = [];

    $: {
        if ($NotificationsList) {
            freshNotifications = $NotificationsList.filter(e => e.fresh === true);
        }

        if (freshNotifications.length > 0) {
            clearTimeout(timeout);

            startTimeout();
        }
    }

    function handleEnter(e) {
        if (freshNotifications[0] && e.target.dataset.id === freshNotifications[0].id) {
            clearTimeout(timeout);
        }
    }

    function handleLeave(e) {
        if (freshNotifications[0] && e.target.dataset.id === freshNotifications[0].id) {
            startTimeout();
        }
    }

    function startTimeout() {
        timeout = setTimeout(() => {
            // just in case its gone before actioning
            if (freshNotifications[0]) {
                freshNotifications[0].fresh = false;
                freshNotifications = freshNotifications;
            }
        }, 5000);
    }
</script>

{#if $SiteContentBind}
    <div class="toasts-container"
        style="width: {$SiteContentBind.clientWidth}px; height: {$SiteContentBind.clientHeight}px; top: {$SiteContentBind.getBoundingClientRect().top}px; left: {$SiteContentBind.getBoundingClientRect().left}px;"
    >
        <div class="list">
            {#each freshNotifications as notification (notification.id)}
                <div class="card-container"
                    in:fly="{{ y: -200, duration: 300, easing: quintOut }}"
                    out:fade="{{ duration: 300, easing: quintOut }}"
                    animate:flip="{{ duration: 300 }}"
                    on:mouseenter={e => handleEnter(e)}
                    on:mouseleave={e => handleLeave(e)}
                    data-id="{notification.id}"
                >
                    <NotificationCard item={notification} />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .toasts-container {
        position: fixed;
        z-index: 25;
        pointer-events: none;
        overflow: hidden;
    }

    .toasts-container :global(.notification-card) {
        box-shadow: var(--shadow-xxl), var(--shadow-xxl), var(--shadow-xxl);
        border: 2px solid var(--color-menu-border);
    }

    .toasts-container :global(.notification-card.most-recent) {
        outline: 3px solid lime;
    }

    .card-container {
        pointer-events: initial;
    }

    .list {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1000;
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
    }
</style>