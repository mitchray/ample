<script>
    import { getContext} from "svelte";
    import { getSongsFromPlaylist } from "../../logic/song";

    export let contextKey;

    const { dataDisplay } = getContext(contextKey);

    // TODO consolidate playlistID getter
    let urlParts = location.href.split("/"); // 'location' is inherited from Router automatically
    let playlistID = urlParts.pop() || urlParts.pop(); // trick to handle potential trailing slash

    async function handleRefresh() {
        let results = await getSongsFromPlaylist(playlistID);

        if (results) {
            // TODO consolidate as a helper method
            // redo the indexes
            for (let i = 0; i < results.length; i++) {
                results[i].initialOrder = i;
            }

            $dataDisplay = results;
        }
    }
</script>

<button class="button button--regular" type="button" title="Refresh" on:click={handleRefresh}>Refresh</button>