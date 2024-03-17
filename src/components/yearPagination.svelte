<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    const currentYear = new Date().getFullYear();

    export let fromYear = currentYear;
    export let toYear = currentYear;
    export let showYear = currentYear;

    let loadCount = 0;

    let fromFinal = showYear || currentYear;
    let toFinal = showYear || currentYear;

    // Cap values at currentYear
    function maxValueCheck(val) {
        return val > currentYear ? currentYear : val;
    }

    const handleValues = () => {
        // Ensure values are never higher than current year
        toFinal = maxValueCheck(toFinal);
        fromFinal = maxValueCheck(fromFinal);
    };

    const handleTo = () => {
        if (toFinal < fromFinal) {
            fromFinal = toFinal;
        }

        handleValues();
    };

    const handleFrom = () => {
        if (fromFinal > toFinal) {
            toFinal = fromFinal;
        }

        handleValues();
    };

    const handleSearch = () => {
        fromYear = fromFinal;
        toYear = toFinal;
    };

    onMount(() => {
        handleSearch();
        loadCount++;
    });
</script>

<div class="container">
    <div class="inputs">
        <div class="input-group">
            <sl-input
                value={fromFinal}
                type="number"
                label={$_("text.from")}
                maxlength="4"
                no-spin-buttons
                on:sl-change={handleFrom}
            ></sl-input>

            <sl-button
                class="minus button"
                on:click={() => {
                    --fromFinal;
                    handleFrom();
                }}
            >
                <MaterialSymbol name="remove" />
            </sl-button>
            <sl-button
                class="plus button"
                on:click={() => {
                    ++fromFinal;
                    handleFrom();
                }}
            >
                <MaterialSymbol name="add" />
            </sl-button>
        </div>

        <div class="input-group">
            <sl-input
                value={toFinal}
                type="number"
                label={$_("text.to")}
                maxlength="4"
                no-spin-buttons
                on:sl-change={handleTo}
            ></sl-input>

            <sl-button
                class="minus button"
                on:click={() => {
                    --toFinal;
                    handleTo();
                }}
            >
                <MaterialSymbol name="remove" />
            </sl-button>

            <sl-button
                class="plus button"
                on:click={() => {
                    ++toFinal;
                    handleTo();
                }}
            >
                <MaterialSymbol name="add" />
            </sl-button>
        </div>
    </div>

    <sl-button variant="primary" class="submit" on:click={handleSearch}>
        {$_("text.search")}
    </sl-button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-surface-container);
        border-radius: 10px;
        margin-block-end: var(--spacing-xxl);
        overflow: hidden;
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
    input[type="number"] {
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

    .input-group sl-button {
        padding: 0;
        margin: 0;
        position: relative;
        transform: translateY(25%);
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
