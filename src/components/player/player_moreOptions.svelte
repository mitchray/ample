<script>
    /**
     * A pseudo-<Actions> component, as the $CurrentMedia has special conditions
     * and the player has unique menu items
     */

    import { setContext } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { CurrentMedia } from "~/stores/state.js";
    import PlaybackSpeed from "~/components/player/player_playbackSpeed.svelte";
    import Lyrics from "~/components/action/items/actionLyrics.svelte";
    import Visualizer from "~/components/action/items/actionVisualizer.svelte";
    import AddToPlaylist from "~/components/action/items/actionPlaylistAddTo.svelte";
    import FindDuplicates from "~/components/action/items/actionFindDuplicates.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    const contextKey = uuidv4(); // unique key passing context

    setContext(contextKey, {
        getSongs: () => [$CurrentMedia],
    });
</script>

<sl-dropdown>
    <sl-button slot="trigger" variant="text">
        <MaterialSymbol name="more_horiz" />
    </sl-button>

    <sl-menu>
        <AddToPlaylist
            {contextKey}
            disabled={$CurrentMedia?.object_type !== "song" || null}
        />

        {#if $CurrentMedia?.object_type === "song"}
            <FindDuplicates item={$CurrentMedia} />
        {/if}

        <Visualizer />

        <Lyrics
            {contextKey}
            disabled={$CurrentMedia?.object_type !== "song" || null}
        />

        <PlaybackSpeed />
    </sl-menu>
</sl-dropdown>
