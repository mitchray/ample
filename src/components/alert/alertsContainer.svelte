<script>
    import { onMount, onDestroy } from "svelte";
    import {
        computePosition,
        autoUpdate,
        offset,
        size,
    } from "@floating-ui/dom";
    import { quintOut } from "svelte/easing";
    import { fly, fade } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { SiteContentBind } from "~/stores/elements.js";
    import { AlertsList } from "~/stores/message.js";
    import AlertCard from "~/components/alert/alertCard.svelte";

    let timeout;
    let freshAlerts = [];
    let listBind;
    let autoUpdateCleanup;

    $: {
        if ($AlertsList) {
            freshAlerts = $AlertsList.filter((e) => e.fresh === true);
        }

        if (freshAlerts.length > 0) {
            clearTimeout(timeout);

            startTimeout();
        }
    }

    function handleEnter(e) {
        if (freshAlerts[0] && e.target.dataset.id === freshAlerts[0].id) {
            clearTimeout(timeout);
        }
    }

    function handleLeave(e) {
        if (freshAlerts[0] && e.target.dataset.id === freshAlerts[0].id) {
            startTimeout();
        }
    }

    function startTimeout() {
        timeout = setTimeout(() => {
            // just in case its gone before actioning
            let lastItem = freshAlerts.length - 1;

            if (freshAlerts[lastItem]) {
                freshAlerts[lastItem].fresh = false;
                freshAlerts = freshAlerts;
            }
        }, 3000);
    }

    function updatePosition() {
        computePosition($SiteContentBind, listBind, {
            placement: "bottom",
            middleware: [
                size({
                    apply({ availableHeight, elements }) {
                        Object.assign(elements.floating.style, {
                            // Minimum acceptable height is 50px.
                            // `flip` will then take over.
                            height: `${$SiteContentBind.clientHeight - 15}px`,
                        });
                    },
                }),
                offset(({ rects }) => ({
                    mainAxis: -rects.floating.height - 3,
                    alignmentAxis: 15,
                })),
            ],
        }).then(({ x, y }) => {
            Object.assign(listBind.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }

    onMount(() => {
        updatePosition();

        autoUpdateCleanup = autoUpdate(
            $SiteContentBind,
            listBind,
            updatePosition,
        );
    });

    onDestroy(() => {
        // floating-ui
        autoUpdateCleanup();
    });
</script>

<div class="site-alerts" bind:this={listBind}>
    {#each freshAlerts as alert (alert.id)}
        <div
            class="card-container"
            in:fly={{ y: -100, duration: 300, easing: quintOut }}
            out:fade={{ duration: 300, easing: quintOut }}
            animate:flip={{ duration: 300 }}
            on:mouseenter={(e) => handleEnter(e)}
            on:mouseleave={(e) => handleLeave(e)}
            data-id={alert.id}
        >
            <AlertCard item={alert} />
        </div>
    {/each}
</div>

<style>
    .site-alerts :global(.alert-card) {
        box-shadow: var(--shadow-xxl), var(--shadow-xxl), var(--shadow-xxl);
        border-width: 2px;
        border-style: solid;
    }

    .card-container {
        pointer-events: initial;
    }

    .site-alerts {
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        z-index: 1000;
        height: 100%;
        width: 500px;
        max-width: calc(100% - var(--spacing-xxl));
        display: flex;
        flex-direction: column;
        justify-content: end;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        pointer-events: none;
        overflow: hidden;
    }
</style>
