<script>
    import { CurrentSong } from "../../stores/status";
    import { serverURL } from "../../stores/server";
</script>

{#if $CurrentSong}
    <img class="nowPlayingArtwork"
        src="{$CurrentSong.art}&thumb=32"
        alt=""
        on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=32' }}
    />
{:else}
    <img class="nowPlayingArtwork"
        src="{$serverURL}/image.php?object_id=0&object_type=song&thumb=32"
        alt=""
    />
{/if}

<style>
    .nowPlayingArtwork {
        aspect-ratio: 1 / 1;
        display: block;
        max-width: 100%;
    }
</style>