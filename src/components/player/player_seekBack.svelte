<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    on:click={() => {
        $MediaPlayer.goBackward(10);
    }}
    disabled={$NowPlayingQueue.length === 0}
    variant="text"
>
    <MaterialSymbol name="undo" />
</sl-button>
