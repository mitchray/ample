<script>
    import { _ } from "svelte-i18n";
    import { tick } from "svelte";
    import { Saved, SkipBelow, SkipBelowRating } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    async function handleSkipBelow(e) {
        await tick();
        let newValue = e.target.checked;
        $Saved.setItem("SkipBelow", newValue);
        SkipBelow.set(newValue);
    }

    async function handleSkipBelowRating(e) {
        await tick();
        let newValue = e.target.value;
        $Saved.setItem("SkipBelowRating", newValue);
        SkipBelowRating.set(newValue);
    }
</script>

<sl-dropdown>
    <sl-button
        slot="trigger"
        class="rating-filter"
        class:is-enabled={$SkipBelow}
        size="small"
        title={$_("text.skipBelow")}
    >
        <MaterialSymbol name="star" fill={$SkipBelow} />
    </sl-button>

    <sl-card>
        <div slot="header">
            {$_("text.skipBelow")}

            <sl-switch
                on:sl-change={handleSkipBelow}
                checked={$SkipBelow}
            ></sl-switch>
        </div>

        <sl-select
            value={$SkipBelowRating}
            on:sl-change={handleSkipBelowRating}
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
            <sl-option value="1">
                {$_("text.ratingCount", { values: { count: 1 } })}
            </sl-option>
        </sl-select>
    </sl-card>
</sl-dropdown>

<style>
    sl-card [slot="header"] {
        display: flex;
        justify-content: space-between;
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
