<script>
    import { onMount } from 'svelte';
    import { lchToRgb } from 'color-converters';

    import { Theme } from '../stores/status';
    import { customHue } from "../stores/status";

    function removeClassByPrefix(node, prefix) {
        const regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
        node.className = node.className.replace(regx, '');
        return node;
    }

    let hue;
    let defaultHue = 240;

    $: hue = $customHue ? $customHue : defaultHue;

    onMount(() => {
        if (!$Theme) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                Theme.set('dark');
            } else {
                Theme.set('light');
            }
        }
    });
</script>

{#if $Theme === 'light'}
    {@html `<style>
:root {
    --color-background:        rgb(${lchToRgb([ 95,  8, hue])});
    --color-interface:         rgb(${lchToRgb([ 98,  3, hue])});
    --color-border:            rgb(${lchToRgb([ 80, 10, hue])});
    --color-input-border:      rgb(${lchToRgb([ 70, 10, hue])});
    --color-active-background: rgb(${lchToRgb([ 90, 15, hue])});
    --color-text-primary:      rgb(${lchToRgb([ 15, 50, hue])});
    --color-text-secondary:    rgb(${lchToRgb([ 60, 25, hue])});
    --color-text-heading:      rgb(${lchToRgb([ 30, 70, hue])});
    --color-icon:              rgb(${lchToRgb([ 50, 50, hue])});
    --color-highlight:         rgb(${lchToRgb([ 50, 60, hue])});
    --color-link-hover:        rgb(${lchToRgb([ 25, 70, hue])});
    --color-card-primary:      rgb(${lchToRgb([100,  0, hue])});
    --color-card-hover:        rgb(${lchToRgb([100,  0, hue])});
    --color-card-highlight:    rgb(${lchToRgb([ 96,  6, hue])});
    --color-menu-background:   rgb(${lchToRgb([100,  0, hue])});
    --color-menu-border:       rgb(${lchToRgb([ 90,  5, hue])});
    --color-genre-background: rgba(${lchToRgb([ 98,  3, hue])}, 0.75);
    --color-genre-text:        rgb(${lchToRgb([ 15, 50, hue])});
    --color-genre-border:      rgb(${lchToRgb([ 80, 10, hue])});
    --color-separator:         rgb(${lchToRgb([ 85, 10, hue])});
    --color-row-hover:         rgb(${lchToRgb([100,  0, hue])});
    --color-row-stripe:        rgb(${lchToRgb([ 98,  5, hue])});
    --color-column-sticky:    rgba(${lchToRgb([ 80, 20, hue])}, 0.1);
    --color-waveform-progress: rgb(${lchToRgb([ 15, 50, hue])});
    --color-waveform-wave:     rgb(${lchToRgb([ 75, 20, hue])});
    --color-rating:            rgb(${lchToRgb([ 60, 66, 74])});
    --color-favorite:          rgb(${lchToRgb([ 40, 77, 37])});
    --color-regular-foreground:         rgb(${lchToRgb([ 15, 50, hue])});
    --color-regular-foreground-hover:   rgb(${lchToRgb([100,  0, hue])});
    --color-regular-background:         rgb(${lchToRgb([ 15, 50, hue])});
    --color-danger-foreground:          rgb(${lchToRgb([ 40, 50,  25])});
    --color-danger-foreground-hover:    rgb(${lchToRgb([100,  0,  25])});
    --color-danger-background:          rgb(${lchToRgb([ 50, 50,  25])});
    --color-warning-foreground:         rgb(${lchToRgb([ 40, 50,  60])});
    --color-warning-foreground-hover:   rgb(${lchToRgb([100,  0,  60])});
    --color-warning-background:         rgb(${lchToRgb([ 60, 50,  50])});
    --color-primary-foreground:         rgb(${lchToRgb([ 50, 40, 140])});
    --color-primary-foreground-hover:   rgb(${lchToRgb([100,  0, 140])});
    --color-primary-background:         rgb(${lchToRgb([ 60, 40, 140])});
    --color-secondary-foreground:       rgb(${lchToRgb([ 50, 40, 220])});
    --color-secondary-foreground-hover: rgb(${lchToRgb([100,  0, 220])});
    --color-secondary-background:       rgb(${lchToRgb([ 60, 40, 220])});
}
</style>`}
{/if}

{#if $Theme === 'dark'}
    {@html `<style>
:root {
    --color-background:        rgb(${lchToRgb([  4,  2, hue])});
    --color-interface:         rgb(${lchToRgb([  9,  3, hue])});
    --color-border:            rgb(${lchToRgb([ 20, 10, hue])});
    --color-input-border:      rgb(${lchToRgb([ 30, 10, hue])});
    --color-active-background: rgb(${lchToRgb([ 25, 15, hue])});
    --color-text-primary:      rgb(${lchToRgb([ 90, 10, hue])});
    --color-text-secondary:    rgb(${lchToRgb([ 60, 10, hue])});
    --color-text-heading:      rgb(${lchToRgb([ 75, 50, hue])});
    --color-icon:              rgb(${lchToRgb([ 70, 40, hue])});
    --color-highlight:         rgb(${lchToRgb([ 70, 70, hue])});
    --color-link-hover:        rgb(${lchToRgb([ 75, 70, hue])});
    --color-card-primary:      rgb(${lchToRgb([ 15,  5, hue])});
    --color-card-hover:        rgb(${lchToRgb([ 20,  5, hue])});
    --color-card-highlight:    rgb(${lchToRgb([ 10,  5, hue])});
    --color-menu-background:   rgb(${lchToRgb([ 15,  5, hue])});
    --color-menu-border:       rgb(${lchToRgb([ 20, 10, hue])});
    --color-genre-background: rgba(${lchToRgb([  9,  3, hue])}, 0.75);
    --color-genre-text:        rgb(${lchToRgb([ 90, 10, hue])});
    --color-genre-border:      rgb(${lchToRgb([ 30, 10, hue])});
    --color-separator:         rgb(${lchToRgb([ 15, 10, hue])});
    --color-row-hover:         rgb(${lchToRgb([ 15,  5, hue])});
    --color-row-stripe:        rgb(${lchToRgb([ 12,  5, hue])});
    --color-column-sticky:    rgba(${lchToRgb([100,  0, hue])}, 0.02);
    --color-waveform-progress: rgb(${lchToRgb([ 80, 10, hue])});
    --color-waveform-wave:     rgb(${lchToRgb([ 25, 10, hue])});
    --color-rating:            rgb(${lchToRgb([ 80, 100, 85])});
    --color-favorite:          rgb(${lchToRgb([ 55, 80, 37])});
    --color-regular-foreground:         rgb(${lchToRgb([ 90, 20, hue])});
    --color-regular-foreground-hover:   rgb(${lchToRgb([100,  0, hue])});
    --color-regular-background:         rgb(${lchToRgb([ 40, 10, hue])});
    --color-danger-foreground:          rgb(${lchToRgb([ 60, 60,  25])});
    --color-danger-foreground-hover:    rgb(${lchToRgb([100,  0,  25])});
    --color-danger-background:          rgb(${lchToRgb([ 40, 50,  25])});
    --color-warning-foreground:         rgb(${lchToRgb([ 60, 60,  60])});
    --color-warning-foreground-hover:   rgb(${lchToRgb([100,  0,  60])});
    --color-warning-background:         rgb(${lchToRgb([ 50, 60,  60])});
    --color-primary-foreground:         rgb(${lchToRgb([ 70, 60, 140])});
    --color-primary-foreground-hover:   rgb(${lchToRgb([100,  0, 140])});
    --color-primary-background:         rgb(${lchToRgb([ 50, 40, 140])});
    --color-secondary-foreground:       rgb(${lchToRgb([ 70, 50, 220])});
    --color-secondary-foreground-hover: rgb(${lchToRgb([100,  0, 220])});
    --color-secondary-background:       rgb(${lchToRgb([ 50, 40, 220])});
}
</style>`}
{/if}