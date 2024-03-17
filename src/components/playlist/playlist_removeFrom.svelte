<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { getContext } from "svelte";
    import { getPlaylistIDFromUrl } from "~/logic/helper.js";

    export let contextKey;

    const { dataDisplay, isEditMode, selectedCount } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    function handleRemove() {
        $dataDisplay.forEach((item, index) => {
            if (item.selected === true && !item.isDeleted) {
                $API.playlistRemoveSong({
                    filter: playlistID,
                    song: item.id,
                }).then((result) => {
                    if (result.error) {
                        console.error(
                            "Ample error removing playlist song:",
                            result.error,
                        );
                        return;
                    }

                    if (result.success) {
                        item.selected === false;
                        $selectedCount--;
                        item.isDeleted = true;
                        $dataDisplay[index] = item;

                        // get all proceeding items
                        let proceedingItems = $dataDisplay.filter(
                            (e) => e.initialOrder > item.initialOrder,
                        );

                        proceedingItems.forEach((p) => {
                            p.initialOrder--;
                        });
                    }
                });
            }
        });
    }
</script>

<sl-button
    disabled={$isEditMode || $selectedCount < 1}
    on:click={handleRemove}
    title={$_("text.remove")}
    variant="danger"
>
    {$_("text.remove")}
</sl-button>

<style>
</style>
