<script>
    import { Link } from "svelte-routing";

    import { CurrentSong } from "../../stores/status";

    import { getSongVersions } from "../../logic/song";

    import SVGWarning from "../../../public/images/warning.svg";
</script>

<div class="song-versions">
    {#if $CurrentSong}
        {#key $CurrentSong.title + $CurrentSong.artist.name}
            {#await getSongVersions($CurrentSong.title, $CurrentSong.artist.name)}
            {:then songs}
                {#if songs.length > 1}
                    <Link to="versions/{$CurrentSong.title}/{$CurrentSong.artist.name}" title="Alternate versions found"><SVGWarning class="inline"/> Alternate versions found</Link>
                {/if}
            {/await}
        {/key}
    {/if}
</div>