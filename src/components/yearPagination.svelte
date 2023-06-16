<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";

    import SVGPlus from "/src/images/plus.svg";
    import SVGMinus from "/src/images/minus.svg";

    const currentYear = new Date().getFullYear();

    export let fromYear = currentYear;
    export let toYear = currentYear;
    export let showYear = currentYear;

    let loadCount = 0;

    let fromFinal = showYear || currentYear;
    let toFinal = showYear || currentYear;

    // Cap values at currentYear
    function maxValueCheck(val) {
        return (val > currentYear) ? currentYear : val;
    }

    const handleValues = (e) => {
        // Ensure values are never higher than current year
        toFinal = maxValueCheck(toFinal);
        fromFinal = maxValueCheck(fromFinal);
    }

    const handleTo = (e) => {
        if (toFinal < fromFinal) {
            fromFinal = toFinal;
        }

        handleValues();
    }

    const handleFrom = (e) => {
        if (fromFinal > toFinal) {
            toFinal = fromFinal;
        }

        handleValues();
    }

    const handleSearch = (e) => {
        fromYear = fromFinal;
        toYear = toFinal;
    }

    onMount(() => {
        handleSearch();
        loadCount++;
    });
</script>

<div class="container">
    <div class="inputs">
        <div class="input-group">
            <label>
                {$_('text.from')}
                <input type="number"
                    bind:value={fromFinal}
                    size="4"
                    maxlength="4"
                    on:change={handleFrom}
                >
            </label>

            <button class="minus button" on:click={() => {--fromFinal; handleFrom()}}><SVGMinus /></button>
            <button class="plus button" on:click={() => {++fromFinal; handleFrom()}}><SVGPlus /></button>
        </div>

        <div class="input-group">
            <label>
                {$_('text.to')}
                <input type="number"
                    bind:value={toFinal}
                    size="4"
                    maxlength="4"
                    on:change={handleTo}
                >
            </label>

            <button class="minus button" on:click={() => {--toFinal; handleTo()}}><SVGMinus /></button>
            <button class="plus button" on:click={() => {++toFinal; handleTo()}}><SVGPlus /></button>
        </div>
    </div>

    <button class="submit button button--primary" on:click={handleSearch}>{$_('text.search')}</button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-card-primary);
        border-radius: 10px;
        margin-block-end: var(--spacing-xxl);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        padding: var(--spacing-lg);
        max-width: min-content;
    }

    /* hide number spinners */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* hide number spinners */
    input[type=number] {
        -moz-appearance: textfield;
    }

    .inputs {
        flex-shrink: 0;
        display: flex;
        flex-direction: row;
        gap: var(--spacing-lg);
    }

    .input-group {
        display: flex;
        align-items: center;
        margin-block-end: var(--spacing-lg);
    }

    .input-group button {
        padding: 0;
        margin: 0;
        position: relative;
        transform: translateY(33%);
    }

    .input-group button :global(svg) {
        margin: unset;
    }

    .minus {
        order: -1;
    }

    .inputs label,
    .inputs input {
        display: block;
    }

    .inputs label {
        margin: 0 var(--spacing-md);
        color: var(--color-text-heading);
    }

    .inputs input {
        box-sizing: content-box; /* don't include padding for this */
        width: 4ch; /* declare as Chrome doesn't honor size attribute */
        font-size: 1.2rem;
    }

    .submit {
        display: inline-block;
        text-align: center;
    }
</style>
