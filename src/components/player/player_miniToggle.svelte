<script>
    import { PlayerIsMini, Saved } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function handlePlayerMiniToggle() {
        let inverted = !$PlayerIsMini;
        $Saved.setItem("PlayerIsMini", inverted);
        PlayerIsMini.set(inverted);
    }
</script>

<sl-tooltip content={$PlayerIsMini ? "Show waveform" : "Hide waveform"}>
    <sl-button onclick={handlePlayerMiniToggle} variant="text">
        <MaterialSymbol name={$PlayerIsMini ? "unfold_more" : "unfold_less"} />
    </sl-button>
</sl-tooltip>
