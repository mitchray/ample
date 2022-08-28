<script>
    import { getContext} from "svelte";
    import { getSongsFromPlaylist } from "../../logic/song";
    import { setIndexes, getPlaylistIDFromUrl } from "../../logic/helper";

    export let contextKey;

    const { dataDisplay } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    async function handleRefresh() {
        let results = await getSongsFromPlaylist({id: playlistID});

        if (results) {
            $dataDisplay = setIndexes(results);
        }
    }
</script>

<button class="button button--regular" type="button" title="Refresh" on:click={handleRefresh}>Refresh</button>