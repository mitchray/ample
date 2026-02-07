<script>
    /**
     * A pseudo-<Actions> component, as the $CurrentMedia has special conditions
     * and the player has unique menu items
     */

    import { CurrentMedia } from "~/stores/state.js";
    import PlaybackSpeed from "~/components/player/player_playbackSpeed.svelte";
    import Lyrics from "~/components/action/items/actionLyrics.svelte";
    import Visualizer from "~/components/action/items/actionVisualizer.svelte";
    import AddToPlaylist from "~/components/action/items/actionPlaylistAddTo.svelte";
    import FindDuplicates from "~/components/action/items/actionFindDuplicates.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    const actionContext = {
        getSongs: () => [$CurrentMedia],
    };
</script>

<sl-dropdown>
    <sl-button slot="trigger" variant="text">
        <MaterialSymbol name="more_horiz" />
    </sl-button>

    <sl-menu>
        <AddToPlaylist
            {actionContext}
            disabled={$CurrentMedia?.object_type !== "song"}
        />

        {#if $CurrentMedia?.object_type === "song"}
            <FindDuplicates item={$CurrentMedia} />
        {/if}

        <Visualizer />

        <Lyrics disabled={$CurrentMedia?.object_type !== "song"} />

        <PlaybackSpeed />
    </sl-menu>
</sl-dropdown>
