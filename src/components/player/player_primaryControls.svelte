<script>
    import { MediaPlayer } from '../../stores/player';

    import { NowPlayingQueue, IsPlaying } from "../../stores/status";

    import SVGPlay from "../../../public/images/play.svg";
    import SVGPause from "../../../public/images/pause.svg";
    import SVGNext from "../../../public/images/skip_next.svg";
    import SVGPrevious from "../../../public/images/skip_previous.svg";
</script>

<div class="primary-controls">
    <button
        class="icon-button"
        on:click={(e) => { $MediaPlayer.previous(e) }}
        disabled={$NowPlayingQueue.length === 0}
    >
        <SVGPrevious />
    </button>

    <button
        class="icon-button button--regular play"
        on:click={$MediaPlayer.playPause()}
        disabled={$NowPlayingQueue.length === 0}
    >
        {#if $IsPlaying}
            <SVGPause style="transform: scale(1.3);" />
        {:else}
            <SVGPlay style="transform: scale(1.3);" />
        {/if}
    </button>

    <button
        class="icon-button"
        on:click={(e) => { $MediaPlayer.next(e) }}
        disabled={$NowPlayingQueue.length === 0}
    >
        <SVGNext />
    </button>
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