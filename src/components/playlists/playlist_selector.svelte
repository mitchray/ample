<script>
    import { onMount, createEventDispatcher  } from "svelte";

    import { getSmartlists, getPlaylists, getPlaylist } from "../../logic/playlist";

    import PlaylistEdit from './playlist_edit.svelte';

    export let type;
    export let selectedPlaylist;

    const dispatch = createEventDispatcher();

    let search = '';
    let filteredList;
    let playlistItems = [];
    let showPlaylistCreation = false;
    let newPlaylist;

    $: {
        if (newPlaylist) {
            newPlaylist.isNew = true;

            playlistItems = [
                newPlaylist,
                ...playlistItems
            ]

            // reset
            newPlaylist = null;
            showPlaylistCreation = false;
        }

        playlistItems = playlistItems;
    }

    $: filteredList = playlistItems.filter(item => item.name.toLocaleLowerCase().indexOf(search) !== -1);

    async function handleSelection(playlist) {
        // test if selected playlist is still valid (i.e. not deleted)
        let testPlaylist = await getPlaylist(playlist.id);

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

    function handleGoToSelected() {
        document.querySelector(".playlists .selected").scrollIntoView({
            behavior: "smooth",
        });
    }

    function handleNewPlaylist() {
        showPlaylistCreation = !showPlaylistCreation;
    }

    async function loadData() {
        if (type === 'smartlists') {
            playlistItems = await getSmartlists();
        } else {
            playlistItems = await getPlaylists();
        }
    }

    onMount(() => {
        loadData();
    });
</script>

<div class="container">
    {#if showPlaylistCreation}
        <div class="nested">
            <PlaylistEdit isNew={true} bind:playlist={newPlaylist} bind:isVisible={showPlaylistCreation} />
        </div>
    {:else}
        {#if type === "playlists"}
            <button id="js-playlistsNewFromAdd" on:click={handleNewPlaylist} class="addNew primary">New playlist</button>
        {/if}

        <label class="filter">
            Filter:
            <input type="text" class="filter" bind:value={search} />
        </label>

        <ul class="playlists">
            {#if filteredList.length > 0}
                {#each filteredList as item}
                    <li class="item" class:highlight={item.isNew} on:click={handleSelection(item)} class:selected={selectedPlaylist && selectedPlaylist.id === item.id}>
                        <span class="inner" title="{item.name}">{item.name}</span>
                    </li>
                {/each}
            {/if}
        </ul>

        <p class="current">
            Selected:
            {#if selectedPlaylist}
                <span class="inner goto badge info" title="{selectedPlaylist.name}" on:click={handleGoToSelected}>{selectedPlaylist.name}</span>
            {:else}
                <span class="inner badge">No playlist selected</span>
            {/if}
        </p>
    {/if}
</div>

<style>
    .addNew {
        margin: var(--spacing-lg) 0;
    }

    .selected {
        color: var(--color-link-hover);
        font-weight: 700;
    }

    .nested {
        margin-top: var(--spacing-lg);
        padding: var(--spacing-lg);
        border: 1px solid var(--color-border);
        border-radius: 3px;
    }

    .highlight {
        font-style: italic;
    }

    .playlists {
        height: 200px;
        overflow-y: auto;
        border: 2px solid var(--color-lines);
        border-radius: 3px;
        padding: var(--spacing-sm) 0;
        margin-bottom: 0;
    }

    .filter {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .filter input {
        margin-left: var(--spacing-md);
    }

    .item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* have children take up content space */
    }

    .item .inner {
        display: block;
        padding: var(--spacing-sm) var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%; /* key to having overflow take effect with the flex-start items */
    }

    .item:hover {
        background-color: var(--color-tint-50);
    }

    :global(.theme-is-light) .item:hover {
        background-color: var(--color-shade-50);
    }

    .item + .item {
        margin-top: 2px;
    }

    .current {
        display: flex;
        overflow: hidden;
        align-items: center;
        margin-bottom: 0;
    }

    .current .inner {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%; /* key to having overflow take effect with the flex-start items */
        margin-left: 1ch;
    }

    .goto {
        cursor: pointer;
    }
</style>