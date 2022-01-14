<script>
    import { onMount } from 'svelte';

    import { MediaPlayer } from '../../stores/player';
    import { NowPlayingQueue, IsPlaying, CurrentSong, RepeatEnabled } from "../../stores/status";

    import { formatSongLength } from "../../logic/helper";

    import Rating from '../rating.svelte';
    import PlayerSeekBar from './player_seekBar.svelte';
    import PlayerNowPlaying from './player_nowPlaying.svelte';
    import PlayerQueue from './player_queue.svelte';
    import PlayerVolume from '../player/player_volume.svelte';
    import PlayerAutoPlay from '../player/player_autoPlay.svelte';

    import SVGPlay from "../../../public/images/play.svg";
    import SVGPause from "../../../public/images/pause.svg";
    import SVGNext from "../../../public/images/skip_next.svg";
    import SVGPrevious from "../../../public/images/skip_previous.svg";
    import SVGShuffle from "../../../public/images/shuffle.svg";
    import SVGRepeat from "../../../public/images/repeat.svg";

    let duration;
    let currentTime;
    let timeToggled = false;

    function updateProgress() {
        duration = ($MediaPlayer.wavesurfer) ? parseInt($MediaPlayer.wavesurfer.getDuration()) || 0 : 0;
        currentTime = ($MediaPlayer.wavesurfer) ? parseInt($MediaPlayer.wavesurfer.getCurrentTime()) || 0 : 0;

        requestAnimationFrame(updateProgress);
    }

    function handleTimeToggle() {
        timeToggled = !timeToggled;
    }

    onMount(() => {
        requestAnimationFrame(updateProgress);
    });
</script>

<div class="site-player">
    <PlayerSeekBar />

    <div class="site-player__controls">
        <button
            class="icon-button"
            on:click={(e) => { $MediaPlayer.previous(e) }}
            disabled={$NowPlayingQueue.length === 0}
        >
            <SVGPrevious />
        </button>

        <button
            class="icon-button button--regular play"
            on:click={$MediaPlayer.playPause()}
            disabled={$NowPlayingQueue.length === 0}
        >
            {#if $IsPlaying}
                <SVGPause style="transform: scale(1.3);" />
            {:else}
                <SVGPlay style="transform: scale(1.3);" />
            {/if}
        </button>

        <button
            class="icon-button"
            on:click={(e) => { $MediaPlayer.next(e) }}
            disabled={$NowPlayingQueue.length === 0}
        >
            <SVGNext />
        </button>
    </div>

    <div class="site-player__now-playing">
        <PlayerNowPlaying/>
    </div>

    <div class="site-player__waveform">
        <div id="waveform"></div>
    </div>

    <div class="site-player__rating">
        {#if $CurrentSong}
            <Rating type="song" id="{$CurrentSong.id}" rating="{$CurrentSong.rating}" flag="{$CurrentSong.flag}" averageRating="{$CurrentSong.averagerating}" />
        {/if}
    </div>

    <div class="site-player__times">
        {#if $CurrentSong}
            <span on:click={handleTimeToggle}>
                {#if timeToggled}
                    -{formatSongLength(duration - currentTime)}
                {:else}
                    {formatSongLength(currentTime)}
                {/if}

                / {formatSongLength(duration)}
            </span>
        {/if}
    </div>

    <div class="site-player__volume">
       <PlayerVolume />
    </div>

    <div class="site-player__secondary-controls">
        <button
            class="icon-button icon-repeat"
            class:active={$RepeatEnabled}
            on:click={$MediaPlayer.repeat()}
            title="Repeat"
        >
            <SVGRepeat style="transform: scale(0.85);" />
        </button>

        <button
            class="icon-button icon-shuffle"
            on:click={$MediaPlayer.shuffle()}
            disabled={$NowPlayingQueue.length === 0}
            title="Shuffle"
        >
            <SVGShuffle style="transform: scale(0.85);" />
        </button>

        <PlayerAutoPlay />
    </div>

    <div class="site-player__queue">
        <PlayerQueue />
    </div>
</div>

<style>
    .play {
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .site-player {
        background-color: var(--color-interface);
        border-top: 1px solid var(--color-border);
        height: var(--size-webplayer-height);
        display: grid;
        grid-template-areas:
            "main-controls now-playing SPACER1 times    SPACER2  secondary-controls SPACER4 queue"
            "main-controls now-playing SPACER1 waveform waveform waveform           SPACER4 queue"
            "main-controls now-playing SPACER1 rating   SPACER3  volume             SPACER4 queue"
        ;
        grid-template-columns: var(--size-sidebar-width) 2fr var(--spacing-lg) auto var(--spacing-lg) auto var(--spacing-lg) 250px;
        grid-template-rows: 1fr 1fr 1fr;
        align-items: center;
        padding: 0;
        z-index: 100;
        position: relative;
    }

    .site-player__controls {
        grid-area: main-controls;
        gap: var(--spacing-sm);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .site-player__now-playing {
        grid-area: now-playing;
        height: 100%;
        overflow: hidden;
    }

    .site-player__waveform {
        grid-area: waveform;
        min-height: 100%;
        cursor: pointer;
        position: relative;
    }

    #waveform {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    #waveform > :global(wave) {
        height: 100% !important;
    }

    .site-player__rating {
        grid-area: rating;
        display: flex;
        justify-content: space-around;
    }

    .site-player__times {
        grid-area: times;
        display: flex;
        justify-content: space-around;
        align-self: center;
    }

    .site-player__volume {
        grid-area: volume;
        display: flex;
        align-items: center;
        transform: scale(0.8);
    }

    .site-player__secondary-controls {
        grid-area: secondary-controls;
        gap: var(--spacing-sm);
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.8);
        position: relative;
        z-index: 200;
    }

    .site-player__queue {
        grid-area: queue;
    }

    :global(.dragging .site-player__volume-value:before),
    :global(.dragging .site-player__progress:before),
    :global(.site-player__seekBar:hover .site-player__progress:before){
        opacity: 1 !important;
    }

    :global(.dragging .site-player__progress),
    :global(.dragging .site-player__volume-value) {
        transition: none !important;
    }

    :global(.site-player__volume-value:before),
    :global(.site-player__volume-value:after),
    :global(.site-player__progress:after),
    :global(.site-player__progress:before) {
        content: '';
        height: 12px;
        min-width: 12px;
        background-color: var(--color-text-primary);
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%) translateX(50%);
        border-radius: 99px;
    }

    /* value popups */
    :global(.site-player__volume-value:before),
    :global(.site-player__progress:before) {
        width: 6ch;
        content: attr(data-value);
        font-size: 10px;
        font-weight: 700;
        text-align: center;
        line-height: 12px;
        color: var(--color-background);
    }

    @media all and (min-width: 1300px) {
        .site-player {
            grid-template-areas:
            "main-controls now-playing SPACER1 times  SPACER2 waveform SPACER3 secondary-controls SPACER4 queue"
            "main-controls now-playing SPACER1 rating SPACER2 waveform SPACER3 volume             SPACER4 queue";
            grid-template-columns: var(--size-sidebar-width) 1fr var(--spacing-xl) min-content var(--spacing-xl) 1fr var(--spacing-xl) min-content var(--spacing-xl) 250px;
            grid-template-rows: 1fr 1fr;
        }

        .site-player:before {
            background-color: var(--color-card-primary);
            box-shadow: var(--shadow-sm);
            border-radius: 5px;
            content: '';
            grid-column-start: now-playing;
            grid-column-end: times;
            display: block;
            position: absolute;
            top: 12px;
            bottom: 12px;
            left: 0;
            right: 0;
            z-index: -1;
        }

        .site-player__times {
            padding-top: var(--spacing-lg);
        }

        .site-player__rating {
            padding-bottom: var(--spacing-lg);
        }

        .site-player__times,
        .site-player__rating {
            padding-right: var(--spacing-md);
        }

        #waveform {
            padding: var(--spacing-md) 0;
        }

        .site-player__times span {
            margin-left: auto;
        }

        .site-player__volume,
        .site-player__secondary-controls {
            transform: unset;
        }

        .site-player__secondary-controls {
            margin-top: var(--spacing-sm);
        }

        .site-player__volume {
            margin-bottom: var(--spacing-sm);
        }
    }

    @media all and (min-width: 1700px) {
        .site-player {
            grid-template-columns: var(--size-sidebar-width) 2fr var(--spacing-xxl) min-content var(--spacing-xxl) 4fr var(--spacing-xxl) min-content var(--spacing-xxl) 320px;
        }
    }
</style>