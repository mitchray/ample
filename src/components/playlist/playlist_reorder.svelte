<script>
    import { getContext } from "svelte";
    import { reorderPlaylist } from "../../logic/playlist";

    export let contextKey;

    const { dataDisplay, isEditMode } = getContext(contextKey);

    // TODO consolidate playlistID getter
    let urlParts = location.href.split("/"); // 'location' is inherited from Router automatically
    let playlistID = urlParts.pop() || urlParts.pop(); // trick to handle potential trailing slash

    function handleStart() {
        $isEditMode = true;
    }

    function handleRandom() {
        console.debug('randomized');
    }

    async function handleSave() {
        // filter out any 'removed' items
        let actual = $dataDisplay.filter(el => el.isDeleted !== true);

        let ids = actual.map((obj) => obj.id);
        let newOrders = Array.from(actual.keys(), n => n + 1);

        let result = await reorderPlaylist({id: playlistID, items: ids.join(","), tracks: newOrders.join(",")});

        if (result.success) {
            // redo the indexes
            for (let i = 0; i < actual.length; i++) {
                actual[i].initialOrder = i;
            }

            $dataDisplay = $dataDisplay;

            $isEditMode = false;
        }
    }

    function handleCancel() {
        $isEditMode = false;
    }
</script>

{#if $isEditMode}
    <button class="button button--primary" type="button" title="Save" on:click={handleSave}>Save order</button>
    <button class="button button--regular" type="button" title="Random" on:click={handleRandom}>Random</button>
    <button class="button button--tertiary" type="button" title="Cancel" on:click={handleCancel}>Cancel</button>
{:else}
    <button class="button button--regular" type="button" title="Reorder" on:click={handleStart}>Reorder</button>
{/if}


