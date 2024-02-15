<script>
    export let artists;
</script>

{#each Object.entries(artists) as [key, value], i}
    <div class="sidebar-index">{key.toUpperCase()}</div>

    {#each value as artist}
        <div class="sidebar-artist truncate">
            <a href="#/artist/{artist.id}" title={artist.name}>
                {artist.name}
            </a>
        </div>
    {/each}
{/each}

<style>
    .sidebar-index,
    .sidebar-artist {
        padding: var(--spacing-sm) var(--spacing-lg);
    }

    .sidebar-index {
        font-weight: 700;
        color: var(--color-tertiary);
        font-size: 20px;
    }

    .sidebar-artist + .sidebar-index {
        margin-block-start: var(--spacing-lg);
    }

    .sidebar-index:after {
        content: "";
        display: block;
        border-block-end: 2px solid var(--color-outline-variant);
        padding-block-start: var(--spacing-sm);
    }
</style>
