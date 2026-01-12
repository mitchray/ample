<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import { shuffleArray } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { contextKey } = $props();

    const { getSongs, _showShuffle } = getContext(contextKey);

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        songs = await shuffleArray(songs);
        $MediaPlayer.playNext(songs);
        loading = false;
    }
</script>

{#if $_showShuffle}
    <sl-menu-item
        onclick={handleAction}
        title={$_("text.shuffleNext")}
        {loading}
    >
        <MaterialSymbol name="shuffle" slot="prefix" />
        {$_("text.shuffleNext")}
    </sl-menu-item>
{/if}
