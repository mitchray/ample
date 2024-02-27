<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { getSongsFromPlaylist } from "~/logic/song.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { prepareForQueue } from "~/logic/helper.js";

    export let contextKey;

    const { _type, _item } = getContext(contextKey);

    let loading = false;
    let show =
        $_type === "artist" ||
        $_type === "album" ||
        $_type === "song" ||
        $_type === "playlist_songs";

    async function handleAction() {
        loading = true;

        let artistID = await getArtistID();
        let songs = await getSongsFromPlaylist({
            id: artistID,
            type: "artist_mix",
        });

        songs = prepareForQueue(songs);

        $MediaPlayer.playNow(songs);
        loading = false;
    }

    async function getArtistID() {
        let tempID;

        switch ($_type) {
            case "artist":
                tempID = $_item.id;
                break;
            case "album":
                let album = await $API.album({ filter: $_item.id });

                if (album.error) {
                    console.error("Ample error getting album:", album.error);
                    return null;
                }

                tempID = album.artist.id;
                break;
            case "song":
            case "playlist_songs":
                let song = await $API.song({ filter: $_item.id });

                if (song.error) {
                    console.error("Ample error getting song:", song.error);
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
        on:click={handleAction}
        title={$_("text.startArtistMix")}
        {loading}
    >
        <MaterialSymbol name="swap_calls" slot="prefix" />
        {$_("text.startArtistMix")}
    </sl-menu-item>
{/if}
