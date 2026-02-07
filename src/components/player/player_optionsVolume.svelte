<script>
    import { Settings } from "~/stores/settings.js";
    import { _ } from "@rgglez/svelte-i18n";
    import {
        CurrentMedia,
        CurrentMediaGainInfo,
        debugMode,
    } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";

    function handleVolumeNormalize(e) {
        let setting = e.target.checked;
        $Settings.VolumeNormalizationEnabled = setting;
        $MediaPlayer.updateFilters();
    }

    function handleDynamicsCompressor(e) {
        let setting = e.target.checked;
        $Settings.DynamicsCompressorEnabled = setting;
        $MediaPlayer.updateFilters();
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
</script>

<sl-checkbox
    checked={$Settings.VolumeNormalizationEnabled}
    on:sl-change={handleVolumeNormalize}
>
    {$_("text.volumeNormalize")}
</sl-checkbox>

<div class="secondary-info help-text">
    {$_("text.volumeNormalizeInfo")}
</div>

{#if $CurrentMedia && $CurrentMediaGainInfo}
    <div class="current">
        <table>
            <tbody>
                <tr>
                    <td class="label">{$_("text.current")}</td>
                    <td>{$CurrentMediaGainInfo.gainType}</td>
                </tr>

                <tr>
                    <td class="label">{$_("text.target")}</td>
                    <td>{$MediaPlayer.targetVolume}dB</td>
                </tr>

                {#if $CurrentMediaGainInfo.gainType !== "None"}
                    <tr>
                        <td class="label">{$_("text.mastered")}</td>
                        <td>
                            {$CurrentMediaGainInfo.masteredVolume}dB
                        </td>
                    </tr>

                    <tr>
                        <td class="label">{$_("text.gainFactor")}</td>
                        <td>×{$CurrentMediaGainInfo.gainFactor}</td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
{/if}

<sl-divider></sl-divider>

<sl-checkbox
    checked={$Settings.DynamicsCompressorEnabled}
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

<style>
    .overrides :global(label) {
        margin-block-start: var(--spacing-md);
        display: block;
    }

    .overrides label > input {
        margin-block-start: var(--spacing-sm);
        display: block;
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
