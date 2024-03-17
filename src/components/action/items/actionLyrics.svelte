<script>
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ShowLyrics } from "~/stores/state.js";

    function handleAction() {
        let inverted = !$ShowLyrics;
        ShowLyrics.set(inverted);
    }
</script>

<sl-menu-item
    {...$$restProps}
    on:click={handleAction}
    title={$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
>
    <MaterialSymbol name="lyrics" slot="prefix" />
    {$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
</sl-menu-item>
