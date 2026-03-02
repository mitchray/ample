<script>
    import { _ } from "@rgglez/svelte-i18n";

    let { query } = $props();
</script>

{#if query?.isError}
    <p>{$_("text.error")}: {query.error?.message}</p>
{/if}
