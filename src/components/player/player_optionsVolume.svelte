<script>
    import { Settings } from "~/stores/settings.js";
    import { _ } from "@rgglez/svelte-i18n";
    import {
        CurrentMedia,
        CurrentMediaGainInfo,
        debugMode,
    } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";

    let compressor = $derived($MediaPlayer?.getMasterCompressor?.() ?? null);

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
        if (compressor) compressor.threshold.value = this.value;
    }

    function handleCompressorRatio() {
        if (compressor) compressor.ratio.value = this.value;
    }

    function handleCompressorKnee() {
        if (compressor) compressor.knee.value = this.value;
    }

    function handleCompressorAttack() {
        if (compressor) compressor.attack.value = this.value;
    }

    function handleCompressorRelease() {
        if (compressor) compressor.release.value = this.value;
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

{#if $debugMode && $MediaPlayer}
    {#if compressor}
    <sl-divider></sl-divider>

    <div class="overrides">
        <label>
            Threshold <span id="compressor_threshold_value">
                {compressor.threshold.value}
            </span>
            <input
                type="range"
                min="-100"
                max="0"
                value={compressor.threshold.value}
                on:input={handleCompressorThreshold}
            />
        </label>

        <label>
            Ratio <span id="compressor_ratio_value">
                {compressor.ratio.value}
            </span>
            <input
                type="range"
                min="1"
                max="20"
                value={compressor.ratio.value}
                on:input={handleCompressorRatio}
            />
        </label>

        <label>
            Knee <span id="compressor_knee_value">
                {compressor.knee.value}
            </span>
            <input
                type="range"
                min="0"
                max="40"
                value={compressor.knee.value}
                on:input={handleCompressorKnee}
            />
        </label>

        <label>
            Attack <span id="compressor_attack_value">
                {compressor.attack.value}
            </span>
            <input
                type="range"
                min="0"
                max="1"
                value={compressor.attack.value}
                step="0.001"
                on:input={handleCompressorAttack}
            />
        </label>

        <label>
            Release <span id="compressor_release_value">
                {compressor.release.value}
            </span>
            <input
                type="range"
                min="0"
                max="1"
                value={compressor.release.value}
                step="0.001"
                on:input={handleCompressorRelease}
            />
        </label>
    </div>
    {/if}
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
