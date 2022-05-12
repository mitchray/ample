<script>
    import { onMount, tick } from 'svelte';
    import {
        CurrentSong,
        IsMuted,
        NowPlayingQueue,
        VolumeNormalizationEnabled,
        DynamicsCompressorEnabled
    } from "../../stores/status";
    import { MediaPlayer } from "../../stores/player";

    import Menu from '../../components/menu.svelte';

    import SVGVolumeUp from "../../../public/images/volume_up.svg";
    import SVGVolumeMuted from "../../../public/images/volume_off.svg";
    import SVGTune from "../../../public/images/tune.svg";

    let volumeWidth = $MediaPlayer.globalVolume * 100;
    let mouseDown = false;
    let volumeSlider;
    let menuIsVisible = false;

    let missingGainTags;
    $: missingGainTags = $CurrentSong && !$CurrentSong.r128_track_gain && !$CurrentSong.replaygain_track_gain;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    async function handleMuteToggle() {
        if ($MediaPlayer.wavesurfer) {
            IsMuted.set(!$IsMuted);
            await tick();
            $MediaPlayer.wavesurfer.setMute($MediaPlayer.isMuted);
        }
    }

    function handleVolumeNormalize() {
        let inverted = !$VolumeNormalizationEnabled;
        localStorage.setItem('VolumeNormalizationEnabled', JSON.stringify(inverted));
        VolumeNormalizationEnabled.set(inverted);
        $MediaPlayer.updateFilters();
    }

    function handleDynamicsCompressor() {
        let inverted = !$DynamicsCompressorEnabled;
        localStorage.setItem('DynamicsCompressorEnabled', JSON.stringify(inverted));
        DynamicsCompressorEnabled.set(inverted);
        $MediaPlayer.updateFilters();
    }

    function handleVolumeSlider(event) {
        let volumeElementWidth = event.target.offsetWidth;
        let volumeClickLocation = event.clientX - event.target.getBoundingClientRect().left;
        let volumeFraction = volumeClickLocation / volumeElementWidth;
        volumeWidth = (volumeFraction * 100);
        volumeWidth = (volumeWidth > 100) ? 100 : volumeWidth;
        volumeWidth = (volumeWidth < 0) ? 0 : volumeWidth;

        if ($MediaPlayer.wavesurfer) {
            $MediaPlayer.wavesurfer.setVolume(Math.pow(volumeWidth / 100, 2)); // logarithmic volume control
        }
    }

    function handleVolumeMouseDown(event) {
        mouseDown = true;
        document.addEventListener('mouseup', handleVolumeMouseUp);
        volumeSlider.classList.add("dragging");
    }

    function handleVolumeMouseUp(event) {
        mouseDown = false;
        document.removeEventListener('mouseup', handleVolumeMouseUp);
        volumeSlider.classList.remove("dragging");
    }

    function handleVolumeDrag(event) {
        if (mouseDown) {
            requestAnimationFrame(function() {
                handleVolumeSlider(event);
            });
        }
    }

    onMount(() => {
        volumeSlider = document.querySelector(".site-player__volume-slider");
    });
</script>

<button
    class="icon-button"
    on:click={handleMuteToggle}
    disabled={$NowPlayingQueue.length === 0}
    title="{$IsMuted ? 'Unmute' : 'Mute'}"
>
    {#if $IsMuted}
        <SVGVolumeMuted />
    {:else}
        <SVGVolumeUp />
    {/if}
</button>

<div
    class="site-player__volume-slider"
    on:click={handleVolumeSlider}
    on:mousedown={handleVolumeMouseDown}
    on:mousemove={handleVolumeDrag}
>
    <span class="site-player__volume-value" data-value="{Math.floor(volumeWidth)}" style="width: {volumeWidth}%">
    </span>
</div>

<button
    id="volumeMenu"
    class="icon-button"
    title="Volume settings"
    on:click={toggleMenu}
    class:notification-dot={missingGainTags}
>
    <SVGTune style="padding: 0.15em;" />
</button>

{#if menuIsVisible}
    <Menu anchor="top-center" toggleElement={document.querySelector("#volumeMenu")} bind:isVisible={menuIsVisible} >
        <div class="header panel-header">
            <h4 class="title panel-title">Volume Settings</h4>
        </div>

        <div class="panel-content">
            <div class="group">
                <label class="toggle">
                    <input type="checkbox" on:change={handleVolumeNormalize} bind:checked={$VolumeNormalizationEnabled} />
                    Normalize volume
                </label>

                <div class="info">Keeps volume consistent between different tracks</div>

                {#if $CurrentSong}
                    <div class="current">
                        <div>Current type: {$MediaPlayer.gainType}</div>

                        {#if $MediaPlayer.gainType === 'EBU R128'}
                            <div>Target volume: {$MediaPlayer.targetVolume}db</div>
                            <div>Mastered volume: {$MediaPlayer.masteredVolume}db</div>
                        {/if}

                        {#if $MediaPlayer.gainType === 'ReplayGain'}
                            <div>ReplayGain: {$MediaPlayer.gainTagValue}</div>
                        {/if}

                        <div>Gain: {$MediaPlayer.gainNeeded}db</div>
                    </div>
                {/if}
            </div>

            <div class="group">
                <label class="toggle">
                    <input type="checkbox" on:change={handleDynamicsCompressor} bind:checked={$DynamicsCompressorEnabled} />
                    Enable Night Mode
                </label>

                <div class="info">Boosts quieter parts of songs</div>
            </div>
        </div>
    </Menu>
{/if}

<style>
    .info {
        margin-top: var(--spacing-sm);
        color: var(--color-text-secondary);
    }

    .group + .group {
        padding-top: var(--spacing-lg);
    }

    .site-player__volume-slider {
        background-color: var(--color-border);
        display: flex;
        height: 4px;
        width: 100%;
        min-width: 100px;
        cursor: pointer;
        position: relative;
        border-radius: 100vh;
        justify-self: center;
        margin: 0 10px;
    }

    /* increase clickable area of volume */
    .site-player__volume-slider:after {
        content: '';
        height: 30px;
        background-color: transparent;
        width: calc(100% + 30px);
        display: block;
        position: absolute;
        opacity: 0;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);
    }

    .site-player__volume-value {
        background-color: var(--color-highlight);
        position: absolute;
        left: 0;
        bottom: 0;
        top: 0;
        transition: width linear 200ms;
        border-radius: 100vh;
    }

    /* volume value indicator popup */
    .site-player__volume-value:before {
        opacity: 0;
        top: calc(50% - 20px);
    }

    /* while dragging increase the active area, especially so it don't conflict with seekbar  */
    :global(.dragging.site-player__volume-slider:after) {
        height: 200px !important;
        padding: 0 200px;
        z-index: 100;
    }

    .current {
        background-color: var(--color-card-highlight);
        max-width: fit-content;
        padding: var(--spacing-md);
        margin-top: var(--spacing-md);
    }
</style>