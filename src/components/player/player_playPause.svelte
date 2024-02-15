<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue, IsPlaying } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    class="play-pause"
    name="play"
    on:click={$MediaPlayer.playPause()}
    disabled={$NowPlayingQueue.length === 0}
>
    <MaterialSymbol name={$IsPlaying ? "pause" : "play_arrow"} />
</sl-button>

<style>
    .play-pause::part(base) {
        /*background-color: var(--color-highlight) !important;*/
        /*color: var(--color-background) !important;*/
        /*border-color: var(--color-highlight) !important;*/
        /*border-radius: 8px;*/
    }

    .play-pause:hover::part(base) {
        /*background-color: var(--color-background) !important;*/
        /*color: var(--color-highlight) !important;*/
        /*border-color: var(--color-highlight) !important;*/
    }
</style>
