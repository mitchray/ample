<script>
    import { getContext} from "svelte";
    import { API } from "../../stores/api";
    import { setIndexes, getPlaylistIDFromUrl } from "../../logic/helper";

    export let contextKey;

    const { dataDisplay } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    async function handleRefresh() {
        let results = await $API.playlistSongs({ filter: playlistID });

        if (results) {
            $dataDisplay = setIndexes(results);
        }
    }
</script>

<button class="button button--regular" type="button" title="Refresh" on:click={handleRefresh}>Refresh</button>