<script>
    import { onMount } from "svelte";
    import WaveSurfer from "wavesurfer.js";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    let wavesurfer;
    let audioElement = new Audio({
        crossorigin: "anonymous",
        crossOrigin: "anonymous",
    });

    onMount(async () => {
        wavesurfer = new WaveSurfer({
            container: "#waveformtest",
            waveColor: "#888888",
            progressColor: "cyan",
            autoplay: true,
            normalize: true,
            dragToSeek: true,
            media: audioElement,
            height: "auto",
            fillParent: true,
            barWidth: 2,
            barAlign: "bottom",
            barGap: 1,
            cursorWidth: 0,
        });
    });
</script>

<div id="waveformtest"></div>

<button on:click={wavesurfer?.playPause()}>Toggle Play/Pause</button>

<button
    on:click={() => {
        wavesurfer?.pause();
        $API.liveStream({ filter: 2 }).then((r) => {
            if (r.error) {
                errorHandler("getting live stream", r.error);
            }

            console.debug(r);
            //wavesurfer?.empty();
            audioElement.src = r.url;
            wavesurfer?.play();
        });
    }}
>
    Load Radio
</button>

<button
    on:click={() => {
        wavesurfer?.pause();
        $API.podcastEpisode({ filter: 672 }).then((r) => {
            if (r.error) {
                errorHandler("getting podcast episode:", r.error);
            }

            console.debug(r);
            audioElement.src = r.url;
            wavesurfer?.play();
        });
    }}
>
    Load Podcast
</button>

<button
    on:click={() => {
        wavesurfer?.pause();
        $API.stream({ id: 35209, type: "song", format: "raw" }).then((r) => {
            if (r.error) {
                errorHandler("getting stream:", r.error);
            }

            console.debug(r);
            wavesurfer?.loadBlob(r);
        });
    }}
>
    Load Song (stream blob)
</button>

<button
    on:click={() => {
        wavesurfer?.pause();
        $API.song({ filter: 35209 }).then((r) => {
            if (r.error) {
                errorHandler("getting song:", r.error);
            }

            console.debug(r);
            audioElement.src = r.url;
            wavesurfer?.play();
        });
    }}
>
    Load Song (url)
</button>
