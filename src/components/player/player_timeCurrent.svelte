<script>
    import { onMount } from "svelte";
    import { CurrentMedia, TimeToggled } from "~/stores/state";
    import { formatSongLength } from "~/logic/formatters.js";
    import { MediaPlayer } from "~/stores/elements.js";

    let duration;
    let currentTime;

    function handleTimeToggle() {
        $TimeToggled = !$TimeToggled;
    }

    function updateProgress() {
        duration = $MediaPlayer.getDuration();
        currentTime = $MediaPlayer.getCurrentTime();

        requestAnimationFrame(updateProgress);
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

{#if $CurrentMedia?.object_type !== "live_stream"}
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
