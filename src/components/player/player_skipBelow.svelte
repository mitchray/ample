<script>
    import { _ } from "svelte-i18n";
    import { tick } from "svelte";
    import { Saved, SkipBelow, SkipBelowRating } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let icon;

    $: {
        switch ($SkipBelowRating) {
            case 1:
                icon = "filter_1";
                break;
            case 2:
                icon = "filter_2";
                break;
            case 3:
                icon = "filter_3";
                break;
            case 4:
                icon = "filter_4";
                break;
            case 5:
                icon = "filter_5";
                break;
            default:
                icon = "filter_none";
                break;
        }
    }

    async function handleSkipBelow() {
        await tick();
        $Saved.setItem("SkipBelow", $SkipBelow);
        SkipBelow.set($SkipBelow);
    }

    async function handleSkipBelowRating(e) {
        await tick();
        let newValue = e.target.value;
        $Saved.setItem("SkipBelowRating", newValue);
        SkipBelowRating.set(newValue);
    }
</script>

<sl-dropdown>
    <sl-button slot="trigger" title={$_("text.skipBelow")}>
        <MaterialSymbol name={icon} />
    </sl-button>

    <sl-card>
        <sl-checkbox
            on:sl-change={handleSkipBelow}
            checked={$SkipBelow}
        ></sl-checkbox>

        <sl-select
            value={$SkipBelowRating}
            on:sl-change={handleSkipBelowRating}
        >
            <sl-option value="5" selected={$SkipBelowRating === 5}>
                {$_("text.ratingCount", { values: { count: 5 } })}
            </sl-option>
            <sl-option value="4" selected={$SkipBelowRating === 4}>
                {$_("text.ratingCount", { values: { count: 4 } })}
            </sl-option>
            <sl-option value="3" selected={$SkipBelowRating === 3}>
                {$_("text.ratingCount", { values: { count: 3 } })}
            </sl-option>
            <sl-option value="2" selected={$SkipBelowRating === 2}>
                {$_("text.ratingCount", { values: { count: 2 } })}
            </sl-option>
            <sl-option value="1" selected={$SkipBelowRating === 1}>
                {$_("text.ratingCount", { values: { count: 1 } })}
            </sl-option>
        </sl-select>
    </sl-card>
</sl-dropdown>
