<script>
    import {getContext, tick} from 'svelte';
    import { SkipBelow, SkipBelowRating } from "../../stores/status";
    import { loadingSpinner } from "../../actions/loadingSpinner";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    async function handleSkipBelow() {
        await tick();
        localStorage.setItem('SkipBelow', JSON.stringify($SkipBelow));
        SkipBelow.set($SkipBelow);
    }

    async function handleSkipBelowRating() {
        await tick();
        let newValue = $SkipBelowRating;
        localStorage.setItem('SkipBelowRating', JSON.stringify(newValue));
        SkipBelowRating.set(newValue);
    }
</script>

<div class="filter-below">
    <label>
        <input type="checkbox" bind:checked={$SkipBelow} on:change={handleSkipBelow} />
        Skip songs below
    </label>

    <select bind:value={$SkipBelowRating} on:change={handleSkipBelowRating}>
        <option value="1" selected={$SkipBelowRating === 1}>1 star</option>
        <option value="2" selected={$SkipBelowRating === 2}>2 stars</option>
        <option value="3" selected={$SkipBelowRating === 3}>3 stars</option>
        <option value="4" selected={$SkipBelowRating === 4}>4 stars</option>
        <option value="5" selected={$SkipBelowRating === 5}>5 stars</option>
    </select>
</div>

<style>
    .filter-below {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }
</style>