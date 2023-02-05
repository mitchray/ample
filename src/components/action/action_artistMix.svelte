<script>
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { MediaPlayer } from "../../stores/player";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import { getSongsFromArtists } from "../../logic/song";
    import { getAlbum } from "../../logic/album";
    import { getArtist } from "../../logic/artist";
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
        let artists  = await $API.getSimilar({ type: "artist", filter: artistID, limit: 20 });
        let baseArtist   = await getArtist({id: artistID});

        if (baseArtist) {
            artists.push(baseArtist);
        }

        let songs = await getSongsFromArtists(artists);
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
                tempID = song[0].artist.id;
                break;
            default:
                break;
        }

        return tempID;
    }
</script>

{#if show}
    <button
        type="button"
        class="icon-button button--secondary"
        on:click={handleAction}
        title="Start Artist Mix"
        use:loadingSpinner={loaded}
    >
        <SVGRadio />
    </button>
{/if}