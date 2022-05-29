<script>
    import { tick } from "svelte";
    import { waitForElement } from "../logic/helper";

    import Lyrics from '../logic/lyrics'

    import { MediaPlayer, SiteContentBind } from "../stores/player";
    import {
        CurrentSong,
        ShowLyrics
    } from "../stores/status";

    let lyrics = new Lyrics();
    let follow = true;
    let loading = true;

    $: {
        if (lyrics && $CurrentSong && $MediaPlayer.wavesurfer) {
            loading = true;

            // reset any previous instance
            resetEvents();

            loading = false;
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
                    behavior: "smooth",
                });
            });
        }
    }

    function handleClick(time) {
        if (time > 0) {
            $MediaPlayer.wavesurfer.seekTo(time / $CurrentSong.time);
            follow = true;
        }
    }
</script>


{#if $SiteContentBind}
    <div class="lyrics-wrapper"
        style="width: {$SiteContentBind.clientWidth}px; height: {$SiteContentBind.clientHeight}px; top: {$SiteContentBind.getBoundingClientRect().top}px; left: {$SiteContentBind.getBoundingClientRect().left}px;"
    >
        <div
            class="site-lyrics"
            class:visible={$ShowLyrics}
        >
            <div class="container">
                <div class="header panel-header">
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
                    class="lyrics-container panel-content"
                    on:wheel={handleScroll}
                    on:touchstart={handleScroll}
                    class:disable-scroll={follow}
                >
                    {#if $CurrentSong}
                        {#if $CurrentSong.lyrics && !loading}
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
    </div>
{/if}

<style>
    .lyrics-wrapper {
        position: fixed;
        z-index: 25;
        pointer-events: none;
        overflow: hidden;
    }

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

    .hasTimestamps .line:hover {
        cursor: pointer;
        color: var(--color-text-primary);
    }

    .site-lyrics {
        position: absolute;
        bottom: var(--spacing-lg);
        right: var(--spacing-lg);
        z-index: 10;
        background-color: var(--color-menu-background);
        border: 2px solid var(--color-menu-border);
        border-radius: 5px;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
    }

    .visible {
        opacity: 1;
        pointer-events: auto;
    }

    .container {
        width: 350px;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .panel-content {
        max-height: 215px;
        padding: var(--spacing-lg);
        overflow: auto;
    }
</style>