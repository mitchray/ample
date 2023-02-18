<script>
    import { quintOut } from 'svelte/easing';
    import { fly, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';

    import { SiteMainSpace } from '../../stores/player';
    import { AlertsList } from '../../stores/message';

    import AlertCard from '../../components/alert/alertCard.svelte';

    let timeout;
    let freshAlerts = [];

    $: {
        if ($AlertsList) {
            freshAlerts = $AlertsList.filter(e => e.fresh === true);
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
</script>

{#if $SiteMainSpace.ready}
    <div class="alerts-container"
        style="width: {$SiteMainSpace.width}px; height: {$SiteMainSpace.height}px; top: {$SiteMainSpace.top}px; left: {$SiteMainSpace.left}px;"
    >
        <div class="list">
            {#each freshAlerts as alert (alert.id)}
                <div class="card-container"
                    in:fly="{{ y: -100, duration: 300, easing: quintOut }}"
                    out:fade="{{ duration: 300, easing: quintOut }}"
                    animate:flip="{{ duration: 300 }}"
                    on:mouseenter={e => handleEnter(e)}
                    on:mouseleave={e => handleLeave(e)}
                    data-id="{alert.id}"
                >
                    <AlertCard item={alert} />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style>
    .alerts-container {
        position: fixed;
        z-index: 25;
        pointer-events: none;
        overflow: hidden;
    }

    .alerts-container :global(.alert-card) {
        box-shadow: var(--shadow-xxl), var(--shadow-xxl), var(--shadow-xxl);
        border: 2px solid var(--color-menu-border);
    }

    .card-container {
        pointer-events: initial;
    }

    .list {
        position: absolute;
        bottom: 0;
        left: 50%;
        right: 0;
        z-index: 1000;
        max-width: 500px;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        /*outline: 3px solid lime;*/
    }
</style>