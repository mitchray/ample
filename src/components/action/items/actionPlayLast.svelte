<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { getSongs, _displayMode } = getContext(contextKey);

    let loading = false;

    async function handleAction() {
        loading = true;
        let songs = await getSongs();
        $MediaPlayer.playLast(songs);
        loading = false;
    }
</script>

<sl-button
    {loading}
    on:click={handleAction}
    size={$_displayMode === "miniButtons" ? "small" : "medium"}
    title={$_("text.playLast")}
>
    <MaterialSymbol name="add" slot="prefix" />
</sl-button>
