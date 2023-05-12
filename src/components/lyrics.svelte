<script>
    import { onMount, onDestroy } from "svelte";
    import { computePosition, autoUpdate, offset } from '@floating-ui/dom';
    import { waitForElement } from "../logic/helper";
    import { QueueIsOpen } from "../stores/status";
    import Lyrics from '../logic/lyrics'

    import { MediaPlayer, SiteInnerBind } from "../stores/player";
    import {
        CurrentMedia,
        ShowLyrics
    } from "../stores/status";

    let lyrics = new Lyrics();
    let follow = true;
    let loading = true;
    let lyricsBind;
    let autoUpdateCleanup;

    $: {
        if (lyrics && $CurrentMedia && $MediaPlayer.wavesurfer) {
            loading = true;

            // reset any previous instance
            resetEvents();

            loading = false;
        }


    }

    $: {
        if ($SiteInnerBind) {
            // updatePosition whenever QueueIsOpen changes
            $QueueIsOpen, updatePosition();
        }
    }

    function resetEvents() {
        $MediaPlayer.wavesurfer.un('audioprocess', changeLine);
        $MediaPlayer.wavesurfer.on('audioprocess', changeLine);

        waitForElement('.lyrics-container').then((selector) => {
            selector.scrollTop = 0;
            follow = $lyrics.isTimestamped;
        });
    }

    function handleScroll() {
        follow = false;
    }

    function changeLine() {
        $lyrics.move($MediaPlayer.wavesurfer.getCurrentTime());

        if (follow) {
            waitForElement('.site-lyrics .current').then((selector) => {
                selector.scrollIntoView({
                    block: "center",
                    behavior: "auto",
                });
            });
        }
    }

    function handleClick(time) {
        if (time > 0) {
            $MediaPlayer.wavesurfer.seekTo(time / $CurrentMedia.time);
            follow = true;
        }
    }

    function updatePosition() {
        computePosition($SiteInnerBind, lyricsBind, {
            placement: "bottom-end",
            middleware: [
                offset(({rects}) => ({
                    mainAxis: -rects.floating.height - 16,
                    alignmentAxis: 15 + (($QueueIsOpen) ? 330 : 0),
                }))
            ],
        }).then(({x, y}) => {
            Object.assign(lyricsBind.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }

    onMount(() => {
        updatePosition();

        autoUpdateCleanup = autoUpdate(
            $SiteInnerBind,
            lyricsBind,
            updatePosition
        );
    });

    onDestroy(() => {
        // floating-ui
        autoUpdateCleanup();
    })
</script>

<div
    class="site-lyrics"
    class:visible={$ShowLyrics}
    bind:this={lyricsBind}
>
    <div class="container">
        <div class="header new-panel-header">
            <h4 class="title panel-title">Lyrics</h4>
            <button
                class="follow button button--regular"
                on:click={e => follow = true}
                hidden={!$lyrics.isTimestamped || follow}
            >
                Follow
            </button>
        </div>
        <div
            class="lyrics-container panel-content new-panel-main"
            on:wheel={handleScroll}
            on:touchstart={handleScroll}
            class:disable-scroll={follow}
        >
            {#if $CurrentMedia}
                {#if $CurrentMedia.lyrics && !loading}
                    <div
                        class="lyrics"
                        class:hasTimestamps={$lyrics.isTimestamped}
                    >
                        {#each $lyrics.lyricsFinal as line, i}
                            <div
                                class="line"
                                class:current={$lyrics.currentLine === i}
                                on:click={() => { handleClick(line.startSeconds) }}
                            >
                                {@html line.text}
                            </div>
                        {/each}
                    </div>
                {:else}
                    No lyrics found
                {/if}
            {:else}
                No song playing
            {/if}
        </div>
    </div>
</div>

<style>
    .current {
        color: var(--color-highlight);
        transition: color 0.1s ease-in-out;
    }

    .disable-scroll {
        overflow: hidden !important;
    }

    .lyrics {
        line-height: 1.6;
    }

    .lyrics-container {
        overscroll-behavior: contain;
    }

    .line {
        margin-bottom: var(--spacing-md);
    }
    
    .hasTimestamps {
        color: var(--color-text-secondary);
    }

    @media (hover: hover) {
        .hasTimestamps .line:hover {
            cursor: pointer;
            color: var(--color-text-primary);
        }
    }

    .site-lyrics {
        position: absolute;
        z-index: 10;
        background-color: var(--color-menu-background);
        border: 2px solid var(--color-menu-border);
        border-radius: 5px;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
        max-width: calc(100% - var(--spacing-xxl));
        left: 0;
        top: 0;
    }

    .visible {
        opacity: 1;
        pointer-events: auto;
    }

    .container {
        width: 350px;
        padding: var(--spacing-lg);
    }

    .panel-content {
        max-height: 215px;
        overflow: auto;
        padding: var(--spacing-lg);
    }
</style>