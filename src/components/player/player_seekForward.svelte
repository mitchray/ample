<script>
    import { MediaPlayer } from "~/stores/elements.js";
    import { NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    on:click={() => {
        $MediaPlayer.goForward(30);
    }}
    disabled={$NowPlayingQueue.length === 0}
    variant="text"
>
    <MaterialSymbol name="redo" />
</sl-button>
