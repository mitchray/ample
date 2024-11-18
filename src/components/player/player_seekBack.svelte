<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    disabled={$NowPlayingQueue.length === 0}
    onclick={() => {
        $MediaPlayer.goBackward(10);
    }}
    variant="text"
>
    <MaterialSymbol name="undo" />
</sl-button>
