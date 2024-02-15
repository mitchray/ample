<script>
    import { v4 as uuidv4 } from "uuid";
    import ThemeCard from "~/components/theme/_themeCard.svelte";
    import { setContext } from "svelte";

    export let name;
    export let isGray;
    export let colors;

    let contextKey = uuidv4(); // unique key

    setContext(contextKey, {
        getIsGray: () => isGray,
        getColors: () => colors,
    });
</script>

{@html `<style>
    .sl-theme-dark.container[data-uid="${contextKey}"]  {
        --preview-color-waveform: ${colors.wave};
        --preview-color-1: oklch(var(--lightness-600) var(--chroma-600) ${colors.hue1});
        --preview-color-2: oklch(var(--lightness-600) var(--chroma-600) ${colors.hue2});
        --preview-color-background: oklch(
            var(--lightness-950)
                var(--preview-chroma-override, var(--chroma-950)) ${colors.hueBackground}
        );
        --preview-color-interface: oklch(
            var(--lightness-900)
                var(--preview-chroma-override, var(--chroma-950)) ${colors.hueBackground}
        );
        --preview-color-text: oklch(
            var(--lightness-700)
                var(--preview-chroma-override, var(--chroma-700)) ${colors.hueBackground}
        );
    }

    .sl-theme-light.container[data-uid="${contextKey}"] {
        /*--chroma-override: 0;*/
        --preview-color-waveform: ${colors.wave};
        --preview-color-1: oklch(var(--lightness-400) var(--chroma-400) ${colors.hue1});
        --preview-color-2: oklch(var(--lightness-400) var(--chroma-400) ${colors.hue2});
        --preview-color-background: oklch(
            var(--lightness-50) var(--preview-chroma-override, var(--chroma-50))
                ${colors.hueBackground}
        );
        --preview-color-interface: oklch(
            var(--lightness-200)
                var(--preview-chroma-override, var(--chroma-200)) ${colors.hueBackground}
        );
        --preview-color-text: oklch(
            var(--lightness-300)
                var(--preview-chroma-override, var(--chroma-300)) ${colors.hueBackground}
        );
    }
</style>`}

<div class="container">
    <ThemeCard mode="dark" {contextKey} />
    <ThemeCard mode="light" {contextKey} />
    <div class="name">{name}</div>
</div>

<style>
    .container {
        display: flex;
        flex-wrap: wrap;
    }

    .container :global(.c-theme-card):nth-child(odd) {
        z-index: 10;
    }

    .container :global(.c-theme-card):nth-child(even) {
        transform: translate(-5px, -20px);
    }

    .name {
        display: flex;
        justify-content: center;
        width: 100%;
        margin-block-start: var(--spacing-md);
    }
</style>
