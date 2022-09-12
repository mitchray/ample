<script>
    import { tick } from 'svelte';
    import { SkipBelow, SkipBelowRating } from "../../stores/status";

    import Menu from '../../components/menu.svelte';

    import SVGFilterNone from "../../../public/images/filter_none.svg";
    import SVGFilter1 from "../../../public/images/filter_1.svg";
    import SVGFilter2 from "../../../public/images/filter_2.svg";
    import SVGFilter3 from "../../../public/images/filter_3.svg";
    import SVGFilter4 from "../../../public/images/filter_4.svg";
    import SVGFilter5 from "../../../public/images/filter_5.svg";

    let isVisible = false;

    async function handleSkipBelow() {
        await tick();
        localStorage.setItem('SkipBelow', JSON.stringify($SkipBelow));
        SkipBelow.set($SkipBelow);
    }

    async function handleSkipBelowRating() {
        isVisible = false;
        await tick();
        let newValue = $SkipBelowRating;
        localStorage.setItem('SkipBelowRating', JSON.stringify(newValue));
        SkipBelowRating.set(newValue);
    }

    function toggleMenu() {
        isVisible = !isVisible;
    }
</script>

<button
    id="skipBelowMenu"
    class="icon-button"
    title="Skip songs below rating"
    on:click={toggleMenu}
>
    {#if $SkipBelow}
        {#if parseInt($SkipBelowRating) === 1     }<SVGFilter1 style="transform: scale(0.75);" />
        {:else if parseInt($SkipBelowRating) === 2}<SVGFilter2 style="transform: scale(0.75);" />
        {:else if parseInt($SkipBelowRating) === 3}<SVGFilter3 style="transform: scale(0.75);" />
        {:else if parseInt($SkipBelowRating) === 4}<SVGFilter4 style="transform: scale(0.75);" />
        {:else if parseInt($SkipBelowRating) === 5}<SVGFilter5 style="transform: scale(0.75);" />
        {/if}
    {:else}
        <SVGFilterNone style="transform: scale(0.75);" />
    {/if}
</button>

{#if isVisible}
    <Menu anchor="top-center" toggleElement={document.querySelector("#skipBelowMenu")} bind:isVisible >
        <div class="header panel-header">
            <h4 class="title panel-title">Skip songs below rating</h4>

            <label class="toggle">
                <input type="checkbox" bind:checked={$SkipBelow} on:change={handleSkipBelow} />
                Enable
            </label>
        </div>

        <div class="panel-content">
            <select bind:value={$SkipBelowRating} on:change={handleSkipBelowRating}>
                <option value="1" selected={$SkipBelowRating === 1}>1 star</option>
                <option value="2" selected={$SkipBelowRating === 2}>2 stars</option>
                <option value="3" selected={$SkipBelowRating === 3}>3 stars</option>
                <option value="4" selected={$SkipBelowRating === 4}>4 stars</option>
                <option value="5" selected={$SkipBelowRating === 5}>5 stars</option>
            </select>
        </div>
    </Menu>
{/if}