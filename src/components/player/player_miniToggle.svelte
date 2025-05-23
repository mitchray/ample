<script>
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function handlePlayerMiniToggle() {
        let inverted = !$Settings.PlayerIsMini;
        $Settings.PlayerIsMini = inverted;
    }
</script>

<sl-tooltip
    content={$Settings.PlayerIsMini ? "Show waveform" : "Hide waveform"}
>
    <sl-button onclick={handlePlayerMiniToggle} variant="text">
        <MaterialSymbol
            name={$Settings.PlayerIsMini ? "unfold_more" : "unfold_less"}
        />
    </sl-button>
</sl-tooltip>

<style>
    sl-button {
        z-index: 1000;
    }
</style>
