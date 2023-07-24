<script>
    import { _ } from 'svelte-i18n';
    import { ShowLyrics } from "../../stores/status";
    import SVGLyrics from "/src/images/lyrics.svg";

    function toggleLyrics() {
        let inverted = !$ShowLyrics;
        localStorage.setItem('AmpleShowLyrics', JSON.stringify(inverted));
        ShowLyrics.set(inverted);
    }
</script>

<button
    class="icon-button"
    on:click={toggleLyrics}
    title="{$ShowLyrics ? $_('text.lyricsHide') : $_('text.lyricsShow')}"
>
    <SVGLyrics style="transform: scale(0.75);" />
</button>