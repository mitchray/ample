import AmpacheAPI from "javascript-ampache";
import { errorHandler } from "~/logic/helper.js";

onmessage = async function (message) {
    const { userToken, serverURL } = message.data;
    let final = {};

    let API = new AmpacheAPI({ url: serverURL, sessionKey: userToken });

    try {
        let artistList = await API.list({ type: "artist" });
        final.groupedArtists = group(artistList.list);

        let albumArtistsList = await API.list({ type: "album_artist" });
        final.groupedAlbumArtists = group(albumArtistsList.list);

        let albumsList = await API.list({ type: "album" });
        final.groupedAlbums = group(albumsList.list);

        final.allArtists = await API.artists();
        final.allAlbumArtists = await API.artists({ album_artist: 1 });
        final.allAlbums = await API.albums();

        // Posting back to the page
        self.postMessage(final);
    } catch (e) {
        errorHandler("refreshing all items in web worker", e);
    }
};
// Terminate with: worker.terminate()

function group(arr) {
    let result = arr.reduce((store, item) => {
        let letter = item.name
            .replace(/^(the |a |an |\p{P}+)/giu, "")
            .normalize("NFD")
            .charAt(0)
            .toLowerCase(); // normalize NFD splits special chars into plain + accents

        if (letter.match(/[0-9]/g)) {
            letter = "#";
        }

        const keyStore = store[letter] || (store[letter] = []); // assign to letter or create if needed

        keyStore.push(item);

        return store;
    }, {});

    const ordered = Object.keys(result)
        .sort()
        .reduce((obj, key) => {
            obj[key] = result[key];
            return obj;
        }, {});

    return ordered;
}
