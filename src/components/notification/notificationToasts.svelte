<script>
    import {
        autoUpdate,
        computePosition,
        offset,
        size,
    } from "@floating-ui/dom";
    import { quintOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    import { SiteContentBind } from "~/stores/elements.js";
    import { Notifications } from "~/stores/message";
    import NotificationList from "~/components/notification/_notificationList.svelte";

    let timeout;
    let autoTimeout;
    let freshNotifications = $derived(
        $Notifications.filter((e) => e.fresh === true && !e.isSilent),
    );
    let listBind = $state();
    let autoUpdateCleanup;

    function start() {
        clearTimeout(autoTimeout);
        clearTimeout(timeout);
        startAutoTimeout();
    }

    function finish() {
        $Notifications.forEach((item) => {
            item.fresh = false;
        });
    }

    function handleEnter() {
        clearTimeout(autoTimeout);
        clearTimeout(timeout);
    }

    function handleLeave() {
        startTimeout();
    }

    function startTimeout() {
        timeout = setTimeout(() => {
            finish();
        }, 2000);
    }

    function startAutoTimeout() {
        autoTimeout = setTimeout(() => {
            finish();
        }, 5000);
    }

    function updatePosition() {
        computePosition($SiteContentBind, listBind, {
            placement: "top-end",
            middleware: [
                size({
                    apply({ availableHeight, elements }) {
                        Object.assign(elements.floating.style, {
                            // Account for progress bar
                            height: `${$SiteContentBind.clientHeight - 3}px`,
                        });
                    },
                }),
                offset(({ rects }) => ({
                    mainAxis: -rects.floating.height,
                    alignmentAxis: 0,
                })),
            ],
        }).then(({ x, y }) => {
            Object.assign(listBind.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }

    $effect(() => {
        updatePosition();

        autoUpdateCleanup = autoUpdate(
            $SiteContentBind,
            listBind,
            updatePosition,
        );

        if (freshNotifications.length > 0) {
            start();
        }

        return () => {
            // floating-ui
            autoUpdateCleanup();
        };
    });
</script>

<div bind:this={listBind} class="site-notifications">
    <div
        class="container"
        onmouseenter={() => handleEnter()}
        onmouseleave={() => handleLeave()}
    >
        {#if freshNotifications.length > 0}
            <sl-card
                in:fly={{ y: -200, duration: 300, easing: quintOut }}
                out:fade={{ duration: 300, easing: quintOut }}
            >
                <NotificationList notifications={freshNotifications} />
            </sl-card>
        {/if}
    </div>
</div>

<style>
    .container {
        pointer-events: initial;
    }

    .container :global(.notification-card) {
        width: 222px;
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
