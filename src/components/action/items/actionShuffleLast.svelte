<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import { shuffleArray } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { getSongs, _showShuffle } = getContext(contextKey);

    let loading = false;

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        songs = shuffleArray(songs);
        $MediaPlayer.playLast(songs);
        loading = false;
    }
</script>

{#if $_showShuffle}
    <sl-menu-item
        on:click={handleAction}
        title={$_("text.shuffleLast")}
        {loading}
    >
        <MaterialSymbol name="shuffle" slot="prefix" />
        {$_("text.shuffleLast")}
    </sl-menu-item>
{/if}
