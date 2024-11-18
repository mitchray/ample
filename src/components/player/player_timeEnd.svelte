<script>
    import { onMount } from "svelte";
    import { CurrentMedia } from "~/stores/state";
    import { formatSongLength } from "~/logic/formatters.js";
    import { MediaPlayer } from "~/stores/elements.js";

    let duration = $state();

    function updateProgress() {
        duration = $MediaPlayer.getDuration();

        requestAnimationFrame(updateProgress);
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

{#if $CurrentMedia?.object_type !== "live_stream"}
    {formatSongLength(duration)}
{:else}
    -:--
{/if}
