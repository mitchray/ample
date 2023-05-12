<script>
    import { tick } from 'svelte';
    import { v4 as uuidv4 } from "uuid";
    import { SkipBelow, SkipBelowRating } from "../../stores/status";

    import Menu from '../../components/menu.svelte';

    import SVGFilterNone from "/src/images/filter_none.svg";
    import SVGFilter1 from "/src/images/filter_1.svg";
    import SVGFilter2 from "/src/images/filter_2.svg";
    import SVGFilter3 from "/src/images/filter_3.svg";
    import SVGFilter4 from "/src/images/filter_4.svg";
    import SVGFilter5 from "/src/images/filter_5.svg";

    const uniqueMenuID = "skipBelowMenu_" + uuidv4();

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
    id="{uniqueMenuID}"
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
    <Menu anchor="top" toggleSelector={`#${uniqueMenuID}`} bind:isVisible >
        <div class="header new-panel-header">
            <h4 class="title panel-title">Skip songs below rating</h4>

            <input type="checkbox" class="switch" bind:checked={$SkipBelow} on:change={handleSkipBelow} />
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