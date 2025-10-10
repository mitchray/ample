<script>
    import "nouislider/dist/nouislider.css";
    import noUiSlider from "nouislider";
    import { _ } from "@rgglez/svelte-i18n";
    import { onMount } from "svelte";

    const currentYear = new Date().getFullYear();

    let {
        fromYear = $bindable(currentYear),
        toYear = $bindable(currentYear),
        showYear = currentYear,
    } = $props();

    let yearSlider = $state();
    let fromInterim = $state(showYear || currentYear - 10);
    let toInterim = $state(showYear || currentYear);

    const commit = () => {
        fromYear = fromInterim;
        toYear = toInterim;
    };

    function formatYear(val) {
        return parseInt(val);
    }

    onMount(() => {
        noUiSlider.create(yearSlider, {
            start: [fromInterim, toInterim],
            range: {
                min: 1500,
                "20%": [currentYear - 100, 1],
                max: currentYear,
            },
            behaviour: "drag",
            connect: true,
            pips: {
                mode: "values",
                values: [
                    1500,
                    currentYear - 100,
                    currentYear - 80,
                    currentYear - 60,
                    currentYear - 40,
                    currentYear - 20,
                    currentYear,
                ],
                density: 4,
            },
            format: {
                to: (value) => formatYear(value),
                from: (value) => formatYear(value),
            },
            tooltips: [
                {
                    to: (value) => formatYear(value),
                },
                {
                    to: (value) => formatYear(value),
                },
            ],
        });

        yearSlider.noUiSlider.on("update", (values, handle) => {
            fromInterim = values[0];
            toInterim = values[1];
        });
    });
</script>

<div class="container">
    <div class="slider" bind:this={yearSlider}></div>

    <sl-button class="submit" onclick={commit} variant="primary">
        {$_("text.search")}
        {fromInterim} &ndash; {toInterim}
    </sl-button>
</div>

<style>
    .container {
        padding: var(--spacing-xl);
        background-color: var(--color-surface-container);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xxxl);
        margin-block-end: var(--spacing-lg);
    }

    .slider {
        margin-block-start: var(--spacing-lg);
        margin-block-end: var(--spacing-lg);
        line-height: 2;
    }

    sl-button {
        align-self: start;
    }
</style>
