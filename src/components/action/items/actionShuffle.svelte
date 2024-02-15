<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import { shuffleArray } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { getSongs, _showShuffle, _displayMode } = getContext(contextKey);

    let loading = false;

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        songs = shuffleArray(songs);
        $MediaPlayer.playNow(songs);
        loading = false;
    }
</script>

{#if $_showShuffle}
    <sl-button
        variant="primary-alt"
        on:click={handleAction}
        title={$_("text.shuffle")}
        {loading}
        size={$_displayMode === "miniButtons" ? "small" : "medium"}
    >
        <MaterialSymbol name="shuffle" />
        <span class="label">{$_("text.shuffle")}</span>
    </sl-button>
{/if}
