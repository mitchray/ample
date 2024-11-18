<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { getPlaylistIDFromUrl, setIndexes } from "~/logic/helper.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";

    /** @type {{contextKey: any}} */
    let { contextKey } = $props();

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

<sl-button onclick={handleRefresh} title={$_("text.refresh")}>
    {$_("text.refresh")}
</sl-button>
