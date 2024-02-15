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
        $MediaPlayer.playNext(songs);
        loading = false;
    }
</script>

<sl-button
    on:click={handleAction}
    title={$_("text.playNext")}
    {loading}
    size={$_displayMode === "miniButtons" ? "small" : "medium"}
>
    <MaterialSymbol name="menu_open" slot="prefix" />
</sl-button>
