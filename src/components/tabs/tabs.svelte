<script>
    import { onMount } from "svelte";

    export let items = [];
    export let activeTabValue = null;
    export let enableHash = true;

    let hash;
    let item;
    let currentURL;

    onMount(() => {
        hash = window.location.hash.substr(1);
        item = items.find(obj => obj.value === hash) || items[0];
        setCurrentURL();

        // set active tab from URL hash if present
        if (item) {
            activeTabValue = item.value;
            item.loaded = true;
        } else {
            // Fallback default tab value
            if (Array.isArray(items) && items.length && items[0].value) {
                activeTabValue = items[0].value;
                items[0].loaded = true;
            }
        }
    });

    function setHistory() {
        if (enableHash) {
            window.history.replaceState({}, '', "#" + activeTabValue);
        }
    }

    function setCurrentURL() {
        if (enableHash) {
            currentURL = window.location.toString();
        }
    }

    function handleClick(tab) {
        tab.loaded = true;
        activeTabValue = tab.value;
        items = items;
        setCurrentURL();
        setHistory();
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

<div class="tab-content">
    <slot></slot>
</div>

<style>
    ul {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        margin-bottom: var(--spacing-xxl); /* big spacing to account for lister actions overflow trick */
        column-gap: var(--spacing-xl);
        row-gap: var(--spacing-md);
        font-weight: 700;
    }

    span {
        display: block;
        padding: 0.3em 0;
        cursor: pointer;
        border-bottom: 3px solid transparent;
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
    }

    /* hide by default */
    .tab-content > :global(*) {
        display: none;
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        overflow-x: hidden;
    }

    .tab-content > :global( .active-tab) {
        display: block;
    }
</style>
