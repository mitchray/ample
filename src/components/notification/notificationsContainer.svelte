<script>
    import { onMount, onDestroy } from "svelte";
    import { computePosition, autoUpdate, offset, size } from '@floating-ui/dom';
    import { quintOut } from 'svelte/easing';
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    import { SiteContentBind } from '../../stores/player';
    import { NotificationsList } from '../../stores/message';

    import NotificationCard from '../../components/notification/notificationCard.svelte';

    let timeout;
    let freshNotifications = [];
    let listBind;
    let autoUpdateCleanup;

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

    function updatePosition() {
        computePosition($SiteContentBind, listBind, {
            placement: "top-end",
            middleware: [
                size({
                    apply({availableHeight, elements}) {
                        Object.assign(elements.floating.style, {
                            // Account for progress bar
                            height: `${$SiteContentBind.clientHeight - 3}px`,
                        });
                    },
                }),
                offset(({rects}) => ({
                    mainAxis: -rects.floating.height,
                    alignmentAxis: 0,
                }))
            ],
        }).then(({x, y}) => {
            Object.assign(listBind.style, {
                left:  `${x}px`,
                top: `${y}px`,
            });
        });
    }

    onMount(() => {
        updatePosition();

        autoUpdateCleanup = autoUpdate(
            $SiteContentBind,
            listBind,
            updatePosition
        );
    });

    onDestroy(() => {
        // floating-ui
        autoUpdateCleanup();
    })
</script>

<div class="site-notifications" bind:this={listBind}>
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

<style>
    .site-notifications :global(.notification-card) {
        box-shadow: var(--shadow-xxl), var(--shadow-xxl), var(--shadow-xxl);
        border: 2px solid var(--color-menu-border);
    }

    .card-container {
        pointer-events: initial;
    }

    .site-notifications {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        z-index: 1000;
        width: 300px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        /*outline: 50px solid lime;*/
        pointer-events: none;
        overflow: hidden;
    }
</style>