<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { actionContext } = $props();

    const { items, data } = actionContext;

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = data.allSongs?.() ?? [];
        let firstItem = items[0];
        if (!firstItem) return;
        let index = songs.findIndex((song) => song.id === firstItem.id);
        if (index === -1) return;
        $MediaPlayer.playNow(songs.slice(index));
        loading = false;
    }
</script>

<sl-menu-item onclick={handleAction} title={$_("text.playFromHere")} {loading}>
    <MaterialSymbol name="play_arrow" slot="prefix" />
    {$_("text.playFromHere")}
</sl-menu-item>
