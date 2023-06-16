<script>
    import { onMount, tick } from "svelte";
    import { v4 as uuidv4 } from 'uuid';
    import { TabHistory } from "../../stores/status";

    export let id = null; // unique ID for remembering last active tab, otherwise no remembering
    export let items = [];
    export let activeTabValue = null;

    let uniqueID = uuidv4();

    onMount(() => {
        let found = items.find(obj => obj.value === $TabHistory[id]) || items[0];

        // set active tab from history if present
        if (found) {
            activeTabValue = found.value;
            found.loaded = true;
        } else {
            // Fallback default tab value
            if (Array.isArray(items) && items.length && items[0].value) {
                activeTabValue = items[0].value;
                items[0].loaded = true;
            }
        }

        showHide();
    });

    function handleClick(tab) {
        tab.loaded = true;
        activeTabValue = tab.value;
        items = items;
        showHide();
        $TabHistory[id] = activeTabValue;
    }

    async function showHide() {
        await tick();
        let allTabs = document.querySelectorAll(".tab-content_" + uniqueID + " .tab");

        allTabs.forEach((tab) => {
            if (tab.classList.contains('active-tab')) {
                tab.classList.remove('tab-hidden');
                setTimeout(function () {
                    tab.classList.remove('tab-visuallyHidden');
                }, 20);
            } else {
                if (!tab.classList.contains('tab-hidden')) {
                    tab.classList.add('tab-visuallyHidden');
                    tab.addEventListener('transitionend', function(e) {
                        tab.classList.add('tab-hidden');
                    }, {
                        capture: false,
                        once: true,
                        passive: false
                    });
                }
            }
        });
    }
</script>

<ul class="tabs">
    {#if Array.isArray(items)}
        {#each items as item}
            <li
                class:active={activeTabValue === item.value}
            >
                <span on:click={handleClick(item)}>
                    {#if item.icon}
                        <svelte:component this={item.icon} class="inline tab-icon" />
                    {/if}
                    {item.label}
                </span>
            </li>
        {/each}
    {/if}
</ul>

<div class="tab-content tab-content_{uniqueID} page-main">
    <slot></slot>
</div>

<style>
    ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        margin-block-end: var(--spacing-xxl); /* big spacing to account for lister actions overflow trick */
        column-gap: var(--spacing-xl);
        row-gap: var(--spacing-md);
        font-weight: 700;
    }

    span {
        display: block;
        padding: 0.3em 0;
        cursor: pointer;
        border-block-end: 3px solid transparent;
    }

    @media (hover: hover) {
        span:hover {
            border-color: var(--color-active-background);
        }
    }

    li:not(.active) span {
        color: var(--color-text-secondary);
    }

    li.active span {
        border-color: var(--color-highlight);
    }

    .tab-content {
        display: grid;
        grid-template-columns: auto 1fr; /* 1fr is to trick content into only taking up auto space */
    }

    /* hide by default */
    .tab-content > :global(*) {
        display: block;
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        transition: all 0.2s linear;
    }

    .tab-content :global(.tab-hidden) {
        display: none;
    }

    .tab-content :global(.tab-visuallyHidden) {
        opacity: 0;
        transform: translateY(20px);
    }

    /* lister workaround */
    .tab-content :global(.lister-wrapper) {
        max-width: calc(100vw - 2 * var(--spacing-xxl));
    }

    .tab-content > :global(.active-tab) {
        /*display: block;*/
    }
</style>
