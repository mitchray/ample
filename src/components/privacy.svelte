<script>
    import { _ } from "svelte-i18n";

    
    /** @type {{type: Object}} */
    let { type } = $props();
</script>

{#if type === "private"}
    {$_("text.private")}
{:else}
    {$_("text.public")}
{/if}
