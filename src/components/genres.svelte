<script>
    import { Link } from 'svelte-routing';

    import SVGGenre from "../../public/images/label.svg";

    export let genres;
</script>

{#if genres.length > 0}
    <ul class="genres">
        {#each genres as genre}
            <li class="genre-tag"><Link to="genres/{genre.id}"><SVGGenre class="inline" /> {genre.name}</Link></li>
        {/each}
    </ul>
{/if}

<style>
    .genres {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        margin-bottom: var(--spacing-lg);
    }

    .genre-tag {
        display: inline-flex;
        background-color: hsl(264, 50%, 25%);
        color: hsl(251, 95%, 92%);
        border-radius: 3px;
        padding: 0.2em 0.5em;
        font-weight: 700;
        letter-spacing: 0.01em;
    }

    :global(.theme-is-light) .genre-tag {
        background-color: hsl(251, 95%, 92%);
        color: hsl(264, 67%, 35%);
    }

    .genre-tag :global(a),
    .genre-tag :global(svg) {
        color: inherit;
    }
</style>