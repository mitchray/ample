<script>
    import { removeFromPlaylist } from '../../logic/playlist';
    import { getContext } from "svelte";

    export let contextKey;
    export let items = [];

    const { isEditMode, selectedCount } = getContext(contextKey);

    // TODO consolidate playlistID getter
    let urlParts = location.href.split("/"); // 'location' is inherited from Router automatically
    let playlistID = urlParts.pop() || urlParts.pop(); // trick to handle potential trailing slash

    function handleRemove() {
        items.forEach((item, index) => {
            if (item.selected === true && !item.isDeleted) {
                let result = removeFromPlaylist({
                    playlistID: playlistID,
                    songID: item.id
                }).then((result) => {
                    if (result.success) {
                        item.selected === false;
                        $selectedCount--;
                        item.isDeleted = true;
                        items[index] = item;

                        // get all proceeding items
                        let proceedingItems = items.filter(e => e.initialOrder > item.initialOrder);

                        proceedingItems.forEach((p, index) => {
                            p.initialOrder--;
                        })
                    }
                })
            }
        });
    }
</script>

<button class="button button--danger" type="button" title="Remove selected" disabled={$isEditMode || $selectedCount < 1} on:click={handleRemove}>Remove</button>

<style>

</style>