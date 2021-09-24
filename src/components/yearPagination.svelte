<script>
    import { onMount } from "svelte";

    import SVGPlus from "../../public/images/plus.svg";
    import SVGMinus from "../../public/images/minus.svg";

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDecade = Math.floor(currentYear / 10) * 10;
    const currentCentury = Math.floor(currentYear / 100) * 100;

    export let fromYear = currentYear;
    export let toYear = currentYear;
    export let showYear;

    let loadCount = 0;
    let centuries = [];
    let decades;
    let years;
    let lastYears = [2, 5, 10, 15, 20, 30, 40, 50];
    let centuryFinal = currentCentury;
    let decadeFinal = currentDecade;
    let yearFinal = currentYear;

    // Begin component
    let params = (new URL(document.location)).searchParams;

    // Load from URL otherwise set defaults
    let fromFinal = params.get('from') || showYear || currentYear;
    let toFinal = params.get('to') || showYear || currentYear;

    $: decades = generateDecades(centuryFinal);
    $: years = generateYears(decadeFinal);

    generateCenturies();

    function generateCenturies() {
        // generate centuries
        for (let i = currentCentury; i > 1400; i = i - 100) {
            centuries.push(i);
        }

        centuries.reverse();
    }

    function generateDecades(val) {
        let tempDecades = [];

        for (let i = parseInt(val); i < parseInt(val) + 100; i = i + 10) {
            if (i <= currentDecade) {
                tempDecades.push(i);
            }
        }

        return tempDecades;
    }

    function generateYears(val) {
        let tempYears = [];

        for (let i = parseInt(val); i < parseInt(val) + 10; i = i + 1) {
            if (i <= currentYear) {
                tempYears.push(i);
            }
        }

        return tempYears;
    }

    const handleDateSelection = (e) => {
        let fromSelected = e.target.dataset.from;
        let toSelected = e.target.dataset.to;
        let centurySelected = e.target.dataset.century;
        let decadeSelected = e.target.dataset.decade;
        let yearSelected = e.target.dataset.year;

        fromFinal = fromSelected || fromFinal;
        toFinal = toSelected || toFinal;
        centuryFinal = centurySelected || '';
        decadeFinal = decadeSelected || '';
        yearFinal = yearSelected || '';

        updateURL();
    }

    const handleRangeSelection = (e) => {
        let fromSelected = e.target.dataset.from;
        let toSelected = e.target.dataset.to;

        fromFinal = fromSelected || fromFinal;
        toFinal = toSelected || toFinal;

        updateURL();
    }

    // Cap values at currentYear
    function maxValueCheck(val) {
        return (val > currentYear) ? currentYear : val;
    }

    // Include more time in range if current year is still newish
    function yearRangeAdjustment(year) {
        return (currentMonth >= 5) ? year + 1 : year;
    }

    function updateURL() {
        let url = new URL(window.location);
        url.searchParams.set('from', fromFinal);
        url.searchParams.set('to', toFinal);
        window.history.replaceState({}, '', url);
    }

    const handleValues = (e) => {
        // Ensure values are never higher than current year
        toFinal = maxValueCheck(toFinal);
        fromFinal = maxValueCheck(fromFinal);

        updateURL();
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

        if (loadCount > 0) {
            // reset to first page when searching
            let url = new URL(window.location);
            url.searchParams.set('page', '1');
            window.history.replaceState({}, '', url);
        }
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
                From
                <input type="number" bind:value={fromFinal} size="4" maxlength="4" on:change={handleFrom}>
            </label>
            <button class="minus" on:click={() => {--fromFinal; handleFrom()}}><SVGMinus class="icon"/></button>
            <button class="plus" on:click={() => {++fromFinal; handleFrom()}}><SVGPlus class="icon"/></button>
        </div>

        <div class="input-group">
            <label>
                To
                <input type="number" bind:value={toFinal} size="4" maxlength="4" on:change={handleTo}>
            </label>
            <button class="minus" on:click={() => {--toFinal; handleTo()}}><SVGMinus class="icon"/></button>
            <button class="plus" on:click={() => {++toFinal; handleTo()}}><SVGPlus class="icon"/></button>
        </div>

        <button class="submit primary" on:click={handleSearch}>Search</button>
    </div>

    <div class="presets">
        <div class="row ranges">
            <div class="label">Ranges</div>
            <ul>
                {#each lastYears as chunk}
                    <li>
                        <button
                            on:click={handleRangeSelection}
                            data-from={yearRangeAdjustment(currentYear - chunk)}
                            data-to={currentYear}
                        >
                            Last <span class="emphasis">{chunk} years</span>
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="row timeframe centuries">
            <div class="label">Centuries</div>
            <ul>
                {#each centuries as century}
                    <li>
                        <button
                            on:click={handleDateSelection}
                            data-from={century}
                            data-to={maxValueCheck(century + 99)}
                            data-century={century}
                            class:active={century.toString() === centuryFinal.toString()}
                        >
                            {century}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="row timeframe decades">
            <div class="label">Decades</div>
            <ul>
                {#each decades as decade}
                    <li>
                        <button
                            on:click={handleDateSelection}
                            data-from={decade}
                            data-to={maxValueCheck(decade + 9)}
                            data-century={centuryFinal}
                            data-decade={decade}
                            class:active={decade.toString() === decadeFinal.toString()}
                        >
                            {decade}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="row timeframe years">
            <div class="label">Years</div>
            <ul>
                {#each years as year}
                    <li>
                        <button
                            on:click={handleDateSelection}
                            data-from={year}
                            data-to={year}
                            data-century={centuryFinal}
                            data-decade={decadeFinal}
                            data-year={year}
                        >
                            {year}
                        </button>
                    </li>
                {/each}
            </ul>
        </div>
    </div>

</div>

<style>
    .container {
        display: flex;
        align-items: center;
        border: 2px solid var(--color-tint-100);
        border-radius: 10px;
        margin-bottom: var(--spacing-xxl);
        overflow: hidden;
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
        flex-direction: column;
        margin: 0 var(--spacing-lg);
    }

    .input-group {
        display: flex;
        align-items: center;
        margin-bottom: var(--spacing-lg);
    }

    .input-group button {
        height: max-content;
        padding: 0;
        margin: 0;
        position: relative;
        transform: translateY(50%);
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
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .inputs input {
        box-sizing: content-box; /* don't include padding for this */
        width: 4ch; /* declare as Chrome doesn't honor size attribute */
        font-size: 2rem;
    }

    .submit {
        display: inline-block;
        text-align: center;
        width: 100%;
        margin-top: var(--spacing-md);
    }

    .presets {
        display: table;
        border-left: 2px solid var(--color-tint-100);
    }

    .presets .label,
    .presets ul {
        display: table-cell;
        vertical-align: middle;
    }

    .row {
        display: table-row;
        height: 50px;
    }

    .row:nth-child(even) {
        background-color: var(--color-shade-100);
    }

    .label {
        text-align: right;
        font-weight: 700;
        padding-right: var(--spacing-lg);
        padding-left: var(--spacing-xxl);
    }

    .timeframe ul {
        margin: 0;
    }

    .timeframe li {
        display: inline-block;
    }

    .timeframe button {
        border: 0;
    }

    .timeframe button.active {
        background-color: var(--color-tint-100);
    }

    .ranges ul {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }

    .ranges button {
        display: inline-block;
        text-align: center;
        min-width: 17ch;
        margin: 0;
    }

    .emphasis {
        font-weight: 700;
        color: var(--color-text-heading);
        pointer-events: none;
    }

    @media all and (min-width: 1080px) {
        .container {
            max-width: 880px;
        }
    }
</style>
