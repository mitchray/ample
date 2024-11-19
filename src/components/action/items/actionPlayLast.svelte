<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { contextKey } = $props();

    const { getSongs, _displayMode } = getContext(contextKey);

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        $MediaPlayer.playLast(songs);
        loading = false;
    }
</script>

<sl-button
    {loading}
    onclick={handleAction}
    size={$_displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.playLast")}
>
    <MaterialSymbol name="add" slot="prefix" />
</sl-button>
