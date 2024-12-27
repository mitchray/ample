<script>
    let { items, limit = null } = $props();

    let genres = $state([]);
    let overflowGenres = $state([]);
    let showActivated = $state(false);

    if (limit) {
        genres = items.slice(0, limit);
        overflowGenres = items.slice(limit, items.length);
    } else {
        genres = items;
    }
</script>

{#if genres.length > 0}
    <ul class="container" class:is-overflow={limit}>
        {#each genres as genre}
            <li class="genre-tag">
                <sl-button
                    href="#/genre/{genre.id}"
                    size="small"
                    title={genre.name}
                    pill
                >
                    {genre.name}
                </sl-button>
            </li>
        {/each}

        {#if overflowGenres.length}
            <li>
                {#if !showActivated}
                    <sl-button
                        variant="text"
                        class="overflow-button"
                        size="small"
                        onclick={(e) => {
                            showActivated = true;
                        }}
                    >
                        +{overflowGenres.length}
                    </sl-button>
                {/if}

                {#if showActivated}
                    {@render createDropdown()}
                {/if}
            </li>
        {/if}
    </ul>
{/if}

{#snippet createDropdown()}
    <sl-dropdown open hoist>
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
                        <sl-button href="#/genre/{genre.id}" size="small" pill>
                            {genre.name}
                        </sl-button>
                    </li>
                {/each}
            </ul>
        </sl-card>
    </sl-dropdown>
{/snippet}

<style>
    .container {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
        width: 100%;
    }

    .container:not(.is-overflow) {
        flex-wrap: wrap;
    }

    .genre-tag {
        overflow: hidden;
    }

    .genre-tag sl-button {
        max-width: 100%;
    }

    .genre-tag sl-button::part(label) {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
