<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from "svelte";
    import { PageLoadedKey } from "../../stores/status";
    import Actions from '../../components/action/actions.svelte';
    import PlaylistRemoveFrom from '../playlist/playlist_removeFrom.svelte';
    import PlaylistReorder from '../playlist/playlist_reorder.svelte';
    import PlaylistRefresh from '../playlist/playlist_refresh.svelte';
    import SVGList from "/src/images/table_rows.svg";
    import SVGGrid from "/src/images/grid.svg";

    export let contextKey;

    const { _type, _actionData, _discSubtitle, _tableOnly, listerDisplayID, _displayAsTable, _showCheckboxes, dataDisplay } = getContext(contextKey);

    let actionsBind;

    function setTableDisplay(pref) {
        $_displayAsTable = pref;
        localStorage.setItem($listerDisplayID, JSON.stringify(pref));
        $PageLoadedKey = Date.now().toString(); // reload the entire page to rerender the lister
    }
</script>

<div class="lister-actions" bind:this={actionsBind} class:not-empty={actionsBind?.firstElementChild}>
    {#if !$_actionData.disable}
        <div class="group">
            <Actions mode="fullButtons" {...$_actionData} />
        </div>
    {/if}

    {#if $_discSubtitle}
        <div class="disc-subtitle">{$_discSubtitle}</div>
    {/if}

    {#if !$_tableOnly}
        <div class="group">
            <button class="button" on:click={() => { setTableDisplay(true) }} class:active={$_displayAsTable}><SVGList style="transform: scale(0.7)" /> {$_('text.list')}</button>
            <button class="button" on:click={() => { setTableDisplay(false) }} class:active={!$_displayAsTable}><SVGGrid style="transform: scale(0.7)" /> {$_('text.grid')}</button>
        </div>
    {/if}

    {#if $_type === "playlist_songs"}
        {#if $_showCheckboxes}
            <div class="group">
                <PlaylistRemoveFrom contextKey={contextKey} />
            </div>

            <div class="group">
                <PlaylistReorder contextKey={contextKey} />
            </div>
        {/if}

        {#if !$_showCheckboxes}
            <div class="group">
                <PlaylistRefresh contextKey={contextKey} />
            </div>
        {/if}
    {/if}
</div>

<style>
    .lister-actions {
        display: flex;
        z-index: 1;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }

    /* collapses space if empty */
    .lister-actions.not-empty {
        margin-block-end: var(--spacing-lg);
    }

    .disc-subtitle {
        color: var(--color-highlight);
        font-weight: 700;
    }

    .lister-actions > .group,
    .lister-actions :global(.c-actions) {
        display: contents;
    }

    button {
        margin: 0;
    }
</style>