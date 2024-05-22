<script>
    import { onMount } from "svelte";
    import { CurrentMedia } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";

    let seekWidth;
    let currentTime;
    let isPressed = false;
    let progressSlider;
    let endTime;

    // restart for each new media item
    $: $CurrentMedia, requestAnimationFrame(updateProgress);

    function updateProgress() {
        if ($CurrentMedia?.object_type === "live_stream") {
            return;
        }

        endTime = $MediaPlayer.getDuration();
        currentTime = $MediaPlayer.getCurrentTime();
        let ratio = (currentTime / endTime) * 100;
        seekWidth = Number.isFinite(ratio) ? ratio : 0;

        requestAnimationFrame(updateProgress);
    }

    function handleSeekMouseDown() {
        isPressed = true;
        document.addEventListener("mouseup", handleSeekMouseUp);
    }

    function handleSeekTouchDown() {
        isPressed = true;
        document.addEventListener("touchend", handleSeekTouchUp);
    }

    function handleSeekMouseUp() {
        isPressed = false;
        document.removeEventListener("mouseup", handleSeekMouseUp);
        progressSlider.classList.remove("dragging");
    }

    function handleSeekTouchUp() {
        isPressed = false;
        document.removeEventListener("touchend", handleSeekTouchUp);
        progressSlider.classList.remove("dragging");
    }

    function handleSeekDrag(event) {
        if (isPressed) {
            progressSlider.classList.add("dragging");
            requestAnimationFrame(function () {
                handleSeek(event);
            });
        }
    }

    function handleSeek(event) {
        let seekElementWidth = event.target.offsetWidth;
        let seekClickLocation =
            (event.clientX || event.targetTouches[0].screenX) -
            event.target.getBoundingClientRect().left;

        let seekFraction = seekClickLocation / seekElementWidth;

        $MediaPlayer.seekTo(seekFraction);
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

{#if $CurrentMedia?.object_type === "live_stream"}
    <div class="seekBar streaming"></div>
{:else}
    <div
        class="seekBar"
        bind:this={progressSlider}
        on:click={handleSeek}
        on:mousedown={handleSeekMouseDown}
        on:touchstart={handleSeekTouchDown}
        on:mousemove={handleSeekDrag}
        on:touchmove|passive={handleSeekDrag}
    >
        <span
            class="progress"
            style="transform: translateX({seekWidth}%)"
        ></span>
    </div>
{/if}

<style>
    .seekBar {
        display: block;
        height: var(--size-seekbar-height);
        position: relative;
        background-color: var(--color-outline-variant);
        z-index: 100; /* make sure it is above waveform else it interferes with mouse */
        will-change: z-index;
    }

    /* increase clickable area of seekbar */
    .seekBar:after {
        content: "";
        height: 30px;
        background-color: transparent;
        width: 100%;
        display: block;
        position: absolute;
        inset-block-start: 50%;
        transform: translateY(-50%);
        z-index: 100;
    }

    .seekBar:not(.streaming) {
        cursor: pointer;
    }

    .seekBar.streaming {
        background-image: repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 1rem,
            var(--color-inverse-primary) 1rem,
            var(--color-inverse-primary) 2rem
        );
        background-size: 200% 200%;
        animation: barberpole 120s linear infinite;
    }

    @keyframes barberpole {
        100% {
            background-position: 100% 100%;
        }
    }

    .progress {
        background-color: var(--color-waveform);
        position: absolute;
        inset-inline-end: 100%;
        inset-block-end: 0;
        inset-block-start: 0;
        width: 100%;
        will-change: transform;
    }

    /* while dragging increase the active area  */
    :global(.dragging.seekBar:after) {
        height: 200px !important;
    }

    :global(.dragging.seekBar) {
        z-index: 300; /* above all player items */
    }
</style>
