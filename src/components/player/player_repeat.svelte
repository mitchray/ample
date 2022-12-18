<script>
    import { MediaPlayer } from '../../stores/player';
    import { RepeatEnabled } from "../../stores/status";

    import SVGRepeat from "/src/images/repeat.svg";
</script>

<button
    class="icon-button icon-repeat"
    class:active={$RepeatEnabled}
    on:click={$MediaPlayer.repeat()}
    title="Repeat"
>
    <SVGRepeat style="transform: scale(0.85);" />
</button>