<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { MediaPlayer } from "../../stores/player";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import { getSongsFromPlaylist } from "../../logic/song";
    import { getAlbum } from "../../logic/album";
    import { filterBelow } from "../../logic/helper";
    import SVGRadio from "/src/images/radio.svg";
    
    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();
    let show = (type === "artist" || type === "album" || type === "song" || type === "playlist_songs");

    async function handleAction() {
        loaded = false;

        let artistID = await getArtistID();
        let songs = await getSongsFromPlaylist({ id: artistID, type: "artist_mix" });

        $MediaPlayer.playNow(filterBelow(songs));
        loaded = true;
    }

    async function getArtistID() {
        let tempID;

        switch (type) {
            case "artist":
                tempID = id;
                break;
            case "album":
                let album = await getAlbum({id: id});
                tempID = album.artist.id;
                break;
            case "song":
            case "playlist_songs":
                let song = await $API.song({ filter: id });
                tempID = song.artist.id;
                break;
            default:
                break;
        }

        return parseInt(tempID);
    }
</script>

{#if show}
    <button
        type="button"
        class="icon-button button--secondary"
        on:click={handleAction}
        title="{$_('text.startArtistMix')}"
        use:loadingSpinner={loaded}
    >
        <SVGRadio />
    </button>
{/if}