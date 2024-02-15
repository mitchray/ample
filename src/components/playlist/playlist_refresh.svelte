<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { setIndexes, getPlaylistIDFromUrl } from "~/logic/helper.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";

    export let contextKey;

    const { dataDisplay } = getContext(contextKey);

    let playlistID = getPlaylistIDFromUrl();

    async function handleRefresh() {
        let results = await getSongsFromPlaylist({
            id: playlistID,
            type: "smartlist",
        });

        if (results) {
            $dataDisplay = setIndexes(results);
        }
    }
</script>

<sl-button title={$_("text.refresh")} on:click={handleRefresh}>
    {$_("text.refresh")}
</sl-button>
