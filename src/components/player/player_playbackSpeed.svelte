<script>
    import "nouislider/dist/nouislider.css";
    import noUiSlider from "nouislider";
    import { onMount } from "svelte";
    import { PlaybackSpeed } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let speedSlider;

    onMount(() => {
        noUiSlider.create(speedSlider, {
            start: [1],
            orientation: "vertical",
            range: {
                min: [0.2, 0.1],
                "35%": [1, 0.1],
                "80%": [2, 0.25],
                max: [3],
            },
            pips: {
                mode: "steps",
                density: 10,
                format: {
                    to: function (value) {
                        return value + "×";
                    },
                },
                filter: (value, type) => {
                    const highlight = [0.2, 1, 2, 3];
                    return highlight.includes(value) ? 1 : 0;
                },
            },
        });

        speedSlider.noUiSlider.on("update", (values, handle) => {
            $PlaybackSpeed = values[handle];
        });
    });
</script>

<sl-menu-item>
    Playback speed
    <MaterialSymbol name="speed" slot="prefix" />

    <sl-card slot="submenu" style="width: 100px;">
        <div
            class="slider"
            bind:this={speedSlider}
            style="height: 250px;"
        ></div>
        <sl-divider></sl-divider>
        {$PlaybackSpeed}×
    </sl-card>
</sl-menu-item>

<style>
    .slider:global(.noUi-target) {
        background-color: var(--color-outline-variant);
        border-color: transparent;
        box-shadow: none;
        border-radius: 3px;
    }

    .slider :global(.noUi-handle) {
        background-color: var(--color-primary);
        box-shadow: none;
        border-color: transparent;
    }

    .slider :global(.noUi-handle):before,
    .slider :global(.noUi-handle):after {
        background-color: var(--color-on-primary);
    }
</style>
