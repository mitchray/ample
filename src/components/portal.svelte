<script>
    import { onMount } from "svelte";
    import Portal from "svelte-portal";

    export let target = "body";
    let ready;

    onMount(() => {
        ready = true;
    });
</script>

<Portal target={target || "body"}>
    {#if ready}
        <slot />
    {/if}
</Portal>
