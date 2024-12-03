<script>
    import {
        autoUpdate,
        computePosition,
        offset,
        size,
    } from "@floating-ui/dom";
    import { quintOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    import { flip } from "svelte/animate";
    import { SiteContentBind } from "~/stores/elements.js";
    import { AlertsList } from "~/stores/message.js";
    import AlertCard from "~/components/alert/alertCard.svelte";
    import { onDestroy, onMount } from "svelte";

    let timeout;
    let freshAlerts = $derived(
        $AlertsList.filter((e) => e.fresh === true) || [],
    );
    let listBind;
    let autoUpdateCleanup;

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
            for (let i = 0; i < $AlertsList.length; i++) {
                $AlertsList[i].fresh = false;
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

    function start() {
        clearTimeout(timeout);
        startTimeout();
    }

    $effect(() => {
        if (freshAlerts.length > 0) {
            start();
        }
    });

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

<div bind:this={listBind} class="site-alerts">
    {#each freshAlerts as alert (alert.id)}
        <div
            class="card-container"
            in:fly={{ y: -100, duration: 300, easing: quintOut }}
            out:fade={{ duration: 300, easing: quintOut }}
            animate:flip={{ duration: 300 }}
            onmouseenter={(e) => handleEnter(e)}
            onmouseleave={(e) => handleLeave(e)}
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
