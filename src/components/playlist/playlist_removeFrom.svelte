<script>
    import { removeFromPlaylist } from '../../logic/playlist';

    export let items = [];

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
                        item.isDeleted = true;
                        items[index] = item;
                    }
                })
            }
        });
    }
</script>

<button class="button button--danger" type="button" title="Remove selected" on:click={handleRemove}>Remove selected</button>

<style>

</style>