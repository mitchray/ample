<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
    import {
        getPlaylistIDFromUrl,
        setIndexes,
        shuffleArray,
    } from "~/logic/helper.js";

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
        let actual = $dataDisplay.filter((el) => el.isDeleted !== true);

        let ids = actual.map((obj) => obj.id);
        let newOrders = Array.from(actual.keys(), (n) => n + 1);

        let result = await $API.playlistEdit({
            filter: playlistID,
            items: ids.join(","),
            tracks: newOrders.join(","),
        });

        if (result.error) {
            console.error("Ample error editing playlist:", result.error);
            return;
        }

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
    <sl-button
        variant="primary"
        title={$_("text.saveOrder")}
        on:click={handleSave}
    >
        {$_("text.saveOrder")}
    </sl-button>
    <sl-button title={$_("text.random")} on:click={handleRandom}>
        {$_("text.random")}
    </sl-button>
    <sl-button title={$_("text.cancel")} variant="text" on:click={handleCancel}>
        {$_("text.cancel")}
    </sl-button>
{:else}
    <sl-button
        class="button button--regular"
        title={$_("text.reorder")}
        on:click={handleStart}
    >
        {$_("text.reorder")}
    </sl-button>
{/if}
