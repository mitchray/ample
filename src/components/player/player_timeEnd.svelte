<script>
    import { onMount } from "svelte";
    import { CurrentMedia } from "../../stores/status";

    import { formatSongLength } from "../../logic/helper";
    import { MediaPlayer } from "../../stores/player";

    let duration;

    function updateProgress() {
        duration = ($MediaPlayer.wavesurfer) ? parseInt($MediaPlayer.wavesurfer.getDuration()) || 0 : 0;

        requestAnimationFrame(updateProgress);
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

{#if $CurrentMedia}
    {formatSongLength(duration)}
{:else}
    -:--
{/if}