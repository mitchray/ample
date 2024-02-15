<script>
    import { getContext } from "svelte";
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ShowLyrics } from "~/stores/state.js";

    export let contextKey;

    function handleAction() {
        let inverted = !$ShowLyrics;
        ShowLyrics.set(inverted);
    }
</script>

<sl-menu-item
    on:click={handleAction}
    title={$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
    {...$$restProps}
>
    <MaterialSymbol name="lyrics" slot="prefix" />
    {$ShowLyrics ? $_("text.lyricsHide") : $_("text.lyricsShow")}
</sl-menu-item>
