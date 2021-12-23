<script>
    import { ThemeIsLight } from "../stores/status";
    import { MediaPlayer } from "../stores/player";

    import SVGDarkMode from "../../public/images/dark_mode.svg";
    import SVGLightMode from "../../public/images/light_mode.svg";

    function toggleTheme() {
        let inverted = !$ThemeIsLight;
        localStorage.setItem('AmpleThemeIsLight', JSON.stringify(inverted));
        ThemeIsLight.set(inverted);

        // update waveform colors when theme is toggled
        $MediaPlayer.setWaveColors();
    }
</script>

<button
    class="icon-button theme-toggle"
    on:click={toggleTheme}
>
    {#if $ThemeIsLight}
        <SVGDarkMode />
    {:else}
        <SVGLightMode />
    {/if}
</button>

<style>
    .theme-toggle {
        margin-left: var(--spacing-lg);
        margin-right: var(--spacing-md);
    }
</style>