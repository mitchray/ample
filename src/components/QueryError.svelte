<script>
	let { query } = $props();
</script>

{#if query?.isError}
	<p>Error: {query.error?.message}</p>
{/if}
