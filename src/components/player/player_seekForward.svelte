<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    disabled={$NowPlayingQueue.length === 0}
    onclick={() => {
        $MediaPlayer.goForward(30);
    }}
    variant="text"
>
    <MaterialSymbol name="redo" />
</sl-button>
