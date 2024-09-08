<script>
    import { _ } from "svelte-i18n";
    import {
        DynamicsCompressorEnabled,
        PlayerVolume,
        Saved,
        VolumeNormalizationEnabled,
    } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import {
        CurrentMedia,
        debugMode,
        IsMuted,
        NowPlayingQueue,
    } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { onMount } from "svelte";

    let volumeWidth; // volume in this file is treated as a linear 0-100 value
    let mouseDown = false;
    let volumeSlider;
    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    async function handleMuteToggle() {
        let inverted = !$IsMuted;
        IsMuted.set(inverted);
        $MediaPlayer.setMuted(inverted);
    }

    function handleVolumeNormalize(e) {
        let setting = e.target.checked;
        $Saved.setItem("VolumeNormalizationEnabled", setting);
        VolumeNormalizationEnabled.set(setting);
        $MediaPlayer.updateFilters();
    }

    function handleDynamicsCompressor(e) {
        let setting = e.target.checked;
        $Saved.setItem("DynamicsCompressorEnabled", setting);
        DynamicsCompressorEnabled.set(setting);
        $MediaPlayer.updateFilters();
    }

    function handleVolumeSlider(event) {
        let volumeElementWidth = event.target.offsetWidth;
        let volumeClickLocation =
            event.clientX - event.target.getBoundingClientRect().left;
        let volumeFraction = volumeClickLocation / volumeElementWidth;
        volumeWidth = volumeFraction * 100;
        volumeWidth = volumeWidth > 100 ? 100 : volumeWidth;
        volumeWidth = volumeWidth < 0 ? 0 : volumeWidth;

        PlayerVolume.set(volumeWidth);
        $Saved.setItem("PlayerVolume", volumeWidth);
    }

    function handleVolumeMouseDown() {
        mouseDown = true;
        document.addEventListener("mouseup", handleVolumeMouseUp);
        volumeSlider?.classList.add("dragging");
    }

    function handleVolumeMouseUp() {
        mouseDown = false;
        document.removeEventListener("mouseup", handleVolumeMouseUp);
        volumeSlider?.classList.remove("dragging");
    }

    function handleVolumeDrag(event) {
        if (mouseDown) {
            requestAnimationFrame(function () {
                handleVolumeSlider(event);
            });
        }
    }

    function handleCompressorThreshold() {
        $MediaPlayer.filterCompressor.threshold.value = this.value;
    }

    function handleCompressorRatio() {
        $MediaPlayer.filterCompressor.ratio.value = this.value;
    }

    function handleCompressorKnee() {
        $MediaPlayer.filterCompressor.knee.value = this.value;
    }

    function handleCompressorAttack() {
        $MediaPlayer.filterCompressor.attack.value = this.value;
    }

    function handleCompressorRelease() {
        $MediaPlayer.filterCompressor.release.value = this.value;
    }

    onMount(async () => {
        volumeWidth = (await $Saved.getItem("PlayerVolume")) || 50;
    });
</script>

<sl-button
    class="volume-control"
    disabled={$NowPlayingQueue.length === 0}
    on:click={handleMuteToggle}
    title={$IsMuted ? $_("text.volumeUnmute") : $_("text.volumeMute")}
    variant="text"
>
    <MaterialSymbol name={$IsMuted ? "volume_off" : "volume_up"} />
</sl-button>

<div
    bind:this={volumeSlider}
    class="site-player__volume-slider volume-control"
    on:click={handleVolumeSlider}
    on:mousedown={handleVolumeMouseDown}
    on:mousemove={handleVolumeDrag}
>
    <span
        class="site-player__volume-value"
        data-value={Math.floor(volumeWidth)}
        style="width: {volumeWidth}%"
    ></span>
</div>

<sl-dropdown>
    <sl-button
        on:click={toggleMenu}
        slot="trigger"
        title={$_("text.volumeSettings")}
        variant="text"
    >
        <MaterialSymbol name="tune" />
    </sl-button>

    <sl-card>
        <div slot="header">
            {$_("text.volumeSettings")}
        </div>

        <sl-checkbox
            checked={$VolumeNormalizationEnabled}
            on:sl-change={handleVolumeNormalize}
        >
            {$_("text.volumeNormalize")}
        </sl-checkbox>

        <div class="secondary-info help-text">
            {$_("text.volumeNormalizeInfo")}
        </div>

        {#if $CurrentMedia}
            {#key $CurrentMedia}
                <div class="current">
                    <table>
                        <tr>
                            <td class="label">{$_("text.current")}</td>
                            <td>{$MediaPlayer.gainType}</td>
                        </tr>

                        <tr>
                            <td class="label">{$_("text.target")}</td>
                            <td>{$MediaPlayer.targetVolume}db</td>
                        </tr>

                        {#if $MediaPlayer.gainType !== "None"}
                            <tr>
                                <td class="label">{$_("text.mastered")}</td>
                                <td>{$MediaPlayer.masteredVolume}db</td>
                            </tr>

                            <tr>
                                <td class="label">{$_("text.gain")}</td>
                                <td>{$MediaPlayer.gainNeeded}db</td>
                            </tr>
                        {/if}
                    </table>
                </div>
            {/key}
        {/if}

        <sl-divider></sl-divider>

        <sl-checkbox
            checked={$DynamicsCompressorEnabled}
            on:sl-change={handleDynamicsCompressor}
        >
            {$_("text.volumeNightMode")}
        </sl-checkbox>

        <div class="secondary-info help-text">
            {$_("text.volumeNightModeInfo")}
        </div>

        {#if $debugMode && $MediaPlayer?.filterCompressor}
            <sl-divider></sl-divider>

            <div class="overrides">
                <label>
                    Threshold <span id="compressor_threshold_value">
                        {$MediaPlayer.filterCompressor.threshold.value}
                    </span>
                    <input
                        type="range"
                        min="-100"
                        max="0"
                        value={$MediaPlayer.filterCompressor.threshold.value}
                        on:input={handleCompressorThreshold}
                    />
                </label>

                <label>
                    Ratio <span id="compressor_ratio_value">
                        {$MediaPlayer.filterCompressor.ratio.value}
                    </span>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={$MediaPlayer.filterCompressor.ratio.value}
                        on:input={handleCompressorRatio}
                    />
                </label>

                <label>
                    Knee <span id="compressor_knee_value">
                        {$MediaPlayer.filterCompressor.knee.value}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="40"
                        value={$MediaPlayer.filterCompressor.knee.value}
                        on:input={handleCompressorKnee}
                    />
                </label>

                <label>
                    Attack <span id="compressor_attack_value">
                        {$MediaPlayer.filterCompressor.attack.value}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        value={$MediaPlayer.filterCompressor.attack.value}
                        step="0.001"
                        on:input={handleCompressorAttack}
                    />
                </label>

                <label>
                    Release <span id="compressor_release_value">
                        {$MediaPlayer.filterCompressor.release.value}
                    </span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        value={$MediaPlayer.filterCompressor.release.value}
                        step="0.001"
                        on:input={handleCompressorRelease}
                    />
                </label>
            </div>
        {/if}
    </sl-card>
</sl-dropdown>

<style>
    .overrides :global(label) {
        margin-block-start: var(--spacing-md);
        display: block;
    }

    .overrides label > input {
        margin-block-start: var(--spacing-sm);
        display: block;
    }

    .site-player__volume-slider {
        background-color: var(--color-outline-variant);
        display: flex;
        height: 4px;
        width: 100%;
        min-width: 50px;
        cursor: pointer;
        position: relative;
        border-radius: 100vh;
        justify-self: center;
        margin: 0 10px;
    }

    /* increase clickable area of volume */
    .site-player__volume-slider:after {
        content: "";
        height: 30px;
        background-color: transparent;
        width: calc(100% + 30px);
        display: block;
        position: absolute;
        opacity: 0;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        transform: translateY(-50%) translateX(-50%);
        z-index: 100;
    }

    .site-player__volume-value {
        background-color: var(--color-primary);
        position: absolute;
        inset-inline-start: 0;
        inset-block-end: 0;
        inset-block-start: 0;
        transition: width linear 200ms;
        border-radius: 100vh;
    }

    /* volume value indicator popup */
    .site-player__volume-value:before {
        opacity: 0;
        inset-block-start: calc(50% - 20px);
    }

    .current {
        max-width: fit-content;
        margin-block: var(--spacing-md);
        border: 1px solid var(--color-outline-variant);
        padding: var(--spacing-md);
        border-radius: 7px;
    }

    .label {
        color: var(--color-primary);
        padding-inline-end: var(--spacing-md);
        text-align: end;
    }
</style>
