<script>
    import { getContext } from 'svelte';

    import Menu from '../../components/menu.svelte';

    import SVGColumns from "../../../public/images/columns.svg";

    export let contextKey;
    let { availableColumns, listerHeader } = getContext(contextKey);

    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function toggleSelected() {
        $listerHeader.calculateWidths();
    }
</script>

<button
    id="listerColumns-{contextKey}"
    class="icon-button"
    title="Select columns"
    on:click={toggleMenu}
>
    <SVGColumns />
</button>

{#if menuIsVisible}
    <Menu anchor="bottom-left" toggleElement={document.querySelector(`#listerColumns-${contextKey}`)} bind:isVisible={menuIsVisible} >
        <div class="panel-content">
            {#each $availableColumns as col}
                {#if !col.alwaysShow}
                    <div>
                        <label class="toggle">
                            <input type="checkbox" bind:checked={col.show} on:change={toggleSelected} />
                            {col.label}
                        </label>
                    </div>
                {/if}
            {/each}
        </div>
    </Menu>
{/if}

<style>
    button {
        position: absolute;
        right: 0;
    }
</style>
