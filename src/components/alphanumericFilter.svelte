<script>
    import { onMount } from "svelte";
    import { FilterHistory } from "../stores/status";
    import SVGClose from "/src/images/close.svg";

    export let filterValue;
    export let type;

    let timeout;
    let inputValue;

    function handleClear() {
        inputValue = "";
        filterValue = "";
        $FilterHistory[type] = "";
    }

    function handleInputChange(e) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            $FilterHistory[type] = inputValue;
            filterValue = inputValue;
        }, 600);
    }

    onMount(() => {
        let previous = $FilterHistory[type];

        if (previous) {
            filterValue = inputValue = previous;
        }
    });
</script>

<div class="container">
    <label>
        Filter
        <input
            type="text"
            class="filter"
            on:paste={handleInputChange}
            on:keyup={handleInputChange}
            bind:value={inputValue}
        />
        {#if filterValue}
            <button class="icon-button close" on:click={handleClear}><SVGClose /></button>
        {/if}
    </label>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        align-items: center;

        z-index: 1;
        margin-block-end: var(--spacing-lg);
    }

    label {
        position: relative;
    }

    .container .filter {
        padding-inline-end: var(--spacing-xxl);
        margin-inline-start: var(--spacing-sm);
    }

    .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: var(--spacing-sm);
        background: unset;
        border: unset;
        box-shadow: unset;
    }
</style>