<script>
    import { _ } from "svelte-i18n";
    import { tick } from "svelte";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    async function handleSkipBelow(e) {
        await tick();
        let newValue = e.target.checked;
        $Settings.SkipBelow.enabled = newValue;
    }

    async function handleSkipBelowRating(e) {
        await tick();
        let newValue = e.target.value;
        $Settings.SkipBelow.rating = newValue;
    }

    async function handleAllowZero(e) {
        await tick();
        let newValue = e.target.checked;
        $Settings.SkipBelow.allowZero = newValue;
    }
</script>

<sl-dropdown hoist placement="bottom">
    <sl-button
        class="rating-filter"
        class:is-enabled={$Settings.SkipBelow.enabled}
        size="small"
        slot="trigger"
        title={$_("text.skipBelow")}
    >
        <MaterialSymbol fill={$Settings.SkipBelow.enabled} name="star" />
    </sl-button>

    <sl-card>
        <sl-switch
            checked={$Settings.SkipBelow.enabled}
            onsl-change={handleSkipBelow}
        >
            {$_("text.skipBelow")}:
        </sl-switch>

        <sl-select
            onsl-change={handleSkipBelowRating}
            value={$Settings.SkipBelow.rating}
        >
            <sl-option value="5">
                {$_("text.ratingCount", { values: { count: 5 } })}
            </sl-option>
            <sl-option value="4">
                {$_("text.ratingCount", { values: { count: 4 } })}
            </sl-option>
            <sl-option value="3">
                {$_("text.ratingCount", { values: { count: 3 } })}
            </sl-option>
            <sl-option value="2">
                {$_("text.ratingCount", { values: { count: 2 } })}
            </sl-option>
        </sl-select>

        <sl-switch
            checked={$Settings.SkipBelow.allowZero}
            onsl-change={handleAllowZero}
        >
            {$_("text.allowUnrated")}
        </sl-switch>
    </sl-card>
</sl-dropdown>

<style>
    sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .rating-filter.is-enabled:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
        background-color: var(--color-on-surface);
        mask-image: url("/src/assets/stripe.svg");
        z-index: 1;
        opacity: 0.4;
        pointer-events: none;
    }
</style>
