<script>
    import { tick } from "svelte";
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ShowVisualizer } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";

    let text = $derived($ShowVisualizer
        ? $_("text.visualizerHide")
        : $_("text.visualizerShow"));

    async function handleToggle() {
        let inverted = !$ShowVisualizer;
        ShowVisualizer.set(inverted);
        await tick();
        $MediaPlayer?.setWaveColors();
    }
</script>

    <MaterialSymbol name="auto_awesome" slot="prefix" />
<sl-menu-item title={text} onclick={handleToggle}>
    {text}
</sl-menu-item>
