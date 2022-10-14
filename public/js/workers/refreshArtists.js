// Waits for any activity from the page
let serverURL;
let userToken;
let APIVersion;
let ShowArtistType;
let final = {};

onmessage = async function(message) {
    userToken = message.data.userToken;
    APIVersion = message.data.APIVersion;
    serverURL = message.data.serverURL;
    ShowArtistType = message.data.ShowArtistType;

    // Do work
    final.allArtists = await getAllArtists();
    final.filteredArtists = (ShowArtistType === "album_artist") ? final.allArtists.filter((item) => item.albumcount > 0) : final.allArtists;

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