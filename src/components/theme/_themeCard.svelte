<script>
    import { getContext } from "svelte";
    import { Settings } from "~/stores/settings.js";
    import { capitalize } from "lodash-es";

    let { mode, contextKey } = $props();

    const { getIsGray, getColors } = getContext(contextKey);

    let colors = getColors();
</script>

<div
    class="container c-theme-card sl-theme-{mode}"
    data-uid={contextKey}
    onclick={() => {
        $Settings.Theme.mode = mode;
        $Settings.Theme[capitalize(mode)] = {
            colorWave: colors.colorWave,
            hue1: colors.hue1,
            hue2: colors.hue2,
            hueBackground: colors.hueBackground,
            isGray: getIsGray(),
        };
    }}
    style={getIsGray() ? "--preview-chroma-override: 0" : false}
>
    <div class="header">
        <sl-skeleton
            style="width: 5px; --color: var(--preview-color-1)"
        ></sl-skeleton>
        <sl-skeleton style="width: 20%"></sl-skeleton>
        <sl-skeleton
            style="width: 5px; --color: var(--preview-color-1)"
        ></sl-skeleton>
    </div>

    <div class="inner">
        <div class="sidebar">
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
            <sl-skeleton style="--color: var(--preview-color-2)"></sl-skeleton>
        </div>

        <div class="content">
            <sl-skeleton
                style="width: 20%; --color: var(--preview-color-2)"
            ></sl-skeleton>
            <sl-skeleton></sl-skeleton>
            <span>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
            </span>
            <sl-skeleton style="--color: transparent;"></sl-skeleton>
            <sl-skeleton
                style="width: 20%; --color: var(--preview-color-2)"
            ></sl-skeleton>
            <sl-skeleton></sl-skeleton>
            <span>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
                <sl-skeleton
                    style="width: 10%; --color: var(--preview-color-1)"
                ></sl-skeleton>
            </span>
        </div>
    </div>

    <span class="player">
        <div class="waveform">
            <sl-skeleton
                style="--color: var(--preview-color-waveform)"
            ></sl-skeleton>
        </div>

        <div class="controls">
            <sl-skeleton
                style="width: 10px; --color: var(--preview-color-1)"
            ></sl-skeleton>
            <sl-skeleton
                style="width: 13px; --color: var(--preview-color-1)"
            ></sl-skeleton>
            <sl-skeleton
                style="width: 10px; --color: var(--preview-color-1)"
            ></sl-skeleton>
        </div>
    </span>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        background-color: var(--preview-color-interface);
        aspect-ratio: 16 / 9;
        width: 50%;
        border: 2px solid var(--color-outline-variant);
        padding: 5px;
        cursor: pointer;
        flex-shrink: 0;
    }

    .container div {
        display: flex;
        gap: 5px;
        padding: 2px;
    }

    span {
        display: flex;
        gap: 2px;
    }

    sl-skeleton {
        --color: var(--preview-color-text);
        --border-radius: 0;
        height: 3px;
        overflow: hidden;
    }

    .inner {
        gap: 0;
        /*background-color: green;*/
        flex: 1;
        padding: 0 !important;
    }

    .header {
        /*background-color: red;*/
        justify-content: space-between;
        padding: 4px !important;
    }

    .content {
        background-color: var(--preview-color-background);
        flex: 1;
        border-radius: 5px;
        flex-direction: column;
        padding: 4px !important;
    }

    .sidebar {
        width: 15%;
        flex-direction: column;
    }

    .player {
        /*background-color: blue;*/
        flex-direction: column;
    }

    .waveform {
        flex-direction: column;
    }

    .controls {
        justify-content: center;
    }
</style>
