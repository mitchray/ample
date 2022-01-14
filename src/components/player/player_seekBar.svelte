<script>
    import { onMount } from 'svelte';

    import { MediaPlayer } from "../../stores/player";

    import { formatSongLength } from "../../logic/helper";

    let seekWidth;
    let currentTime;
    let mouseDown = false;
    let progressSlider;

    function updateProgress() {
        seekWidth = ($MediaPlayer.wavesurfer) ? ($MediaPlayer.wavesurfer.getCurrentTime()/$MediaPlayer.wavesurfer.getDuration())*100 : 0;
        currentTime = ($MediaPlayer.wavesurfer) ? $MediaPlayer.wavesurfer.getCurrentTime() : 0;

        requestAnimationFrame(updateProgress);
    }

    function handleSeekMouseDown(event) {
        mouseDown = true;
        document.addEventListener('mouseup', handleSeekMouseUp);
    }

    function handleSeekMouseUp(event) {
        mouseDown = false;
        document.removeEventListener('mouseup', handleSeekMouseUp);
        progressSlider.classList.remove("dragging");
    }

    function handleSeekDrag(event) {
        if (mouseDown) {
            progressSlider.classList.add("dragging");
            requestAnimationFrame(function() {
                handleSeek(event);
            });
        }
    }

    function handleSeek(event) {
        let seekElementWidth = event.target.offsetWidth;
        let seekClickLocation = event.clientX - event.target.getBoundingClientRect().left;

        if ($MediaPlayer.wavesurfer) {
            let seekFraction = seekClickLocation / seekElementWidth;
            $MediaPlayer.wavesurfer.seekTo(seekFraction);
        }
    }

    onMount(() => {
        progressSlider = document.querySelector(".site-player__seekBar");
        requestAnimationFrame(updateProgress);
    });
</script>

<div class="site-player__seekBar" on:click={handleSeek} on:mousedown={handleSeekMouseDown} on:mousemove={handleSeekDrag}>
    <span class="site-player__progress" data-value="{formatSongLength(currentTime)}" style="transform: translateX({seekWidth}vw)"></span>
</div>

<style>
    .site-player__seekBar {
        display: block;
        height: var(--size-seekbar-height);
        position: absolute;
        top: calc(-1 * var(--size-seekbar-height));
        left: 0;
        right: 0;
        cursor: pointer;
        background-color: var(--color-border);
        border-top: 1px solid var(--color-background);
        z-index: 100; /* make sure it is above waveform else it interferes with mouse */
        will-change: z-index;
    }

    /* increase clickable area of seekbar */
    .site-player__seekBar:after {
        content: '';
        height: 30px;
        background-color: transparent;
        width: 100%;
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 100;
    }

    .site-player__progress {
        background-color: var(--color-highlight);
        position: absolute;
        right: 100%;
        bottom: 0;
        top: 0;
        transition: transform linear 200ms;
        width: 100%;
    }

    /* seekbar time indicator popup */
    .site-player__progress:before {
        opacity: 0;
        top: calc(50% - 20px);
    }

    .site-player__progress:after {
        content: '';
        width: 12px;
    }

    /* while dragging increase the active area  */
    :global(.dragging.site-player__seekBar:after) {
        height: 200px !important;
    }

    :global(.dragging.site-player__seekBar) {
        z-index: 300; /* above all player items */
    }
</style>