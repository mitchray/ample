<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    export let type;
    export let selectedPlaylists = [];
    export let multiple = false;

    const dispatch = createEventDispatcher();

    let playlistItems = [];

    $: playlistItems = playlistItems;

    function handleRadio(e) {
        selectedPlaylists = [e.target.value];

        announce();
    }

    function handleCheckbox(e) {
        if (e.target.checked) {
            selectedPlaylists.push(e.target.name);
        } else {
            selectedPlaylists = selectedPlaylists.filter(
                (item) => item !== e.target.name,
            );
        }

        selectedPlaylists = selectedPlaylists;

        announce();
    }

    async function announce() {
        if (selectedPlaylists.length < 1) {
            dispatch("cleared");
        } else {
            dispatch("selected");
        }
    }

    async function loadData() {
        try {
            if (type === "smartlists") {
                playlistItems = await $API.smartlists();
            } else {
                playlistItems = await $API.playlists({ hide_search: 1 });
            }
        } catch (error) {
            errorHandler(`getting ${type}`, error);
        }
    }

    onMount(() => {
        loadData();
    });
</script>

<div class="container">
    <ul class="playlists">
        {#if multiple}
            {#each playlistItems as item}
                <li class="item">
                    <span class="item-inner truncate" title={item.name}>
                        <sl-checkbox
                            name={item.id}
                            on:sl-change={handleCheckbox}
                        >
                            {item.name}
                        </sl-checkbox>
                    </span>
                </li>
            {/each}
        {:else}
            <sl-radio-group
                name="selected"
                value={selectedPlaylists[0]}
                on:sl-change={handleRadio}
            >
                {#each playlistItems as item}
                    <li class="item">
                        <span class="item-inner truncate" title={item.name}>
                            <sl-radio value={item.id}>{item.name}</sl-radio>
                        </span>
                    </li>
                {/each}
            </sl-radio-group>
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

    .playlists {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
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
</style>
