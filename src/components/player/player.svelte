<script>
    import PlayerSeekBar from './player_seekBar.svelte';
    import PlayerTimeCurrent from './player_timeCurrent.svelte';
    import PlayerTimeEnd from './player_timeEnd.svelte';
    import PlayerPrimaryControls from './player_primaryControls.svelte';
    import PlayerArtwork from './player_artwork.svelte';
    import PlayerCurrentDetails from './player_currentDetails.svelte';
    import PlayerQueue from './player_queue.svelte';
    import PlayerVolume from '../player/player_volume.svelte';
    import PlayerRepeat from '../player/player_repeat.svelte';
    import PlayerShuffle from '../player/player_shuffle.svelte';
    import PlayerRating from '../player/player_rating.svelte';
    import PlayerFullscreen from '../player/player_fullscreen.svelte';
    import PlayerAutoPlay from '../player/player_autoPlay.svelte';
    import PlayerLyrics from '../player/player_lyrics.svelte';
    import PlayerSkipBelow from '../player/player_skipBelow.svelte';
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
        <PlayerRating />
    </div>

    <div class="site-player__times">
        <PlayerTimeCurrent/> / <PlayerTimeEnd/>
    </div>

    <div class="site-player__volume">
       <PlayerVolume />
    </div>

    <!-- feature-specific player controls -->
    <div class="site-player__feature-controls">
        <PlayerLyrics />
        <PlayerAutoPlay />
        <PlayerSkipBelow />
    </div>

    <!-- playback-specific player controls -->
    <div class="site-player__playback-controls">
        <PlayerRepeat />
        <PlayerShuffle />
        <PlayerVolume />
    </div>

    <!-- all the player options together -->
    <div class="site-player__secondary-controls">
        <PlayerLyrics />
        <PlayerAutoPlay />
        <PlayerSkipBelow />
        <PlayerRepeat />
        <PlayerShuffle />
    </div>

    <div class="site-player__fullscreen">
        <PlayerFullscreen />
    </div>

    <div class="site-player__queue">
        <PlayerQueue />
    </div>
</div>

<style>
    /*
     * Common
     */
    .site-player {
        background-color: var(--color-interface);
        border-block-start: 1px solid var(--color-border);
        height: var(--size-webplayer-height);
        display: grid;
        align-items: center;
        z-index: 100;
        position: relative;
    }

    /* hide non-permanent items */
    .site-player__now-playing,
    .site-player__waveform,
    .site-player__volume,
    .site-player__feature-controls,
    .site-player__playback-controls,
    .site-player__secondary-controls,
    .site-player__fullscreen {
        display: none;
    }

    .site-player__seekBar :global(.seekBar) {
        position: absolute;
        inset-block-start: calc(-1 * var(--size-seekbar-height));
        inset-inline-start: 0;
        inset-inline-end: 0;
    }

    .site-player__times :global(.current) {
        text-align: end;
    }

    .site-player__controls {
        grid-area: main-controls;
        z-index: 200;
    }

    .site-player__now-playing {
        grid-area: now-playing;
        height: 100%;
        overflow: hidden;
        align-items: center;
    }

    .site-player__waveform {
        grid-area: waveform;
        min-height: 100%;
        cursor: pointer;
        position: relative;
    }

    #waveform {
        position: absolute;
        inset-block-start: 0;
        inset-block-end: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
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
        margin-inline-end: var(--spacing-md);
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
        align-items: center;
        transform: scale(0.9);
    }

    .site-player__feature-controls {
        grid-area: feature-controls;
    }

    .site-player__playback-controls {
        grid-area: playback-controls;
    }

    .site-player__secondary-controls {
        grid-area: secondary-controls;
        gap: var(--spacing-sm);
        justify-content: center;
        align-items: center;
        transform: scale(0.9);
        position: relative;
        z-index: 200;
    }

    .site-player__fullscreen {
        grid-area: fullscreen;
        justify-content: center;
    }

    .site-player__queue {
        grid-area: queue;
        justify-content: center;
        display: flex;
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
        inset-block-start: 50%;
        inset-inline-end: 0;
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
    @media all and (max-width: 679.99px) {
        .site-player {
            grid-template-areas:
                "SPACER1 times             SPACER2 main-controls SPACER3 fullscreen       queue            SPACER4"
                "SPACER1 playback-controls SPACER2 rating        SPACER3 feature-controls feature-controls SPACER4"
            ;
            grid-template-columns: 1fr auto var(--spacing-sm) auto var(--spacing-sm) auto auto 1fr;
            grid-template-rows: 1fr 1fr;
            padding: var(--spacing-md) 0;
        }

        /* UI volume controls not needed for mobile */
        .site-player :global(.volume-control) {
            display: none !important;
        }

        .site-player__feature-controls {
            display: flex;
        }

        .site-player__playback-controls {
            display: flex;
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

        .site-player__queue {
            height: 100%;
        }

        .site-player__now-playing :global(.nowPlayingArtwork) {
            display: none;
        }

        .site-player__now-playing {
            display: flex;
        }

        .site-player__secondary-controls {
            display: flex;
        }

        .site-player__waveform {
            display: flex;
        }

        .site-player__volume {
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
            inset-block-start: 12px;
            inset-block-end: 12px;
            inset-inline-start: 0;
            inset-inline-end: 0;
            z-index: -1;
        }

        .site-player__times {
            padding-block-start: var(--spacing-lg);
        }

        .site-player__rating {
            padding-block-end: var(--spacing-lg);
        }

        .site-player__times,
        .site-player__rating {
            padding-inline-end: var(--spacing-md);
        }

        #waveform {
            padding: var(--spacing-md) 0;
        }

        .site-player__times {
            justify-content: right;
        }

        .site-player :global(.primary-controls),
        .site-player__rating,
        .site-player__volume,
        .site-player__secondary-controls {
            transform: unset;
        }

        .site-player__secondary-controls {
            margin-block-start: var(--spacing-sm);
        }

        .site-player__volume {
            margin-block-end: var(--spacing-sm);
        }
    }
</style>