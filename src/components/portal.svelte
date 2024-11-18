<script>
    import { onMount } from "svelte";
    import Portal from "svelte-portal";

    /** @type {{target?: string, children?: import('svelte').Snippet}} */
    let { target = "#app", children } = $props();
    let ready = $state();

    onMount(() => {
        ready = true;
    });
</script>

<Portal {target}>
    {#if ready}
        {@render children?.()}
    {/if}
</Portal>
