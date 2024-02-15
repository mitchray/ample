<script>
    import { Saved, Theme } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";

    $: $Theme, handleChange();

    $: {
        if (!$Theme.mode) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                $Theme.mode = "dark";
            } else {
                $Theme.mode = "light";
            }

            $Theme = $Theme;
        }

        if ($Theme.mode === "dark") {
            document.documentElement.classList.add("sl-theme-dark");
            document.documentElement.classList.remove("sl-theme-light");
        } else {
            document.documentElement.classList.remove("sl-theme-dark");
            document.documentElement.classList.add("sl-theme-light");
        }
    }

    function handleChange() {
        // $Saved won't be available until we're logged in
        $Saved?.setItem("Theme", { ...$Theme });

        // update waveform colors when theme is toggled
        $MediaPlayer?.setWaveColors();
    }
</script>

{@html `<style>
:root {
    --user-hue-background: ${$Theme.hueBackground};
    --user-hue-accent-1: ${$Theme.hue1};
    --user-hue-accent-2: ${$Theme.hue2};
    --user-color-waveform: ${$Theme.colorWave};
}
</style>`}

{#if $Theme.isGray}
    {@html `<style>
:root {
    --chroma-override: 0.008;
    --user-hue-background: 240;
}
</style>`}
{/if}
