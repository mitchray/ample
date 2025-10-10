<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { ShowLyrics } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function toggleLyrics() {
        let inverted = !$ShowLyrics;
        ShowLyrics.set(inverted);
    }
</script>

<sl-button
    onclick={toggleLyrics}
    title={$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
>
    <MaterialSymbol name="lyrics" />
</sl-button>
