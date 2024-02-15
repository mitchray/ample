<script>
    import { _ } from "svelte-i18n";
    import { onMount, createEventDispatcher } from "svelte";
    import { API } from "~/stores/state.js";

    export let type;
    export let selectedPlaylist;
    export let showSelected;

    const dispatch = createEventDispatcher();

    let search = "";
    let filteredList;
    let playlistItems = [];

    $: playlistItems = playlistItems;
    $: filteredList = playlistItems.filter(
        (item) => item.name.toLocaleLowerCase().indexOf(search) !== -1,
    );

    async function handleSelection(playlist) {
        // test if selected playlist is still valid (i.e. not deleted)
        let testPlaylist = await $API.playlist({ filter: playlist.id });

        if (testPlaylist.error) {
            console.error("Ample error getting playlist:", testPlaylist.error);
            return;
        }

        // if invalid, remove from the list and reload the playlists
        if (!testPlaylist.id) {
            await loadData();
            selectedPlaylist = null;
            dispatch("cleared");
            return;
        }

        selectedPlaylist = playlist;
        dispatch("selected");
    }

    async function loadData() {
        try {
            if (type === "smartlists") {
                playlistItems = await $API.smartlists();
            } else {
                playlistItems = await $API.playlists({ hide_search: 1 });
            }
        } catch (error) {
            console.error(`Ample error getting ${type}:`, error);
        }
    }

    function handleChange(e) {
        search = e.target.value;
    }

    onMount(() => {
        loadData();
    });
</script>

<div class="container">
    {#if showSelected}
        <div class="current">
            {#if selectedPlaylist}
                <span
                    class="current-selected truncate"
                    title={selectedPlaylist.name}
                >
                    {selectedPlaylist.name}
                </span>
            {:else}
                <span class="current-selected warning">
                    {$_("text.playlistNoneSelected")}
                </span>
            {/if}
        </div>
    {/if}

    <sl-input
        type="text"
        class="filter"
        placeholder={$_("text.filter")}
        on:sl-input={handleChange}
        clearable
    ></sl-input>

    <ul class="playlists">
        {#if filteredList.length > 0}
            {#each filteredList as item}
                <li
                    class="item"
                    on:click={handleSelection(item)}
                    class:selected={selectedPlaylist &&
                        selectedPlaylist.id === item.id}
                >
                    <span class="item-inner truncate" title={item.name}>
                        {item.name}
                    </span>
                </li>
            {/each}
        {/if}
    </ul>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .selected {
        font-weight: 700;
        background-color: var(--color-secondary-container);
        color: var(--color-on-secondary-container);
    }

    .playlists {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        gap: 1px;
        flex: 1;
        border: 1px solid var(--color-outline-variant);
    }

    .item {
        cursor: pointer;
    }

    .item-inner {
        display: block;
        padding: var(--spacing-sm) var(--spacing-md);
        max-width: 100%; /* key to having overflow take effect with the flex-start items */
    }

    .filter {
        margin-block-end: var(--spacing-sm);
    }

    .current {
        margin-block-end: var(--spacing-lg);
    }

    .current-selected {
        font-weight: 700;
    }

    .warning {
        color: var(--swatch-yellow-500);
    }
</style>
