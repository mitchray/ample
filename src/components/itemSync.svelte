<script>
    import { User, Server } from "~/stores/state.js";
    import { Saved } from "~/stores/settings.js";

    let timer;

    // Creating new web worker using constructor
    const worker = new Worker(
        new URL("/js/workers/refreshArtists.js", import.meta.url),
        { type: "module" },
    );

    // On response
    worker.onmessage = async function (e) {
        await $Saved.setItem("allArtists", e.data.allArtists);
        await $Saved.setItem("groupedArtists", e.data.groupedArtists);
        await $Saved.setItem("allAlbumArtists", e.data.allAlbumArtists);
        await $Saved.setItem("groupedAlbumArtists", e.data.groupedAlbumArtists);
        await $Saved.setItem("allAlbums", e.data.allAlbums);
        await $Saved.setItem("groupedAlbums", e.data.groupedAlbums);
        //console.log("Web Worker: Updated web worker");
    };

    $: {
        if ($User.token && $Server.url && $User.isLoggedIn) {
            let message = {
                serverURL: $Server.url,
                userToken: $User.token,
            };

            // Sending the message using postMessage
            worker.postMessage(message);

            if (!timer) {
                timer = window.setInterval(
                    function () {
                        worker.postMessage(message);
                    },
                    1000 * 60 * 10,
                );
            }
        } else {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }
    }
</script>
