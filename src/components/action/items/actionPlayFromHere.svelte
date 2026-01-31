<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getContext } from "svelte";
    import { MediaPlayer } from "~/stores/elements.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { addAlert } from "~/logic/alert.js";

    let { contextKey } = $props();

    const { getSongList, _item, _hasTabulator, _tabulator } = getContext(contextKey);

    async function handleAction() {
        // Get all songs (respecting sort order via previous fix)
        let songs = await getSongList();
        let currentItem = $_item;
        let hasTab = _hasTabulator ? _hasTabulator() : "N/A";
        let tabObj = _tabulator ? _tabulator() : "null";

        if (!songs || songs.length === 0) return;

        if (!currentItem) {
            console.warn("Play From Here: currentItem is missing");
            return;
        }

        // Find index of current item
        let index = songs.findIndex((s) => s && s.id === currentItem.id);

        if (index !== -1) {

            // Slice from current item to the end
            let songsFromHere = songs.slice(index);

            // Replace queue and play
            $MediaPlayer.playNow(songsFromHere);
        } else {
            // If item not found (edge case), just play it alone or do nothing
            // But realistically it should be in the list if we clicked it
            console.warn("Play From Here: Item not found in current list");
        }
    }
</script>

<sl-menu-item onclick={handleAction}>
    <MaterialSymbol name="play_arrow" slot="prefix" />
    Play From Here
</sl-menu-item>
