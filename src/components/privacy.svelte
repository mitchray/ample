<script>
    import { _ } from "svelte-i18n";

    /** @type {Object} */
    export let type;
</script>

{#if type === "private"}
    {$_("text.private")}
{:else}
    {$_("text.public")}
{/if}
