<script>

    // only show 'featured' artists

    // when no results, show a dash

    // disable the links

    // usually want this as default, but mixCard can wrap lines
    /** @type {{data: any, featuredOnly?: boolean, showDash?: boolean, disabled?: boolean, truncate?: boolean}} */
    let {
        data,
        featuredOnly = false,
        showDash = false,
        disabled = false,
        truncate = true
    } = $props();

    let artists = $state(data.artists);

    if (featuredOnly) {
        // filter album artist
        artists = artists.filter(
            (artist) => artist.id !== data.albumartist?.id,
        );

        // filter regular artist
    }
</script>

<span class="c-artists" class:disabled class:truncate>
    {#if artists.length}
        {#each artists as artist, i}
            <!-- prettier-ignore -->
            <a href="#/artist/{artist.id}" title={artist.name}><!--
            -->{artist.name}{#if i < artists.length - 1},&nbsp;{/if}<!--
            --></a>
        {/each}
    {:else if showDash}-{/if}
</span>

<style>
    .disabled {
        pointer-events: none;
    }
</style>
