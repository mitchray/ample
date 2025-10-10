<script>
    import { _ } from "@rgglez/svelte-i18n";

    let { type } = $props();
</script>

{#if type === "private"}
    {$_("text.private")}
{:else}
    {$_("text.public")}
{/if}
