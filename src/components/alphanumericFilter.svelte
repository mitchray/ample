<script>
    import SVGClose from "/src/images/close.svg";

    export let filterValue;

    let timeout;
    let inputValue;

    function handleClear() {
        inputValue = "";
        filterValue = "";
    }

    function handleInputChange(e) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            filterValue = inputValue;
        }, 600);
    }
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
        margin-bottom: var(--spacing-lg);
    }

    label {
        position: relative;
    }

    .container .filter {
        padding-right: var(--spacing-xxl);
        margin-left: var(--spacing-sm);
    }

    .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: var(--spacing-sm);
        background: unset;
        border: unset;
        box-shadow: unset;
    }
</style>