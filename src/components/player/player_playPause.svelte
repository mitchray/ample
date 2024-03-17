<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { IsPlaying, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    class="play-pause"
    disabled={$NowPlayingQueue.length === 0}
    name="play"
    on:click={$MediaPlayer.playPause()}
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
