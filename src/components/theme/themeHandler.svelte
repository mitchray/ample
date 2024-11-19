<script>
    import { run } from "svelte/legacy";

    import { Settings } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";

    function handleChange() {
        // update waveform colors when theme is toggled
        $MediaPlayer?.setWaveColors();
    }
    run(() => {
        if (!$Settings.Theme.mode) {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                $Settings.Theme.mode = "dark";
            } else {
                $Settings.Theme.mode = "light";
            }
        }

        if ($Settings.Theme.mode === "dark") {
            document.documentElement.classList.add("sl-theme-dark");
            document.documentElement.classList.remove("sl-theme-light");
        } else {
            document.documentElement.classList.remove("sl-theme-dark");
            document.documentElement.classList.add("sl-theme-light");
        }
    });
    run(() => {
        $Settings.Theme, handleChange();
    });
</script>

{@html `<style>
:root {
    --user-hue-background: ${$Settings.Theme.hueBackground};
    --user-hue-accent-1: ${$Settings.Theme.hue1};
    --user-hue-accent-2: ${$Settings.Theme.hue2};
    --user-color-waveform: ${$Settings.Theme.colorWave};
}
</style>`}

{#if $Settings.Theme.isGray}
    {@html `<style>
:root {
    --chroma-override: 0.008;
    --user-hue-background: 240;
}
</style>`}
{/if}
