<script>
    import { Settings } from "~/stores/settings.svelte.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { capitalize } from "lodash-es";

    let systemPrefersDark = $state(
        window.matchMedia("(prefers-color-scheme: dark)").matches,
    );

    $effect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e) => {
            systemPrefersDark = e.matches;
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    });

    let effectiveMode = $derived(
        Settings.current.Theme.mode === "system"
            ? systemPrefersDark
                ? "dark"
                : "light"
            : Settings.current.Theme.mode,
    );

    let themeMode = $derived(capitalize(effectiveMode) || null);

    function handleChange() {
        $MediaPlayer?.setWaveColors();
    }

    $effect(() => {
        if (effectiveMode === "dark") {
            document.documentElement.style.colorScheme = "dark";
            document.documentElement.classList.add("sl-theme-dark");
        } else {
            document.documentElement.style.colorScheme = "light";
            document.documentElement.classList.remove("sl-theme-dark");
        }
    });

    $effect(() => {
        (Settings.current.Theme, handleChange());
    });
</script>

{@html `<style>
:root {
    --user-hue-background: ${Settings.current.Theme[themeMode]?.hueBackground};
    --user-hue-accent-1: ${Settings.current.Theme[themeMode]?.hue1};
    --user-hue-accent-2: ${Settings.current.Theme[themeMode]?.hue2};
    --user-color-waveform: ${Settings.current.Theme[themeMode]?.colorWave};
}
</style>`}

{#if Settings.current.Theme[themeMode]?.isGray}
    {@html `<style>
:root {
    --chroma-override: 0.008;
    --user-hue-background: 240;
}
</style>`}
{/if}
