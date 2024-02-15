<script>
    import { _ } from "svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    on:click={$MediaPlayer.shuffle()}
    disabled={$NowPlayingQueue.length === 0}
    title={$_("text.shuffle")}
    variant="text"
>
    <MaterialSymbol name="shuffle" />
</sl-button>
