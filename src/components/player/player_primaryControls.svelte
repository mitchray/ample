<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue, IsPlaying } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<div class="primary-controls">
    <sl-button
        on:click={(e) => {
            $MediaPlayer.previous(e);
        }}
        disabled={$NowPlayingQueue.length === 0}
    >
        <MaterialSymbol name="skip_previous" />
    </sl-button>

    <sl-button
        class="play"
        on:click={$MediaPlayer.playPause()}
        disabled={$NowPlayingQueue.length === 0}
    >
        <MaterialSymbol name={$IsPlaying ? "pause" : "play_arrow"} />
    </sl-button>

    <sl-button
        on:click={(e) => {
            $MediaPlayer.next(e);
        }}
        disabled={$NowPlayingQueue.length === 0}
    >
        <MaterialSymbol name="skip_next" />
    </sl-button>
</div>

<style>
    .primary-controls {
        gap: var(--spacing-sm);
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.9);
    }

    .play {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
