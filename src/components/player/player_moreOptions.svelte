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
    import ActionAddToPlaylist from "~/components/action/items/actionPlaylistAddTo.svelte";
    import ActionFindDuplicates from "~/components/action/items/actionFindDuplicates.svelte";
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
        <ActionAddToPlaylist
            {contextKey}
            disabled={$CurrentMedia?.object_type !== "song" || null}
        />

        <sl-menu-item value="c" on:click={() => console.debug("share")}>
            Share <MaterialSymbol name="share" slot="prefix" />
        </sl-menu-item>
        <sl-menu-item value="c" on:click={() => console.debug("post shout")}>
            Post shout
            <MaterialSymbol name="chat" slot="prefix" />
        </sl-menu-item>
        <sl-menu-item
            value="c"
            on:click={() => console.debug("start broadcast")}
        >
            Start broadcast
            <MaterialSymbol name="cell_tower" slot="prefix" />
        </sl-menu-item>

        {#if $CurrentMedia?.object_type === "song"}
            <ActionFindDuplicates item={$CurrentMedia} />
        {/if}

        <sl-divider></sl-divider>

        <Lyrics
            {contextKey}
            disabled={$CurrentMedia?.object_type !== "song" || null}
        />

        <sl-menu-item
            value="c"
            on:click={() => console.debug("show visualizer")}
        >
            Show visualizer
            <MaterialSymbol name="browse_activity" fill={false} slot="prefix" />
        </sl-menu-item>

        <sl-divider></sl-divider>

        <PlaybackSpeed />
    </sl-menu>
</sl-dropdown>
