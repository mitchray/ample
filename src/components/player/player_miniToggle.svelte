<script>
    import { Settings } from "~/stores/settings.svelte.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function handlePlayerMiniToggle() {
        let inverted = !Settings.current.PlayerIsMini;
        Settings.current.PlayerIsMini = inverted;
    }
</script>

<sl-tooltip
    content={Settings.current.PlayerIsMini ? "Show waveform" : "Hide waveform"}
>
    <sl-button onclick={handlePlayerMiniToggle} variant="text">
        <MaterialSymbol
            name={Settings.current.PlayerIsMini ? "unfold_more" : "unfold_less"}
        />
    </sl-button>
</sl-tooltip>

<style>
    sl-button {
        z-index: 1000;
    }
</style>
