<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import { shuffleArray } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext } = $props();

    const { getSongs, showShuffle } = actionContext;

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        songs = shuffleArray(songs);
        $MediaPlayer.playLast(songs);
        loading = false;
    }
</script>

{#if showShuffle}
    <sl-menu-item
        onclick={handleAction}
        title={$_("text.shuffleLast")}
        {loading}
    >
        <MaterialSymbol name="shuffle" slot="prefix" />
        {$_("text.shuffleLast")}
    </sl-menu-item>
{/if}
