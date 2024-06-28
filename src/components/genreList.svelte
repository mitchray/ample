<script>
    /** All the genres */
    export let items;

    /** Overflow items beyond the limit */
    export let limit = null;

    let genres = [];
    let overflowGenres = [];

    if (limit) {
        genres = items.slice(0, limit);
        overflowGenres = items.slice(limit, items.length);
    } else {
        genres = items;
    }
</script>

{#if genres.length > 0}
    <ul class="genres" class:is-overflow={limit}>
        {#each genres as genre}
            <li class="genre-tag">
                <sl-button href="#/genre/{genre.id}" size="small" pill>
                    {genre.name}
                </sl-button>
            </li>
        {/each}

        {#if overflowGenres.length}
            <li>
                <sl-dropdown hoist>
                    <sl-button
                        slot="trigger"
                        variant="text"
                        class="overflow-button"
                        size="small"
                    >
                        +{overflowGenres.length}
                    </sl-button>

                    <sl-card>
                        <ul class="overflow-menu">
                            {#each overflowGenres as genre}
                                <li class="genre-tag">
                                    <sl-button
                                        href="#/genre/{genre.id}"
                                        size="small"
                                        pill
                                    >
                                        {genre.name}
                                    </sl-button>
                                </li>
                            {/each}
                        </ul>
                    </sl-card>
                </sl-dropdown>
            </li>
        {/if}
    </ul>
{/if}

<style>
    .genres {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .genres:not(.is-overflow) {
        flex-wrap: wrap;
    }

    .overflow-menu {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .overflow-button::part(label) {
        padding: 0;
    }

    sl-button::part(base):not(:hover) {
        background-color: transparent;
    }
</style>
