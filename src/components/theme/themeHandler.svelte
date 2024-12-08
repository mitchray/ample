<script>
    import { Settings } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { capitalize } from "lodash-es";
    import { derived } from "svelte/store";

    let themeMode = $derived(capitalize($Settings.Theme.mode) || null);

    function handleChange() {
        // update waveform colors when theme is toggled
        $MediaPlayer?.setWaveColors();
    }

    $effect(() => {
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

    $effect(() => {
        $Settings.Theme, handleChange();
    });
</script>

{@html `<style>
:root {
    --user-hue-background: ${$Settings.Theme[themeMode]?.hueBackground};
    --user-hue-accent-1: ${$Settings.Theme[themeMode]?.hue1};
    --user-hue-accent-2: ${$Settings.Theme[themeMode]?.hue2};
    --user-color-waveform: ${$Settings.Theme[themeMode]?.colorWave};
}
</style>`}

{#if $Settings.Theme[themeMode]?.isGray}
    {@html `<style>
:root {
    --chroma-override: 0.008;
    --user-hue-background: 240;
}
</style>`}
{/if}
