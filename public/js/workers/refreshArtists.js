// Waits for any activity from the page
let serverURL;
let userToken;
let APIVersion;
let final = {};

onmessage = async function(message) {
    userToken = message.data.userToken;
    APIVersion = message.data.APIVersion;
    serverURL = message.data.serverURL;

    // Do work
    final.allArtists = await getAllArtists();
    final.allAlbumArtists = final.allArtists.filter((item) => item.albumcount > 0);

    final.groupedArtists = group(final.allArtists);
    final.groupedAlbumArtists = group(final.allAlbumArtists);

    // Posting back to the page
    self.postMessage(final);
}
// Terminate with: worker.terminate()

const fetchArtistData = async (url) => {
    return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                return (data.artist) ? data.artist : data;
            } else {
                return [];
            }
        })
        .catch(err => {
            console.log("Error Reading data " + err);
            return err;
        });
}

const getAllArtists = async () => {
    let queryURL = serverURL + "/server/json.server.php?action=advanced_search";
    queryURL += "&type=artist";
    queryURL += "&offset=0";
    queryURL += "&limit=0";
    queryURL += "&operator=and&rule_1=title&rule_1_operator=5&rule_1_input=" + "";
    queryURL += "&auth=" + userToken + "&version=" + APIVersion;

    return fetchArtistData(queryURL);
}

function group(arr) {
    let result = arr.reduce((store, artist) => {
        let letter = artist.name.replace(/^(the |a |an |\p{P}+)/giu, '').charAt(0).toLowerCase();

        if (letter.match(/[0-9]/g)) {
            letter = "#";
        }

        const keyStore = (store[letter] || (store[letter] = [])); // assign to letter or create if needed

        keyStore.push(artist);

        return store;
    }, {});

    const ordered = Object.keys(result).sort().reduce(
        (obj, key) => {
            obj[key] = result[key];
            return obj;
        },
        {}
    );

    return ordered;
}