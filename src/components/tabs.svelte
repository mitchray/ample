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
        font-family: var(--font-heading);
    }

    @media all and (min-width: 1300px) {
        ul {
            width: fit-content;
            border-radius: 100vh;
            padding: var(--spacing-sm);
            background-color: var(--color-card-primary);
            box-shadow: var(--shadow-md);
        }
    }

    span {
        display: block;
        padding: 0.7em 1.2em;
        cursor: pointer;
    }

    li:hover {
        background-color: var(--color-card-highlight);
    }

    li {
        border-radius: 100vh;
        font-weight: 600;
    }

    li.active {
        position: relative;
        background-color: var(--color-active-background);
    }
</style>
