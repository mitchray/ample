<script>
    import { lchToRgb } from 'color-converters';

    import { ThemeIsLight } from '../stores/status';
    import { customColors } from "../stores/player";

    $: {
        if ($ThemeIsLight) {
            document.body.classList.add('theme-is-light');
        } else {
            document.body.classList.remove('theme-is-light');
        }
    }

    let theme;
    $: theme = $ThemeIsLight ? 'light' : 'dark';
</script>

{@html `<style>
:root {
    /* GLOBAL */
    --color-tint-900:  rgba(255, 255, 255, 0.9);
    --color-tint-800:  rgba(255, 255, 255, 0.8);
    --color-tint-700:  rgba(255, 255, 255, 0.7);
    --color-tint-600:  rgba(255, 255, 255, 0.6);
    --color-tint-500:  rgba(255, 255, 255, 0.5);
    --color-tint-400:  rgba(255, 255, 255, 0.4);
    --color-tint-300:  rgba(255, 255, 255, 0.3);
    --color-tint-200:  rgba(255, 255, 255, 0.2);
    --color-tint-100:  rgba(255, 255, 255, 0.1);
    --color-tint-50:   rgba(255, 255, 255, 0.05);
    --color-tint-25:   rgba(255, 255, 255, 0.025);

    --color-shade-900:  rgba(0, 0, 0, 0.9);
    --color-shade-800:  rgba(0, 0, 0, 0.8);
    --color-shade-700:  rgba(0, 0, 0, 0.7);
    --color-shade-600:  rgba(0, 0, 0, 0.6);
    --color-shade-500:  rgba(0, 0, 0, 0.5);
    --color-shade-400:  rgba(0, 0, 0, 0.4);
    --color-shade-300:  rgba(0, 0, 0, 0.3);
    --color-shade-200:  rgba(0, 0, 0, 0.2);
    --color-shade-100:  rgba(0, 0, 0, 0.1);
    --color-shade-50:   rgba(0, 0, 0, 0.05);
    --color-shade-25:   rgba(0, 0, 0, 0.025);
}
</style>`}

{#if $ThemeIsLight}
    {@html `<style>
:root {
    --color-interface-00: rgb(${lchToRgb([95, 3, 243])});
    --color-interface-05: rgb(${lchToRgb([97, 3, 243])});
    --color-interface-10: rgb(${lchToRgb([100, 3, 243])});
    --color-interface-20: rgb(${lchToRgb([100, 3, 243])});
    --color-interface-30: rgb(${lchToRgb([100, 3, 243])});
    --color-interface-alpha: rgba(${lchToRgb([95, 3, 243])}, 0.8);

    --color-regular-foreground:       rgb(${lchToRgb([30,  0, 0])});
    --color-regular-foreground-hover: rgb(${lchToRgb([100, 0, 0])});
    --color-regular-background:       rgb(${lchToRgb([60,  0, 0])});

    --color-danger-foreground:       rgb(${lchToRgb([40,  40, 35])});
    --color-danger-foreground-hover: rgb(${lchToRgb([100, 0,  35])});
    --color-danger-background:       rgb(${lchToRgb([60,  60, 35])});

    --color-warning-foreground:       rgb(${lchToRgb([45,  50, 60])});
    --color-warning-foreground-hover: rgb(${lchToRgb([100, 0,  60])});
    --color-warning-background:       rgb(${lchToRgb([60,  60, 70])});

    --color-primary-foreground:       rgb(${lchToRgb([50,  40, 140])});
    --color-primary-foreground-hover: rgb(${lchToRgb([100, 0,  140])});
    --color-primary-background:       rgb(${lchToRgb([60,  40, 140])});

    --color-secondary-foreground:       rgb(${lchToRgb([50,  40, 220])});
    --color-secondary-foreground-hover: rgb(${lchToRgb([100, 0,  220])});
    --color-secondary-background:       rgb(${lchToRgb([60,  40, 220])});

    --shadow-inner: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
    --shadow-sm:  rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    --shadow-md:  rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,   rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    --shadow-lg:  rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    --shadow-xl:  rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    --shadow-xxl: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;

    --shadow-inset-md:  rgba(0, 0, 0, 0.1) 0px 4px 6px -1px inset,   rgba(0, 0, 0, 0.06) 0px 2px 4px -1px inset;

    /*  OLD  */

    --color-interface: rgba(${lchToRgb([95, 3, 243])}, 0.8);
    --color-highlight: rgb(${lchToRgb([57,49,257])});

    --color-text-body:       var(--color-shade-700);
    --color-text-heading:    var(--color-shade-800);
    --color-text-subheading: var(--color-shade-700);

    --color-link-primary:    var(--color-shade-800);
    --color-link-hover:      var(--color-shade-900);
    --color-link-active:     var(--color-shade-800);
    --color-link-secondary:  var(--color-text-body);

    --color-button-bg-primary: var(--color-shade-50);
    --color-button-text-primary: var(--color-link-secondary);
    --color-button-bg-hover:   var(--color-shade-100);
    --color-button-text-hover:   var(--color-link-hover);

    --color-card-background: var(--color-interface-20);

    --color-lines:           var(--color-shade-100);
    --color-border:          var(--color-shade-200);

    --color-waveform-progress: var(--color-text-subheading);
    --color-waveform-wave:     var(--color-border);
}
</style>`}
{:else}
    {@html `<style>
:root {
    --color-interface-00: rgb(${lchToRgb([3, 3, 243])});
    --color-interface-05: rgb(${lchToRgb([6, 3, 243])});
    --color-interface-10: rgb(${lchToRgb([10, 3, 243])});
    --color-interface-20: rgb(${lchToRgb([15, 3, 243])});
    --color-interface-30: rgb(${lchToRgb([20, 3, 243])});
    --color-interface-alpha: rgba(${lchToRgb([12, 3, 243])}, 0.7);

    --color-regular-foreground:       rgb(${lchToRgb([70,  0, 0])});
    --color-regular-foreground-hover: rgb(${lchToRgb([100, 0, 0])});
    --color-regular-background:       rgb(${lchToRgb([30,  0, 0])});

    --color-danger-foreground:       rgb(${lchToRgb([70,  30, 35])});
    --color-danger-foreground-hover: rgb(${lchToRgb([100, 0,  35])});
    --color-danger-background:       rgb(${lchToRgb([30,  60, 35])});

    --color-warning-foreground:       rgb(${lchToRgb([70,  40, 60])});
    --color-warning-foreground-hover: rgb(${lchToRgb([100, 0,  60])});
    --color-warning-background:       rgb(${lchToRgb([35,  60, 70])});

    --color-primary-foreground:       rgb(${lchToRgb([70,  30, 140])});
    --color-primary-foreground-hover: rgb(${lchToRgb([100, 0,  140])});
    --color-primary-background:       rgb(${lchToRgb([40,  40, 140])});

    --color-secondary-foreground:       rgb(${lchToRgb([70,  30, 220])});
    --color-secondary-foreground-hover: rgb(${lchToRgb([100, 0,  220])});
    --color-secondary-background:       rgb(${lchToRgb([40,  40, 220])});

    --shadow-inner: rgba(0, 0, 0, 0.24) 0px 2px 4px 0px inset;
    --shadow-sm:  rgba(0, 0, 0, 0.4) 0px 1px 3px 0px,    rgba(0, 0, 0, 0.24) 0px 1px 2px 0px;
    --shadow-md:  rgba(0, 0, 0, 0.4) 0px 4px 6px -1px,   rgba(0, 0, 0, 0.24) 0px 2px 4px -1px;
    --shadow-lg:  rgba(0, 0, 0, 0.4) 0px 10px 15px -3px, rgba(0, 0, 0, 0.20) 0px 4px 6px -2px;
    --shadow-xl:  rgba(0, 0, 0, 0.4) 0px 20px 25px -5px, rgba(0, 0, 0, 0.16) 0px 10px 10px -5px;
    --shadow-xxl: rgba(0, 0, 0, 0.4) 0px 20px 25px -5px, rgba(0, 0, 0, 0.16) 0px 10px 10px -5px;

    --shadow-inset-md: rgba(0, 0, 0, 0.4) 0px 4px 6px -1px inset, rgba(0, 0, 0, 0.24) 0px 2px 4px -1px inset;

    /*  OLD  */

    --color-interface: rgba(${lchToRgb([12, 3, 243])}, 0.7);
    --color-highlight: rgb(${lchToRgb([73,84,68])});

    --color-text-body:       var(--color-tint-700);
    --color-text-heading:    var(--color-tint-900);
    --color-text-subheading: var(--color-tint-800);

    --color-link-primary:    var(--color-tint-900);
    --color-link-hover:      var(--color-tint-800);
    --color-link-active:     var(--color-tint-900);
    --color-link-secondary:  var(--color-text-body);

    --color-button-bg-primary: var(--color-tint-100);
    --color-button-text-primary: var(--color-link-secondary);
    --color-button-bg-hover:   var(--color-tint-200);
    --color-button-text-hover:   var(--color-link-hover);

    --color-card-background: var(--color-tint-50);

    --color-lines:           var(--color-tint-200);
    --color-border:          var(--color-tint-200);

    --color-waveform-progress: var(--color-text-subheading);
    --color-waveform-wave:     var(--color-lines);
}
</style>`}
{/if}

{#if $customColors}
    {@html `<style>
:root body.useCustomColors {
    background-color: rgb(${$customColors[theme].background});
}

:root body.useCustomColors {
    --color-tint-900:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 1 : 0.9});
    --color-tint-800:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.95 : 0.8});
    --color-tint-700:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.9 : 0.7});
    --color-tint-600:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.85 : 0.6});
    --color-tint-500:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.8 : 0.5});
    --color-tint-400:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.7 : 0.4});
    --color-tint-300:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.6 : 0.3});
    --color-tint-200:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.5 : 0.2});
    --color-tint-100:  rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.4 : 0.1});
    --color-tint-50:   rgba(${$customColors[theme].nearWhite}, ${$ThemeIsLight ? 0.3 : 0.05});

    --color-highlight: rgba(${$customColors[theme].highlight}, 1);

    --color-text-heading:    rgba(${$customColors[theme].highlight}, 1);

    --color-link-primary:    rgba(${$customColors[theme].foreground}, 0.8);
    --color-link-hover:      rgba(${$customColors[theme].foreground}, 0.9);
    --color-link-secondary:  var(--color-text-body);

    --color-button-bg-primary: var(--color-tint-50);
    --color-button-text-primary: var(--color-link-secondary);
    --color-button-bg-hover:   var(--color-tint-100);
    --color-button-text-hover:   var(--color-link-hover);

    --color-lines:           rgba(${$customColors[theme].foreground}, 0.2);
    --color-border:          rgba(${$customColors[theme].foreground}, 0.2);

    --color-waveform-progress: var(--color-text-subheading);
    --color-waveform-wave:     var(--color-lines);
}
</style>`}
{/if}