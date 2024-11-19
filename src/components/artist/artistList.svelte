<script>
    let {
        data,
        featuredOnly = false, // only show 'featured' artists
        showDash = false, // when no results, show a dash
        disabled = false, // disable the links
        truncate = true, // usually want this as default, but mixCard can wrap lines
    } = $props();

    let artists = $state(data.artists);

    if (featuredOnly) {
        // filter album artist
        artists = artists.filter(
            (artist) => artist.id !== data.albumartist?.id,
        );
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
