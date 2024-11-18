<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { getContext } from "svelte";
    import { errorHandler, getPlaylistIDFromUrl } from "~/logic/helper.js";

    /** @type {{contextKey: any}} */
    let { contextKey } = $props();

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
                        errorHandler("removing playlist song", result.error);
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
    onclick={handleRemove}
    title={$_("text.remove")}
    variant="danger"
>
    {$_("text.remove")}
</sl-button>

<style>
</style>
