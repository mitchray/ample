<script>
    import { MediaPlayer } from '../../stores/player';
    import { NowPlayingQueue } from "../../stores/status";

    import SVGShuffle from "/src/images/shuffle.svg";
</script>

<button
    class="icon-button icon-shuffle"
    on:click={$MediaPlayer.shuffle()}
    disabled={$NowPlayingQueue.length === 0}
    title="Shuffle"
>
    <SVGShuffle style="transform: scale(0.85);" />
</button>