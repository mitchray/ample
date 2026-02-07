<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext } = $props();

    const { getSongs, displayMode } = actionContext;
    const showShuffle = $derived(actionContext.showShuffle);

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        $MediaPlayer.shuffleNow(songs);
        loading = false;
    }
</script>

{#if showShuffle}
    <sl-button
        variant="primary-alt"
        onclick={handleAction}
        title={$_("text.shuffle")}
        {loading}
        size={displayMode === "miniButtons" ? "small" : "medium"}
    >
        <MaterialSymbol name="shuffle" />
        <span class="label">{$_("text.shuffle")}</span>
    </sl-button>
{/if}
