<script>
    import {getContext} from "svelte";
    import {getSongsFromPlaylist} from "../../logic/song";

    export let contextKey;

    const { dataDisplay } = getContext(contextKey);

    // TODO consolidate playlistID getter
    let urlParts = location.href.split("/"); // 'location' is inherited from Router automatically
    let playlistID = urlParts.pop() || urlParts.pop(); // trick to handle potential trailing slash

    async function handleRefresh() {
        $dataDisplay = await getSongsFromPlaylist(playlistID);
    }
</script>

<button class="button button--regular" type="button" title="Refresh" on:click={handleRefresh}>Refresh</button>