<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { contextKey } = $props();

    const { _item, _data } = getContext(contextKey);

    let loading = $state(false);

    async function handleAction() {
        loading = true;
        let songs = $_data.allSongs();
        let index = songs.findIndex((song) => song.id === $_item.id);
        if (index === -1) return;
        $MediaPlayer.playNow(songs.slice(index));
        loading = false;
    }
</script>

<sl-menu-item onclick={handleAction} title={$_("text.playFromHere")} {loading}>
    <MaterialSymbol name="play_arrow" slot="prefix" />
    {$_("text.playFromHere")}
</sl-menu-item>
