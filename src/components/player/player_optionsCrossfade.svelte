<script>
    import { _ } from "svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    function handleDuration(e) {
        $Settings.Crossfade.duration = e.target.value;
    }

    function handleMode(e) {
        $Settings.Crossfade.mode = e.target.value;
    }
</script>

<div class="container">
    <sl-radio-group
        label={$_("text.mode")}
        name="mode"
        value={$Settings.Crossfade?.mode}
        onsl-change={(e) => handleMode(e)}
    >
        <sl-radio-button value="disabled">
            {$_("text.disabled")}
        </sl-radio-button>
        <sl-radio-button value="gapless">{$_("text.gapless")}*</sl-radio-button>
        <sl-radio-button value="crossfade">
            {$_("text.crossfade")}
        </sl-radio-button>
    </sl-radio-group>

    {#if $Settings.Crossfade?.mode === "crossfade"}
        <div class="duration-container">
            <sl-range
                label={$_("text.crossfadeDuration")}
                min="1"
                max="30"
                step="1"
                onsl-change={(e) => handleDuration(e)}
                value={$Settings.Crossfade?.duration}
            ></sl-range>
            {$Settings.Crossfade?.duration}
        </div>
    {/if}

    {#if $Settings.Crossfade?.mode === "gapless"}
        <sl-alert open variant="primary">
            <MaterialSymbol name="asterisk" size="1.5em" slot="icon" />
            Gapless is simulated by slightly overlapping items due to technical limitations.
        </sl-alert>
    {/if}
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .duration-container {
        display: flex;
        gap: var(--spacing-lg);
        align-items: end;
        padding-block-end: var(--spacing-sm);
    }
</style>
