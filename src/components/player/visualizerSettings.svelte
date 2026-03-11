<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { IsPlaying, ShowVisualizer } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import { keys } from "lodash-es";
    import { MediaPlayer } from "~/stores/elements.js";

    let menuIsVisible = false;
    let bindSelector = $state();
    let presets = $state({});
    let presetsArray = $derived(Object.entries(presets));
    let presetKeys = $derived(keys(presets));
    let currentPresetIndex = 0;
    let isRandomizeEnabled = false;
    let presetsLoading = false;
    let isCycleEnabled = $state(false);
    let cycleInterval = $state(10);
    let transitionDuration = $state(3);
    let cycleTimer = $state();

    function cycleHandler() {
        if ($IsPlaying) {
            handleNextPreset();
        }
    }

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function handlePresetChange(e) {
        if (presetKeys.length === 0) return;
        currentPresetIndex = e.target.value;
        $MediaPlayer?.loadVisualizerPreset(
            presets[presetKeys[currentPresetIndex]],
            Number(transitionDuration) || 3,
        );
        updateSelect();
    }

    function getRandomPresetIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * presetsArray.length);
        } while (newIndex === currentPresetIndex);
        return newIndex;
    }

    function handlePreviousPreset() {
        if (presetsArray.length === 0) return;
        currentPresetIndex = isRandomizeEnabled
            ? getRandomPresetIndex()
            : (currentPresetIndex - 1 + presetsArray.length) %
              presetsArray.length;
        $MediaPlayer?.loadVisualizerPreset(
            presets[presetKeys[currentPresetIndex]],
            Number(transitionDuration) || 3,
        );
        if (bindSelector) bindSelector.value = currentPresetIndex;
        updateSelect();
    }

    function handleNextPreset() {
        if (presetsArray.length === 0) return;
        currentPresetIndex = isRandomizeEnabled
            ? getRandomPresetIndex()
            : (currentPresetIndex + 1) % presetsArray.length;
        $MediaPlayer?.loadVisualizerPreset(
            presets[presetKeys[currentPresetIndex]],
            Number(transitionDuration) || 3,
        );
        updateSelect();
    }

    function updateSelect() {
        if (bindSelector) bindSelector.value = currentPresetIndex.toString();
    }

    $effect(() => {
        if ($ShowVisualizer && presetKeys.length === 0 && !presetsLoading) {
            presetsLoading = true;
            import("~/logic/visualizer.js").then(
                ({ getCuratedVisualizerPresets }) => {
                    presets = getCuratedVisualizerPresets();
                },
            );
        }
    });

    function handleRandomizeChange(e) {
        isRandomizeEnabled = e.target.checked;
    }

    function hideVisualizer() {
        ShowVisualizer.set(false);
    }

    function handleCycleChange(e) {
        isCycleEnabled = e.target.checked;
    }

    function handleCycleIntervalChange(e) {
        cycleInterval = Number(e.target.value) || 10;
    }

    function handleTransitionDurationChange(e) {
        transitionDuration = Number(e.target.value) || 3;
    }

    // Watch for changes in the cycle checkbox and interval
    $effect(() => {
        if (isCycleEnabled) {
            clearInterval(cycleTimer);
            cycleTimer = setInterval(cycleHandler, cycleInterval * 1000);
        } else {
            clearInterval(cycleTimer);
        }
    });
</script>

{#if $ShowVisualizer}
    <sl-button class="close-button" onclick={hideVisualizer} variant="text">
        <MaterialSymbol name="close" />
    </sl-button>

    <sl-dropdown placement="left-end">
        <sl-button
            circle
            onclick={toggleMenu}
            variant="neutral"
            slot="trigger"
            title="Visualizer Settings"
            class="options-button"
        >
            <MaterialSymbol name="auto_awesome" />
        </sl-button>

        <sl-card>
            <div slot="header">
                {$_("text.visualizerSettings")}
            </div>

            <div class="presets">
                <sl-select
                    bind:this={bindSelector}
                    label="Preset"
                    onsl-change={(e) => handlePresetChange(e)}
                >
                    {#each presetsArray as [name, code], index}
                        <sl-option value={index}>{name}</sl-option>
                    {/each}
                </sl-select>

                <div class="nav">
                    <sl-button
                        size="small"
                        variant="neutral"
                        onclick={handlePreviousPreset}
                    >
                        <MaterialSymbol name="skip_previous" />
                        {$_("text.previous")}
                    </sl-button>
                    <sl-button
                        size="small"
                        variant="neutral"
                        onclick={handleNextPreset}
                    >
                        {$_("text.next")}
                        <MaterialSymbol name="skip_next" />
                    </sl-button>
                </div>
            </div>

            <sl-divider></sl-divider>

            <div class="settings">
                <sl-checkbox onsl-change={handleRandomizeChange}>
                    {$_("text.randomized")}
                </sl-checkbox>

                <sl-input
                    type="number"
                    min="1"
                    value={transitionDuration}
                    label={$_("text.visualizerTransitionInterval")}
                    onsl-input={handleTransitionDurationChange}
                ></sl-input>

                <sl-checkbox onsl-change={handleCycleChange}>
                    {$_("text.visualizerCycle")}
                </sl-checkbox>

                <sl-input
                    type="number"
                    min="1"
                    value={cycleInterval}
                    label={$_("text.visualizerCycleInterval")}
                    onsl-input={handleCycleIntervalChange}
                ></sl-input>
            </div>
        </sl-card>
    </sl-dropdown>
{/if}

<style>
    .close-button {
        position: fixed;
        right: 0;
        top: 0;
        transition: transform ease-in-out 0.5s;
        transform: translateX(0);
        inset-inline-end: var(--spacing-md);
        filter: drop-shadow(0 0 3px black);
    }

    .settings {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    :global(.queue-open) .close-button {
        transform: translateX(calc(-1 * var(--size-queue-width)));
    }

    :global(.queue-open) sl-dropdown {
        transform: translateX(calc(-1 * var(--size-queue-width)));
        inset-inline-end: var(--spacing-md);
    }

    .presets {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .nav {
        display: flex;
        gap: var(--spacing-md);
    }

    .nav sl-button {
        width: 100%;
    }

    .options-button::part(base) {
        font-size: 20px;
        box-shadow: var(--shadow-md);
    }

    sl-dropdown {
        position: absolute;
        inset-inline-end: 55px;
        inset-block-end: calc(100% + var(--spacing-md));
        z-index: 100;
        transform: translateX(0);
        transition: transform ease-in-out 0.5s;
    }

    .options-button :global(.icon) {
        position: relative;
        inset-block-start: 2px;
    }
</style>
