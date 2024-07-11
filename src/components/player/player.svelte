<script>
    import { onDestroy, onMount } from "svelte";
    import WavesurferConnector from "~/logic/player.js";
    import { PlayerIsMini, PlayerIsOpen } from "~/stores/settings.js";
    import { MediaPlayer, SitePlayerBind } from "~/stores/elements.js";
    import OpenToggle from "~/components/player/player_openToggle.svelte";
    import QueueToggle from "~/components/player/player_queueToggle.svelte";
    import MiniToggle from "~/components/player/player_miniToggle.svelte";
    import NowPlaying from "~/components/player/player_nowPlaying.svelte";
    import Rating from "~/components/player/player_rating.svelte";
    import PlayerSeekBar from "~/components/player/player_seekBar.svelte";
    import PlayerTimeCurrent from "~/components/player/player_timeCurrent.svelte";
    import PlayerTimeEnd from "~/components/player/player_timeEnd.svelte";
    import PlayPause from "~/components/player/player_playPause.svelte";
    import Next from "~/components/player/player_next.svelte";
    import Previous from "~/components/player/player_previous.svelte";
    import SeekBack from "~/components/player/player_seekBack.svelte";
    import SeekForward from "~/components/player/player_seekForward.svelte";
    import Volume from "~/components/player/player_volume.svelte";
    import Shuffle from "~/components/player/player_shuffle.svelte";
    import Repeat from "~/components/player/player_repeat.svelte";
    import MoreOptions from "~/components/player/player_moreOptions.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let currentHeight;

    onMount(() => {
        $MediaPlayer = new WavesurferConnector();
    });

    onDestroy(() => {
        $MediaPlayer?.wavesurfer?.unAll();
        $MediaPlayer?.wavesurfer?.destroy();
    });
</script>

<div
    bind:clientHeight={currentHeight}
    bind:this={$SitePlayerBind}
    class="site-player"
    class:is-expanded={!$PlayerIsMini}
    class:is-open={$PlayerIsOpen}
    style:height={$PlayerIsOpen ? "auto" : "0"}
>
    <OpenToggle />
    <QueueToggle />

    <div class="container">
        <div class="player__waveform">
            <div id="waveform"></div>
        </div>

        <div class="player__seekbar">
            <PlayerSeekBar />
        </div>

        <span class="player__current-time">
            <PlayerTimeCurrent />
        </span>
        <span class="player__end-time">
            <PlayerTimeEnd />
        </span>

        <span class="player__toggle"><MiniToggle /></span>
        <span class="player__settings">
            <sl-button variant="text">
                <MaterialSymbol name="settings" />
            </sl-button>
        </span>

        <span class="player__now-playing"><NowPlaying /></span>

        <span class="player__rating"><Rating /></span>

        <span class="player__shuffle">
            <Shuffle />
        </span>
        <span class="player__repeat">
            <Repeat />
        </span>
        <span class="player__seek-back playback-control">
            <SeekBack />
        </span>
        <span class="player__previous secondary playback-control">
            <Previous />
        </span>
        <span class="player__play-pause playback-control">
            <PlayPause />
        </span>
        <span class="player__next secondary playback-control">
            <Next />
        </span>
        <span class="player__seek-forward playback-control">
            <SeekForward />
        </span>
        <span class="player__bookmark">
            <sl-button variant="text">
                <MaterialSymbol name="bookmark" />
            </sl-button>
        </span>
        <span class="player__more-options">
            <MoreOptions />
        </span>

        <span class="player__volume">
            <Volume />
        </span>
    </div>
</div>

{@html `<style>:root { --size-player-height: ${currentHeight + "px"} }</style>`}

<style>
    /* COMMON */
    .site-player {
        --main-area-height: 84px;
        height: var(--size-player-height);
        z-index: 100;
        position: relative;
    }

    .site-player :global(sl-skeleton) {
        --color: currentColor;
        opacity: 0.2;
    }

    /* prettier-ignore */
    .container {
        display: grid;
        gap: 2px;
        align-items: center;
        grid-template-areas:
                              "wave    wave    wave      wave       wave         wave         wave "
                              "seekbar seekbar seekbar   seekbar    seekbar      seekbar      seekbar"
                              ".       shuffle seek-back play-pause seek-forward bookmark     ."
                              ".       repeat  previous  play-pause next         more-options .";
        grid-template-columns: 1fr     32px    32px      auto       32px         32px         1fr;
        grid-template-rows: auto 4px 42px 42px;
    }

    /* ensure container contents are hidden */
    .site-player:not(.is-open) .container {
        height: 0 !important;
        overflow: hidden;
    }

    /* reduce inline padding for all the buttons */
    .site-player :global(sl-button::part(label)) {
        padding-inline: 0;
    }

    .site-player :global(sl-button::part(base)) {
        min-width: 32px;
        aspect-ratio: 1/1;
    }

    .player__seekbar {
        grid-area: seekbar;
    }

    .player__shuffle {
        grid-area: shuffle;
    }

    .player__repeat {
        grid-area: repeat;
    }

    .player__seek-back {
        grid-area: seek-back;
    }

    .player__previous {
        grid-area: previous;
    }

    .player__play-pause {
        grid-area: play-pause;
        z-index: 100;
    }

    .player__play-pause :global(*::part(base)) {
        height: calc(var(--main-area-height) - 18px);
        align-items: center;
    }

    .player__next {
        grid-area: next;
    }

    .player__seek-forward {
        grid-area: seek-forward;
    }

    .player__bookmark {
        grid-area: bookmark;
    }

    .player__more-options {
        grid-area: more-options;
    }

    .player__waveform {
        height: 0;
        grid-area: wave;
        opacity: 0;
        pointer-events: none;
        cursor: pointer;
    }

    #waveform {
        width: 100%;
        height: 30px;
    }

    .player__now-playing {
        grid-area: now-playing;
    }

    .player__rating {
        grid-area: rating;
        justify-self: end;
        margin-inline-end: var(--spacing-md);
    }

    /* only position when player is open otherwise they will appear when closed */
    .site-player.is-open .player__current-time,
    .site-player.is-open .player__end-time,
    .site-player.is-open .player__toggle,
    .site-player.is-open .player__settings {
        position: absolute;
    }

    /* need to set from bottom as height can change but position is constant */
    .player__current-time,
    .player__end-time {
        line-height: 1;
        transform: translateY(100%);
        z-index: 200;
    }

    .player__current-time {
        inset-block-end: calc(var(--main-area-height) - var(--spacing-sm));
        inset-inline-start: var(--spacing-sm);
    }

    .player__end-time {
        inset-block-end: calc(var(--main-area-height) - var(--spacing-sm));
        inset-inline-end: var(--spacing-sm);
    }

    .player__toggle {
        inset-block-end: var(--spacing-sm);
        inset-inline-start: var(--spacing-sm);
    }

    .player__settings {
        display: none;
        inset-block-end: var(--spacing-sm);
        inset-inline-end: var(--spacing-sm);
    }

    /* hide non-permanent items */
    .player__now-playing,
    .player__volume,
    .player__rating {
        display: none;
    }

    .playback-control.secondary :global(*::part(base)) {
        /*background-color: var(--color-background);*/
        /*border: 1px solid currentColor;*/
    }

    .playback-control.secondary :global(*::part(base)):not(:hover) {
        /*color: var(--color-highlight);*/
    }

    .playback-control.secondary :global(*::part(base)):disabled {
        /*color: var(--color-outline-variant);*/
        /*opacity: 1;*/
    }

    .site-player.is-expanded .player__waveform {
        height: auto;
        pointer-events: initial;
        opacity: 1;
    }

    /* mobile only tweaks */
    /* prettier-ignore */
    @media (max-width: 389.99px) {
        /* bigger play button */
        .player__play-pause :global(*::part(base)) {
            font-size: 3.5rem;
        }

        /* push down towards the centre */
        .player__shuffle,
        .player__seek-back,
        .player__seek-forward,
        .player__bookmark {
            align-self: end;
        }

        /* push up towards the centre */
        .player__repeat,
        .player__previous,
        .player__next,
        .player__more-options {
            align-self: start;
        }
    }

    /* prettier-ignore */
    @media (min-width: 390px) {
        .site-player {
            --main-area-height: 60px;
        }

        .container {
            grid-template-areas:
                                  "wave    wave    wave    wave      wave     wave       wave    wave         wave     wave         wave"
                                  "seekbar seekbar seekbar seekbar   seekbar  seekbar    seekbar seekbar      seekbar  seekbar      seekbar"
                                  ".       repeat  shuffle seek-back previous play-pause next    seek-forward bookmark more-options .";
            grid-template-columns: 1fr     32px    32px    32px      32px     auto       32px    32px         32px     32px         1fr;
            grid-template-rows: auto 4px 60px;
        }

        /* bigger play button */
        .player__play-pause :global(*::part(base)) {
            font-size: 2.5rem;
        }

        .player__play-pause :global(sl-button::part(base)),
        .player__next :global(sl-button::part(base)),
        .player__previous :global(sl-button::part(base)) {
            border-radius: 100%;
        }
    }

    /* prettier-ignore */
    @media (min-width: 690px) {
        .container {
            grid-template-areas:
                                   "wave    wave           wave    wave      wave     wave       wave    wave         wave    wave    wave    wave     wave         wave           wave "
                                   "seekbar seekbar        seekbar seekbar   seekbar  seekbar    seekbar seekbar      seekbar seekbar seekbar seekbar  seekbar      seekbar        seekbar"
                                   ".       volume         .       seek-back previous play-pause next    seek-forward .       repeat  shuffle bookmark more-options .              .";
            grid-template-columns:  1fr     calc(32px * 6) 16px    32px      32px     auto       32px    32px         16px    32px    32px    32px     32px         calc(32px * 2) 1fr;
            grid-template-rows: auto 4px 60px;
        }

        .player__volume {
            grid-area: volume;
            display: flex;
            align-items: center;
            gap: var(--spacing-md)
        }
    }

    /* prettier-ignore */
    @media (min-width: 920px) {
        .container {
            grid-template-areas:
                                   "wave    wave           wave        wave           wave           wave    wave      wave     wave       wave    wave         wave    wave    wave    wave     wave         wave           wave    wave "
                                   "seekbar seekbar        seekbar     seekbar        seekbar        seekbar seekbar   seekbar  seekbar    seekbar seekbar      seekbar seekbar seekbar seekbar  seekbar      seekbar        seekbar seekbar"
                                   ".       now-playing    now-playing now-playing    rating         .       seek-back previous play-pause next    seek-forward .       repeat  shuffle bookmark more-options volume         volume  volume";
            grid-template-columns: 70px     calc(32px * 4) 1fr         calc(32px * 1) calc(32px * 3) 16px    32px      32px     auto       32px    32px         16px    32px    32px    32px     32px         calc(32px * 1) 1fr     calc((32px * 3) + 70px);
            grid-template-rows: auto 4px 60px;
        }

        .player__now-playing {
            display: block;
            overflow: hidden;
        }

        .player__rating {
            display: block;
            margin: unset;
        }

        .player__volume {
            justify-self: end;
            width: 100%;
            max-width: 300px;
            padding-inline-start: 20px;
            padding-inline-end: 60px;
        }
    }
</style>
