<script>
    import { onMount } from "svelte";
    import Portal from "svelte-portal";

    export let target = "#app";
    let ready;

    onMount(() => {
        ready = true;
    });
</script>

<Portal {target}>
    {#if ready}
        <slot />
    {/if}
</Portal>
