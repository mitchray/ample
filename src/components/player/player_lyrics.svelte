<script>
    import { ShowLyrics } from "../../stores/status";

    import SVGLyrics from "../../../public/images/lyrics.svg";

    function toggleLyrics() {
        let inverted = !$ShowLyrics;
        localStorage.setItem('ShowLyrics', JSON.stringify(inverted));
        ShowLyrics.set(inverted);
    }
</script>

<button
    class="icon-button"
    on:click={toggleLyrics}
    title="{$ShowLyrics ? 'Hide' : 'Show'} lyrics"
>
    <SVGLyrics style="transform: scale(0.75);" />
</button>