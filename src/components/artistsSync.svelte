<script>
    import { userToken } from "../stores/user";
    import { allArtists, groupedArtists, allAlbumArtists, groupedAlbumArtists, APIVersion, serverURL } from "../stores/server";

    // Creating new web worker using constructor
    const worker = new Worker(new URL('/js/workers/refreshArtists.js', import.meta.url));

    // On response
    worker.onmessage = async function(e) {
        allArtists.set(e.data.allArtists);
        groupedArtists.set(e.data.groupedArtists);

        allAlbumArtists.set(e.data.allAlbumArtists);
        groupedAlbumArtists.set(e.data.groupedAlbumArtists);

        //console.log('Web Worker: Updated artists');
    };

    $: {
        if ($userToken && $APIVersion && $serverURL) {
            let message = {
                serverURL: $serverURL,
                userToken: $userToken,
                APIVersion: $APIVersion,
            };

            // Sending the message using postMessage
            worker.postMessage(message);

            window.setInterval(function(){
                worker.postMessage(message);
            }, 1000*60*10);
        }
    }
</script>