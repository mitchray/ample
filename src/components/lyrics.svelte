<script>
    import { _ } from "svelte-i18n";
    import Lyrics from "~/logic/lyrics";
    import Portal from "~/components/portal.svelte";
    import { MediaPlayer, SiteContentBind } from "~/stores/elements.js";
    import { CurrentMedia, ShowLyrics } from "~/stores/state.js";
    import { throttle } from "lodash-es";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { tick, untrack } from "svelte";

    let lyrics = new Lyrics(); // custom store
    let follow = $state(true);
    let loading = $state(true);
    let drawer = $state();
    let container = $state();
    let currentLine = $state();

    function handleClose(event) {
        // ignore bubbled sl-hide events from other components
        if (event.target === drawer) {
            ShowLyrics.set(false);
        }
    }

    const throttledAction = throttle(changeLine, 0.25 * 1000);

    function resetEvents() {
        $MediaPlayer.playerA.wavesurfer.un("timeupdate", throttledAction);
        $MediaPlayer.playerB.wavesurfer.un("timeupdate", throttledAction);
        $MediaPlayer.currentPlayer.wavesurfer.on("timeupdate", throttledAction);

        if (container) container.scrollTop = 0;

        follow = true; // just force it on, won't impact non-synced lyrics
    }

    function handleScroll() {
        follow = false;
    }

    function scrollToLine() {
        currentLine?.scrollIntoView({
            block: "center",
            behavior: "smooth",
        });
    }

    async function changeLine() {
        $lyrics.move($MediaPlayer.getCurrentTime());
        await tick();
        currentLine = container?.querySelector(".current");

        if (follow) {
            scrollToLine();
        }
    }

    function handleClick(time) {
        if (time > 0) {
            $MediaPlayer.seekTo(time / $MediaPlayer.getDuration());
            scrollToLine();
            follow = true;
        }
    }

    $effect(() => {
        if (lyrics && $CurrentMedia) {
            untrack(() => {
                loading = true;

                // reset any previous instance
                resetEvents();

                loading = false;
            });
        }
    });

    $effect(() => {
        $ShowLyrics ? drawer?.show() : drawer?.hide();
    });
</script>

{#if $SiteContentBind}
    <Portal target={$SiteContentBind}>
        <sl-drawer
            bind:this={drawer}
            contained
            onsl-hide={handleClose}
            placement="bottom"
        >
            <div slot="label">
                {$_("text.lyrics")}
            </div>

            <div slot="header-actions">
                <sl-button
                    class="follow"
                    hidden={!$lyrics.isTimestamped || follow}
                    onclick={() => (follow = true)}
                >
                    <MaterialSymbol name="footprint" slot="prefix" />
                    {$_("text.follow")}
                </sl-button>
            </div>

            <div
                class="lyrics-container"
                class:disable-scroll={follow}
                class:hasTimestamps={$lyrics.isTimestamped}
                ontouchstart={handleScroll}
                onwheel={handleScroll}
                bind:this={container}
            >
                {#if $CurrentMedia?.object_type === "song"}
                    {#if $lyrics.hasLyrics() && !loading}
                        {#each $lyrics.lyricsFinal as line, i}
                            <div
                                class="line"
                                class:current={$lyrics.currentLine === i}
                                onclick={() => {
                                    handleClick(line.startSeconds);
                                }}
                            >
                                {@html line.text}
                            </div>
                        {/each}
                    {:else}
                        {$_("text.lyricsMissing")}
                    {/if}
                {:else}
                    {$_("text.lyricsNoSong")}
                {/if}
            </div>
        </sl-drawer>
    </Portal>
{/if}

<style>
    sl-drawer::part(panel) {
        min-height: 100%;
    }

    /* always show the footer, though empty */
    sl-drawer::part(footer) {
        display: block;
    }

    sl-drawer::part(header-actions) {
        align-content: center;
        gap: var(--spacing-lg);
    }

    .line {
        transition: color 0.25s ease-in-out;
    }

    .current {
        color: var(--color-primary);
    }

    .disable-scroll {
        overflow: hidden !important;
    }

    .lyrics-container {
        font-size: 2rem;
        line-height: 1.2;
        overscroll-behavior: contain;
        overflow: auto; /* key to keeping position after scrolling */
    }

    .line {
        margin-block-end: var(--spacing-lg);
    }

    .hasTimestamps {
        color: var(--color-outline-variant);
    }

    @media (hover: hover) {
        .hasTimestamps .line:hover {
            cursor: pointer;
            color: var(--color-secondary);
        }
    }
</style>
