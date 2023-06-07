<script>
    import { _ } from 'svelte-i18n';
    import { MediaPlayer } from '../../stores/player';
    import { NowPlayingQueue } from "../../stores/status";

    import SVGShuffle from "/src/images/shuffle.svg";
</script>

<button
    class="icon-button icon-shuffle"
    on:click={$MediaPlayer.shuffle()}
    disabled={$NowPlayingQueue.length === 0}
    title="{$_('text.shuffle')}"
>
    <SVGShuffle style="transform: scale(0.85);" />
</button>