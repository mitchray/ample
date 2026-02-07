<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext } = $props();

    const { getSongs, displayMode } = actionContext;

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        $MediaPlayer.playNext(songs);
        loading = false;
    }
</script>

<sl-button
    {loading}
    onclick={handleAction}
    size={displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.playNext")}
>
    <MaterialSymbol name="skip_next" slot="prefix" />
</sl-button>
