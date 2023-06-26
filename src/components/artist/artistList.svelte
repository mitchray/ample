<script>
    export let artists = [];
    export let disabled = false;
</script>

<div class="artists" class:disabled>
    {#each artists as artist, i}
        <a href="#/artists/{artist.id}" title="{artist.name}">
            {artist.name}{#if i < artists.length - 1},&nbsp;{/if}
        </a>
    {/each}
</div>

<style>
    .artists {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .disabled {
        pointer-events: none;
    }
</style>