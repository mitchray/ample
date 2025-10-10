<script>
    import { _ } from "@rgglez/svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ShowLyrics } from "~/stores/state.js";
    let { ...rest } = $props();

    function handleAction() {
        let inverted = !$ShowLyrics;
        ShowLyrics.set(inverted);
    }
</script>

<sl-menu-item
    {...rest}
    onclick={handleAction}
    title={$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
>
    <MaterialSymbol name="lyrics" slot="prefix" />
    {$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
</sl-menu-item>
