<script>
    import { onMount } from 'svelte';

    import { MediaPlayer } from "../../stores/player";

    import { formatSongLength } from "../../logic/helper";

    let seekWidth;
    let currentTime;
    let isPressed = false;
    let progressSlider;

    function updateProgress() {
        seekWidth = ($MediaPlayer.wavesurfer) ? ($MediaPlayer.wavesurfer.getCurrentTime()/$MediaPlayer.wavesurfer.getDuration())*100 : 0;
        currentTime = ($MediaPlayer.wavesurfer) ? $MediaPlayer.wavesurfer.getCurrentTime() : 0;

        requestAnimationFrame(updateProgress);
    }

    function handleSeekMouseDown(event) {
        isPressed = true;
        document.addEventListener('mouseup', handleSeekMouseUp);
    }

    function handleSeekTouchDown(event) {
        isPressed = true;
        document.addEventListener('touchend', handleSeekTouchUp);
    }

    function handleSeekMouseUp(event) {
        isPressed = false;
        document.removeEventListener('mouseup', handleSeekMouseUp);
        progressSlider.classList.remove("dragging");
    }

    function handleSeekTouchUp(event) {
        isPressed = false;
        document.removeEventListener('touchend', handleSeekTouchUp);
        progressSlider.classList.remove("dragging");
    }

    function handleSeekDrag(event) {
        if (isPressed) {
            progressSlider.classList.add("dragging");
            requestAnimationFrame(function() {
                handleSeek(event);
            });
        }
    }

    function handleSeek(event) {
        let seekElementWidth = event.target.offsetWidth;
        let seekClickLocation = (event.clientX || event.targetTouches[0].screenX) - event.target.getBoundingClientRect().left;

        if ($MediaPlayer.wavesurfer) {
            let seekFraction = seekClickLocation / seekElementWidth;

            $MediaPlayer.wavesurfer.seekTo(seekFraction);
        }
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

<div class="seekBar"
    bind:this={progressSlider}
    on:click={handleSeek}
    on:mousedown={handleSeekMouseDown}
    on:touchstart={handleSeekTouchDown}
    on:mousemove={handleSeekDrag}
    on:touchmove={handleSeekDrag}
>
    <span class="progress" data-value="{formatSongLength(currentTime)}" style="transform: translateX({seekWidth}%)"></span>
</div>

<style>
    .seekBar {
        display: block;
        height: var(--size-seekbar-height);
        position: relative;
        cursor: pointer;
        background-color: var(--color-border);
        border-top: 1px solid var(--color-background);
        z-index: 100; /* make sure it is above waveform else it interferes with mouse */
        will-change: z-index;
    }

    /* increase clickable area of seekbar */
    .seekBar:after {
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

    .progress {
        background-color: var(--color-highlight);
        position: absolute;
        right: 100%;
        bottom: 0;
        top: 0;
        transition: transform linear 200ms;
        width: 100%;
    }

    /* seekbar time indicator popup */
    .progress:before {
        opacity: 0;
        top: calc(50% - 20px);
    }

    /* seekbar time ball */
    .progress:after {
        content: '';
        width: 12px;
    }

    /* while dragging increase the active area  */
    :global(.dragging.seekBar:after) {
        height: 200px !important;
    }

    :global(.dragging.seekBar) {
        z-index: 300; /* above all player items */
    }
</style>