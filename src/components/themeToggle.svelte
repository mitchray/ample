<script>
    import { Theme } from "../stores/status";
    import { MediaPlayer } from "../stores/player";

    import SVGDarkMode from "../../public/images/dark_mode.svg";
    import SVGLightMode from "../../public/images/light_mode.svg";

    function toggleTheme() {
        let theme;
        if ($Theme === 'dark') {
            theme = 'light';
            document.body.classList.add('theme-is-light');
        } else {
            theme = 'dark';
            document.body.classList.remove('theme-is-light');
        }

        localStorage.setItem('AmpleTheme', JSON.stringify(theme));
        Theme.set(theme);

        // update waveform colors when theme is toggled
        $MediaPlayer.setWaveColors();
    }
</script>

<button
    class="icon-button theme-toggle"
    on:click={toggleTheme}
>
    {#if $Theme === 'dark'}
        <SVGLightMode />
    {:else}
        <SVGDarkMode />
    {/if}
</button>

<style>
    .theme-toggle {
        margin-left: var(--spacing-lg);
        margin-right: var(--spacing-md);
    }
</style>