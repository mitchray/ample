<script>
    import { Link } from 'svelte-routing';
    import SVGArtist from "/src/images/artist.svg";

    export let artists = [];
    export let disabled = false;
</script>

<div class="artists" class:disabled>
    {#each artists as artist, i}
        <Link to="artists/{artist.id}" title="{artist.name}">
            {artist.name}{#if i < artists.length - 1},&nbsp;{/if}
        </Link>
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