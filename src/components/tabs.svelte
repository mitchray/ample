<script>
    // Courtesy of https://linguinecode.com/post/svelte-tabs-component
    import { onMount } from "svelte";

    export let items = [];
    export let activeTabValue = null;

    onMount(() => {
        // Set default tab value
        if (Array.isArray(items) && items.length && items[0].value) {
            activeTabValue = items[0].value;
        }
    });

    function handleClick(tabValue) {
        activeTabValue = tabValue;
    }
</script>

<ul class="tabs">
    {#if Array.isArray(items)}
        {#each items as item}
            <li class={activeTabValue === item.value ? 'active' : ''}>
                <span on:click={handleClick(item.value)}>
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
        margin-bottom: var(--spacing-xl);
        font-weight: 700;
        text-transform: uppercase;
        font-family: var(--font-heading);
        border-bottom: 2px solid var(--color-lines);
    }

    span {
        display: block;
        padding: 0.7em 1.2em;
        cursor: pointer;
    }

    span:hover {
        background-color: var(--color-tint-100);
    }

    :global(.theme-is-light) span:hover {
        background-color: var(--color-shade-100);
    }

    li.active > span {
        color: var(--color-link-active);
    }

    li.active {
        position: relative;
    }
    
    li.active:after {
        content: '';
        display: block;
        position: absolute;
        top: 100%;
        width: 100%;
        border-bottom: 2px solid var(--color-highlight);
        z-index: 1;
    }
</style>
