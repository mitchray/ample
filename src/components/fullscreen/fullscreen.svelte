<script>
    import { fade } from 'svelte/transition';
    import { FullScreenEnabled, CurrentMedia, Theme } from "../../stores/status";
    import { getAverageColor, findCustomHue, outputThemeVariables } from "../../logic/color";

    import FullScreenNowPlaying from './fullscreen_nowPlaying.svelte';

    import SVGDown from "/src/images/keyboard_arrow_down.svg";

    let hue;
    let defaultHue = 240;
    let currentTab = "nowPlaying";

    $: hue = hue || defaultHue;

    $: {
        if ($CurrentMedia) {
            getAverageColor($CurrentMedia.art + "&thumb=10")
                .then(data => {
                    findCustomHue(data.value).then(d => {
                        hue = d;
                    });
                });
        }
    }
</script>

{#if $FullScreenEnabled}
    <div class="fullscreen" transition:fade>
        <div class="inner">
            <div class="nowPlaying" style="display: {currentTab === 'nowPlaying' ? 'block' : 'none'}">
                <FullScreenNowPlaying/>
            </div>

            <div class="queue" style="display: {currentTab === 'queue' ? 'block' : 'none'}">
            <!--<Queue/>-->
            </div>
        </div>

        <button class="close icon-button"
            on:click={() => $FullScreenEnabled = false}
        >
            <SVGDown style="transform: scale(1.25)" />
        </button>
    </div>
{/if}

{#key $Theme+hue}
    {@html outputThemeVariables(hue, ".fullscreen")}
{/key}

<style>
    .fullscreen {
        background-color: var(--color-background);
        color: var(--color-text-primary); /* needs redeclaring */
        display: grid;
        grid-template-areas:
            "tabs"
            "inner"
            "close"
        ;
        grid-template-columns: 1fr;
        grid-template-rows: min-content 1fr min-content;
        gap: var(--spacing-lg);
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        height: 100%;
        width: 100%;
        z-index: 1000;
    }

    .tabs {
        grid-area: tabs;
    }

    .inner {
        grid-area: inner;
    }

    .inner > :global(*) {
        height: 100%;
    }

    .close {
        grid-area: close;
        display: flex;
        justify-self: center;
        margin-block-end: var(--spacing-md);
    }
</style>