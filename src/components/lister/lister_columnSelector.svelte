<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import Menu from '../../components/menu.svelte';
    import SVGColumns from "/src/images/columns.svg";

    export let contextKey;

    let { listerColumnsID, availableColumns, visibleColumns, listerHeader } = getContext(contextKey);

    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    function toggleSelected() {
        $visibleColumns = $availableColumns.filter(el => el.show === true);

        $listerHeader.calculateWidths();

        let visibleColumnIds = [];

        // store the visible columns that we can toggle
        for (let i = 0; i < $availableColumns.length; i++) {
            if ($availableColumns[i].show && $availableColumns[i].canToggle) {
                visibleColumnIds.push($availableColumns[i].id);
            }
        }

        localStorage.setItem(`Ample${listerColumnsID}`, JSON.stringify(visibleColumnIds));
    }
</script>

<button
    id="listerColumns-{contextKey}"
    class="icon-button"
    title="{$_('text.selectColumns')}"
    on:click={toggleMenu}
>
    <SVGColumns />
</button>

{#if menuIsVisible}
    <Menu anchor="bottom" toggleSelector={`#listerColumns-${contextKey}`} bind:isVisible={menuIsVisible} >
        <div class="panel-content">
            {#each $availableColumns as col}
                {#if col.canToggle}
                    <div>
                        <label class="toggle">
                            <input type="checkbox" bind:checked={col.show} on:change={toggleSelected} />
                            {$_(col.label)}
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
        inset-inline-end: 0;
    }

    .panel-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
</style>
