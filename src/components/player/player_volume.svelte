<script>
    import { _ } from "svelte-i18n";
    import { Settings } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { IsMuted, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import PlayerOptions from "~/components/player/player_options.svelte";
    import { onMount } from "svelte";

    let volumeWidth; // volume in this file is treated as a linear 0-100 value
    let mouseDown = false;
    let volumeSlider;

    async function handleMuteToggle() {
        let inverted = !$IsMuted;
        IsMuted.set(inverted);
        $MediaPlayer.setMuted(inverted);
    }

    function handleVolumeSlider(event) {
        let volumeElementWidth = event.target.offsetWidth;
        let volumeClickLocation =
            event.clientX - event.target.getBoundingClientRect().left;
        let volumeFraction = volumeClickLocation / volumeElementWidth;
        volumeWidth = volumeFraction * 100;
        volumeWidth = volumeWidth > 100 ? 100 : volumeWidth;
        volumeWidth = volumeWidth < 0 ? 0 : volumeWidth;

        $Settings.PlayerVolume = volumeWidth;
        Object.keys($MediaPlayer.players).forEach((key) => {
            $MediaPlayer.players[key].filters.masterVolume.gain.value =
                $MediaPlayer.globalVolume;
        });
    }

    function handleVolumeMouseDown() {
        mouseDown = true;
        document.addEventListener("mouseup", handleVolumeMouseUp);
        volumeSlider?.classList.add("dragging");
    }

    function handleVolumeMouseUp() {
        mouseDown = false;
        document.removeEventListener("mouseup", handleVolumeMouseUp);
        volumeSlider?.classList.remove("dragging");
    }

    function handleVolumeDrag(event) {
        if (mouseDown) {
            requestAnimationFrame(function () {
                handleVolumeSlider(event);
            });
        }
    }

    onMount(async () => {
        volumeWidth = $Settings.PlayerVolume || 50;
    });
</script>

<sl-button
    class="volume-control"
    disabled={$NowPlayingQueue.length === 0}
    on:click={handleMuteToggle}
    title={$IsMuted ? $_("text.volumeUnmute") : $_("text.volumeMute")}
    variant="text"
>
    <MaterialSymbol name={$IsMuted ? "volume_off" : "volume_up"} />
</sl-button>

<div
    bind:this={volumeSlider}
    class="site-player__volume-slider volume-control"
    on:click={handleVolumeSlider}
    on:mousedown={handleVolumeMouseDown}
    on:mousemove={handleVolumeDrag}
>
    <span
        class="site-player__volume-value"
        data-value={Math.floor(volumeWidth)}
        style="width: {volumeWidth}%"
    ></span>
</div>

<PlayerOptions />

<style>
    .overrides :global(label) {
        margin-block-start: var(--spacing-md);
        display: block;
    }

    .overrides label > input {
        margin-block-start: var(--spacing-sm);
        display: block;
    }

    .site-player__volume-slider {
        background-color: var(--color-outline-variant);
        display: flex;
        height: 4px;
        width: 100%;
        min-width: 50px;
        cursor: pointer;
        position: relative;
        border-radius: 100vh;
        justify-self: center;
        margin: 0 10px;
    }

    /* increase clickable area of volume */
    .site-player__volume-slider:after {
        content: "";
        height: 30px;
        background-color: transparent;
        width: calc(100% + 30px);
        display: block;
        position: absolute;
        opacity: 0;
        inset-block-start: 50%;
        inset-inline-start: 50%;
        transform: translateY(-50%) translateX(-50%);
        z-index: 100;
    }

    .site-player__volume-value {
        background-color: var(--color-primary);
        position: absolute;
        inset-inline-start: 0;
        inset-block-end: 0;
        inset-block-start: 0;
        transition: width linear 200ms;
        border-radius: 100vh;
    }

    /* volume value indicator popup */
    .site-player__volume-value:before {
        opacity: 0;
        inset-block-start: calc(50% - 20px);
    }
</style>
