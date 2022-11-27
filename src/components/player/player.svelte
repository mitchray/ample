<script>
    import { MediaPlayer } from '../../stores/player';
    import { NowPlayingQueue, CurrentMedia, RepeatEnabled, FullScreenEnabled } from "../../stores/status";

    import Rating from '../rating.svelte';
    import PlayerSeekBar from './player_seekBar.svelte';
    import PlayerTimeCurrent from './player_timeCurrent.svelte';
    import PlayerTimeEnd from './player_timeEnd.svelte';
    import PlayerPrimaryControls from './player_primaryControls.svelte';
    import PlayerArtwork from './player_artwork.svelte';
    import PlayerCurrentDetails from './player_currentDetails.svelte';
    import PlayerQueue from './player_queue.svelte';
    import PlayerVolume from '../player/player_volume.svelte';
    import PlayerAutoPlay from '../player/player_autoPlay.svelte';
    import PlayerLyrics from '../player/player_lyrics.svelte';
    import PlayerSkipBelow from '../player/player_skipBelow.svelte';

    import SVGShuffle from "/src/images/shuffle.svg";
    import SVGRepeat from "/src/images/repeat.svg";
    import SVGUp from "/src/images/keyboard_arrow_up.svg";
</script>

<div class="site-player">
    <div class="site-player__seekBar">
        <PlayerSeekBar/>
    </div>

    <div class="site-player__controls">
        <PlayerPrimaryControls/>
    </div>

    <div class="site-player__now-playing">
        <PlayerArtwork/>
        <PlayerCurrentDetails/>
    </div>

    <div class="site-player__waveform">
        <div id="waveform"></div>
    </div>

    <div class="site-player__rating">
        {#if $CurrentMedia}
            <Rating type="song" id="{$CurrentMedia.id}" rating="{$CurrentMedia.rating}" flag="{$CurrentMedia.flag}" averageRating="{$CurrentMedia.averagerating}" />
        {:else}
            <Rating type="song" />
        {/if}
    </div>

    <div class="site-player__times">
        <PlayerTimeCurrent/> / <PlayerTimeEnd/>
    </div>

    <div class="site-player__volume">
       <PlayerVolume />
    </div>

    <div class="site-player__secondary-controls">
        <PlayerLyrics />

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

        <PlayerSkipBelow />
    </div>

    <div class="site-player__fullscreen">
        <button
            class="icon-button"
            on:click={() => { $FullScreenEnabled = true }}
        >
            <SVGUp />
        </button>
    </div>

    <div class="site-player__queue">
        <PlayerQueue />
    </div>
</div>

<style>
    .site-player {
        background-color: var(--color-interface);
        border-top: 1px solid var(--color-border);
        height: var(--size-webplayer-height);
        display: grid;
        grid-template-areas:
            "SPACER1 main-controls SPACER2 secondary-controls SPACER3 fullscreen SPACER4"
            "SPACER1 times         SPACER2 now-playing        SPACER3 queue      SPACER4"
            "SPACER1 rating        SPACER2 volume             SPACER3 queue      SPACER4"
        ;
        grid-template-columns: 1fr auto 1fr 2fr 1fr min-content 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        align-items: center;
        padding: 0;
        z-index: 100;
        position: relative;
    }

    .site-player__seekBar :global(.seekBar) {
        position: absolute;
        top: calc(-1 * var(--size-seekbar-height));
        left: 0;
        right: 0;
    }

    .site-player__times :global(.current) {
        text-align: right;
    }

    .site-player__controls {
        grid-area: main-controls;
        z-index: 200;
    }

    .site-player__now-playing {
        grid-area: now-playing;
        height: 100%;
        overflow: hidden;
        display: flex;
        align-items: center;
    }

    .site-player__waveform {
        grid-area: waveform;
        min-height: 100%;
        cursor: pointer;
        position: relative;
        display: none;
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
        transform: scale(0.9);
    }

    .site-player__now-playing :global(.nowPlayingArtwork) {
        height: 85%;
        border-radius: 3px;
        margin-right: var(--spacing-md);
        outline: 1px solid hsla(0, 0%, 50%, 0.2);
        outline-offset: -1px;
    }

    .site-player__times {
        grid-area: times;
        display: flex;
        justify-content: center;
        gap: var(--spacing-sm);
        align-self: center;
    }

    .site-player__volume {
        grid-area: volume;
        display: flex;
        align-items: center;
        transform: scale(0.9);
    }

    .site-player__secondary-controls {
        grid-area: secondary-controls;
        gap: var(--spacing-sm);
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(0.9);
        position: relative;
        z-index: 200;
    }

    .site-player__fullscreen {
        grid-area: fullscreen;
        justify-content: center;
        display: none;
    }

    .site-player__queue {
        grid-area: queue;
        display: flex;
        height: 100%;
    }

    :global(.dragging .site-player__volume-value:before),
    :global(.dragging .progress:before) {
        opacity: 1 !important;
    }

    @media (hover: hover) {
        :global(.seekBar:hover .progress:before) {
            opacity: 1 !important;
        }
    }

    :global(.dragging .progress),
    :global(.dragging .site-player__volume-value) {
        transition: none !important;
    }

    :global(.site-player__volume-value:before),
    :global(.site-player__volume-value:after),
    :global(.progress:after),
    :global(.progress:before) {
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
    :global(.progress:before) {
        width: 6ch;
        content: attr(data-value);
        font-size: 10px;
        font-weight: 700;
        text-align: center;
        line-height: 12px;
        color: var(--color-background);
    }

    /* mobile only tweaks */
    @media all and (max-width: 679px) {
        .site-player__times {
            top: 4px;
            position: relative;
        }

        .site-player__now-playing {
            display: flex;
            justify-content: center;
            align-self: center;
        }

        .site-player__now-playing :global(.container) {
            display: flex;
            justify-content: center;
            align-self: center;
            position: relative;
            bottom: 2px;
        }

        .site-player__now-playing :global(.nowPlayingArtwork) {
            margin-right: var(--spacing-sm);
        }

        .site-player__now-playing :global(.title) {
            margin: 0;
            --roboto-grad: 0;
            --roboto-opsz: 13;
            font-weight: 400;
        }

        .site-player__now-playing :global(.artist),
        .site-player__now-playing :global(.album) {
            display: none;
        }

        .site-player__secondary-controls {
            gap: unset;
        }

        .site-player__secondary-controls :global(.icon-button) {
            padding: 1px;
        }

        .site-player__volume :global(.site-player__volume-slider) {
            min-width: unset !important;
        }

        .site-player__fullscreen {
            display: flex;
        }
    }

    @media all and (min-width: 680px) {
        .site-player {
            grid-template-areas:
                "main-controls now-playing SPACER1 times    SPACER2  secondary-controls SPACER4 queue"
                "main-controls now-playing SPACER1 waveform waveform waveform           SPACER4 queue"
                "main-controls now-playing SPACER1 rating   SPACER3  volume             SPACER4 queue"
            ;
            grid-template-columns: auto 2fr var(--spacing-lg) auto var(--spacing-lg) auto var(--spacing-lg) auto;
            grid-template-rows: 1fr 1fr 1fr;
        }

        .site-player__now-playing :global(.nowPlayingArtwork) {
            display: none;
        }

        .site-player__waveform {
            display: flex;
        }
    }

    @media all and (min-width: 800px) {
        .site-player__now-playing :global(.nowPlayingArtwork) {
            display: block;
        }
    }

    @media all and (min-width: 1000px) {
        .site-player {
            grid-template-columns: auto 2fr var(--spacing-lg) auto var(--spacing-lg) auto var(--spacing-lg) 250px;
        }
    }

    @media all and (min-width: 1300px) {
        .site-player {
            grid-template-areas:
            "main-controls now-playing SPACER1 times  SPACER2 waveform SPACER3 secondary-controls SPACER4 queue"
            "main-controls now-playing SPACER1 rating SPACER2 waveform SPACER3 volume             SPACER4 queue";
            grid-template-columns: var(--size-sidebar-width) 320px var(--spacing-xl) min-content var(--spacing-xl) 1fr var(--spacing-xl) min-content var(--spacing-xl) 250px;
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

        .site-player__times {
            justify-content: right;
        }

        .site-player__controls,
        .site-player__rating,
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
</style>