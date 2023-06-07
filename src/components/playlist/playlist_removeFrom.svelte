<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../../stores/api";
    import { getContext } from "svelte";
    import { getPlaylistIDFromUrl } from "../../logic/helper";

    export let contextKey;

    const { dataDisplay, isEditMode, selectedCount } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    function handleRemove() {
        $dataDisplay.forEach((item, index) => {
            if (item.selected === true && !item.isDeleted) {
                $API.playlistRemoveSong({
                    filter: playlistID,
                    song: item.id
                }).then((result) => {
                    if (result.success) {
                        item.selected === false;
                        $selectedCount--;
                        item.isDeleted = true;
                        $dataDisplay[index] = item;

                        // get all proceeding items
                        let proceedingItems = $dataDisplay.filter(e => e.initialOrder > item.initialOrder);

                        proceedingItems.forEach((p, index) => {
                            p.initialOrder--;
                        })
                    }
                })
            }
        });
    }
</script>

<button class="button button--danger" type="button" title="{$_('text.remove')}" disabled={$isEditMode || $selectedCount < 1} on:click={handleRemove}>{$_('text.remove')}</button>

<style>

</style>