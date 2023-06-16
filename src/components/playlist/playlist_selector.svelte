<script>
    import { _ } from 'svelte-i18n';
    import { onMount, createEventDispatcher  } from "svelte";
    import { API } from "../../stores/api";

    export let type;
    export let selectedPlaylist;
    export let showSelected;

    const dispatch = createEventDispatcher();

    let search = '';
    let filteredList;
    let playlistItems = [];

    $: playlistItems = playlistItems;
    $: filteredList = playlistItems.filter(item => item.name.toLocaleLowerCase().indexOf(search) !== -1);

    async function handleSelection(playlist) {
        // test if selected playlist is still valid (i.e. not deleted)
        let testPlaylist = await $API.playlist({ filter: playlist.id });

        // if invalid, remove from the list and reload the playlists
        if (!testPlaylist.id) {
            await loadData();
            selectedPlaylist = null;
            dispatch('cleared');
            return;
        }

        selectedPlaylist = playlist;
        dispatch('selected');
    }

    async function loadData() {
        if (type === 'smartlists') {
            playlistItems = await $API.smartlists();
        } else {
            playlistItems = await $API.playlists({ hide_search: 1 });
        }
    }

    onMount(() => {
        loadData();
    });
</script>

<div class="container">
    {#if showSelected}
        <div class="current">
            {#if selectedPlaylist}
                <span class="current-selected" title="{selectedPlaylist.name}">{selectedPlaylist.name}</span>
            {:else}
                <span class="current-selected">{$_('text.playlistNoneSelected')}</span>
            {/if}
        </div>
    {/if}

    <input type="text" placeholder="{$_('text.filter')}" class="filter" bind:value={search} />

    <div class="new-panel-main">
        <ul class="playlists">
            {#if filteredList.length > 0}
                {#each filteredList as item}
                    <li class="item" on:click={handleSelection(item)} class:selected={selectedPlaylist && selectedPlaylist.id === item.id}>
                        <span class="item-inner" title="{item.name}">{item.name}</span>
                    </li>
                {/each}
            {/if}
        </ul>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        width: 250px;
    }

    .selected {
        font-weight: 700;
        color: var(--color-highlight);
    }

    .playlists {
        height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1px;
    }

    .item {
        cursor: pointer;
    }

    .item-inner {
        display: block;
        padding: var(--spacing-sm) var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%; /* key to having overflow take effect with the flex-start items */
    }

    @media (hover: hover) {
        .item:hover {
            background-color: var(--color-card-highlight);
        }
    }

    .current {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        max-width: 100%;
        margin-block-end: var(--spacing-md);
    }

    .current-selected {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 700;
    }
</style>