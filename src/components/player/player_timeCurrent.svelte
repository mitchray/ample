<script>
    import { onMount } from "svelte";
    import { CurrentSong, TimeToggled } from "../../stores/status";

    import { formatSongLength } from "../../logic/helper";
    import { MediaPlayer } from "../../stores/player";

    let duration;
    let currentTime;

    function handleTimeToggle() {
        $TimeToggled = !$TimeToggled;
    }

    function updateProgress() {
        duration = ($MediaPlayer.wavesurfer) ? parseInt($MediaPlayer.wavesurfer.getDuration()) || 0 : 0;
        currentTime = ($MediaPlayer.wavesurfer) ? parseInt($MediaPlayer.wavesurfer.getCurrentTime()) || 0 : 0;

        requestAnimationFrame(updateProgress);
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

{#if $CurrentSong}
    <span class="current" on:click={handleTimeToggle}>
        {#if $TimeToggled}
            -{formatSongLength(duration - currentTime)}
        {:else}
            {formatSongLength(currentTime)}
        {/if}
    </span>
{:else}
    -:--
{/if}