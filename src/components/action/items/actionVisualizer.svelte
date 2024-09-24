<script>
    import { tick } from "svelte";
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { ShowVisualizer } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";

    $: text = $ShowVisualizer
        ? $_("text.visualizerHide")
        : $_("text.visualizerShow");

    async function handleToggle() {
        let inverted = !$ShowVisualizer;
        ShowVisualizer.set(inverted);
        await tick();
        $MediaPlayer?.setWaveColors();
    }
</script>

<sl-menu-item title={text} on:click={handleToggle}>
    <MaterialSymbol name="auto_awesome" slot="prefix" />
    {text}
</sl-menu-item>
