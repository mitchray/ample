<script>
    import { getContext } from "svelte";
    import Actions from "~/components/action/actions.svelte";

    export let contextKey;

    const { _actionData } = getContext(contextKey);
</script>

{#if !$_actionData.disable}
    <div class="c-lister-actions">
        <div class="group">
            <Actions displayMode="fullButtons" {...$_actionData} />
        </div>
    </div>
{/if}

<style>
    .c-lister-actions {
        display: flex;
        z-index: 1;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }

    .c-lister-actions > .group,
    .c-lister-actions :global(.c-actions) {
        display: contents;
    }
</style>
