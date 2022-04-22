<script>
    import { Link } from "svelte-routing";

    import { CurrentSong } from "../../stores/status";

    import { hasSongDuplicates } from "../../logic/song";

    import SVGWarning from "../../../public/images/warning.svg";
</script>

<div class="song-duplicates">
    {#if $CurrentSong}
        {#key $CurrentSong.title + $CurrentSong.artist.name}
            {#await hasSongDuplicates($CurrentSong.title, $CurrentSong.artist.name)}
            {:then songs}
                {#if songs.length > 1}
                    <Link to="duplicates/{$CurrentSong.title}/{$CurrentSong.artist.name}" title="Duplicates found"><SVGWarning class="inline"/> Duplicates found</Link>
                {/if}
            {/await}
        {/key}
    {/if}
</div>