<script>
    import { userToken } from "../stores/user";
    import { allArtists, APIVersion, groupedArtists, serverURL } from "../stores/server";
    import { ShowArtistType } from "../stores/status";

    // Creating new web worker using constructor
    let worker = new Worker('/ample/public/js/workers/refreshArtists.js');

    // On response
    worker.onmessage = async function(e) {
        allArtists.set(e.data.allArtists);
        groupedArtists.set(e.data.groupedArtists);

        console.log('Web Worker: Updated artists');
    };

    $: {
        if ($userToken && $APIVersion && $serverURL && $ShowArtistType) {
            let message = {
                serverURL: $serverURL,
                userToken: $userToken,
                APIVersion: $APIVersion,
                ShowArtistType: $ShowArtistType,
            };

            // Sending the message using postMessage
            worker.postMessage(message);

            window.setInterval(function(){
                worker.postMessage(message);
            }, 1000*60*10);
        }
    }
</script>