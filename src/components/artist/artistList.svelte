<script>
    export let data;

    // only show 'featured' artists
    export let featuredOnly = false;

    // when no results, show a dash
    export let showDash = false;

    // disable the links
    export let disabled = false;

    // usually want this as default, but mixCard can wrap lines
    export let truncate = true;

    let artists = data.artists;

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
