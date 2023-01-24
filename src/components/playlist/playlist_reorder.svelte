<script>
    import { getContext } from "svelte";
    import { API } from "../../stores/api";
    import { shuffleArray, setIndexes, getPlaylistIDFromUrl } from "../../logic/helper";

    export let contextKey;

    const { dataDisplay, isEditMode } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    function handleStart() {
        $isEditMode = true;
    }

    function handleRandom() {
        $dataDisplay = shuffleArray($dataDisplay);
    }

    async function handleSave() {
        // filter out any 'removed' items
        let actual = $dataDisplay.filter(el => el.isDeleted !== true);

        let ids = actual.map((obj) => obj.id);
        let newOrders = Array.from(actual.keys(), n => n + 1);

        let result = await $API.playlistEdit({ filter: playlistID, items: ids.join(","), tracks: newOrders.join(",")} );

        if (result.success) {
            $dataDisplay = setIndexes(actual);

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


