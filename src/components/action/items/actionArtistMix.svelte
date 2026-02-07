<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { actionContext } = $props();

    const { items, apiType } = actionContext;

    let loading = $state(false);
    let show =
        apiType === "artist" ||
        apiType === "album" ||
        apiType === "song" ||
        (actionContext.type === "playlist_songs" && items.length > 0);

    async function handleAction() {
        loading = true;

        let artistID = await getArtistID();
        if (artistID == null) {
            loading = false;
            return;
        }
        let songs = await getSongsFromPlaylist({
            id: artistID,
            type: "artist_mix",
        });

        $MediaPlayer.playNow(songs);
        loading = false;
    }

    async function getArtistID() {
        let firstItem = items[0];
        if (!firstItem) return null;

        let tempID;

        switch (apiType) {
            case "artist":
                tempID = firstItem.id;
                break;
            case "album":
                let album = await $API.album({ filter: firstItem.id });

                if (album.error) {
                    errorHandler("getting album", album.error);
                    return null;
                }

                tempID = album.artist.id;
                break;
            case "song":
                let song = await $API.song({ filter: firstItem.id });

                if (song.error) {
                    errorHandler("getting song", song.error);
                    return null;
                }

                tempID = song.artist.id;
                break;
            default:
                break;
        }

        return parseInt(tempID);
    }
</script>

{#if show}
    <sl-menu-item
        onclick={handleAction}
        title={$_("text.startArtistMix")}
        {loading}
    >
        <MaterialSymbol name="swap_calls" slot="prefix" />
        {$_("text.startArtistMix")}
    </sl-menu-item>
{/if}
