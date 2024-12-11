<script>
    import { getContext } from "svelte";

    let { multiple = false, contextKey } = $props();

    let { playlists, selectedPlaylists } = getContext(contextKey); // prefix store $ when accessing

    function handleRadio(e) {
        let index = $playlists.findIndex((p) => p && p.id === e.target.value);
        let tempArray = [];

        // build temp array
        for (let i = 0; i < $playlists.length; i++) {
            tempArray[i] = $playlists[i];
            tempArray[i].selected = i === index;
        }

        // commit temp array to playlists
        playlists.set(tempArray);

        refreshSelected();
    }

    function handleCheckbox(e) {
        let index = $playlists.findIndex(
            (plist) => plist && plist.id === e.target.name,
        );

        $playlists[index].selected = e.target.checked;

        refreshSelected();
    }

    function refreshSelected() {
        selectedPlaylists.set(
            $playlists.filter((p) => p && p.selected === true),
        );
    }
</script>

<div class="container">
    <ul class="playlists">
        {#if multiple}
            {#each $playlists as item (item.id)}
                <li class="item">
                    <span class="item-inner truncate" title={item.name}>
                        <sl-checkbox
                            name={item.id}
                            checked={item.selected}
                            onsl-change={handleCheckbox}
                        >
                            {item.name}
                        </sl-checkbox>
                    </span>
                </li>
            {/each}
        {:else}
            <sl-radio-group
                name="selected"
                value={$selectedPlaylists[0]?.id}
                onsl-change={handleRadio}
            >
                {#each $playlists as item (item.id)}
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
