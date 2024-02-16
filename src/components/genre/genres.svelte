<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let genres;
</script>

{#if genres.length > 0}
    <ul class="genres">
        {#each genres as genre}
            <li class="genre-tag">
                <a href="#/genres/{genre.id}">
                    <MaterialSymbol name="label" />
                    {genre.name}
                </a>
            </li>
        {/each}
    </ul>
{/if}

<style>
    .genres {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        margin-block-start: 0;
        margin-block-end: 0;
    }

    .genre-tag :global(a) {
        display: flex;
        background-color: var(--color-secondary-container-variant);
        color: var(--color-on-secondary-container);
        border-radius: 3px;
        padding: 0.2em 0.5em;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .genre-tag :global(svg) {
        color: inherit;
        opacity: 0.5;
        height: 1em;
        width: auto;
        margin-inline-end: var(--spacing-sm);
    }
</style>
