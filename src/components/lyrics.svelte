<script>
    import { _ } from "svelte-i18n";
    import { waitForElement } from "~/logic/helper";
    import Lyrics from "~/logic/lyrics";
    import Portal from "~/components/portal.svelte";
    import { MediaPlayer, SiteContentBind } from "~/stores/elements.js";
    import { CurrentMedia, ShowLyrics } from "~/stores/state.js";

    let lyrics = new Lyrics(); // custom store
    let follow = true;
    let loading = true;
    let drawer;

    $: {
        if (lyrics && $CurrentMedia) {
            loading = true;

            // reset any previous instance
            resetEvents();

            loading = false;
        }
    }

    $: {
        $ShowLyrics ? drawer?.show() : drawer?.hide();
    }

    function handleClose(event) {
        // ignore bubbled sl-hide events from other components
        if (event.target === drawer) {
            ShowLyrics.set(false);
        }
    }

    function resetEvents() {
        $MediaPlayer.wavesurfer.un("timeupdate", changeLine);
        $MediaPlayer.wavesurfer.on("timeupdate", changeLine);

        waitForElement(".lyrics-container").then((selector) => {
            selector.scrollTop = 0;
            follow = $lyrics.isTimestamped;
        });
    }

    function handleScroll() {
        follow = false;
    }

    function changeLine() {
        $lyrics.move($MediaPlayer.getCurrentTime());

        if (follow) {
            waitForElement(".lyrics-container .current").then((selector) => {
                selector.scrollIntoView({
                    block: "center",
                    behavior: "auto",
                });
            });
        }
    }

    function handleClick(time) {
        if (time > 0) {
            $MediaPlayer.seekTo(time / $MediaPlayer.getDuration());
            follow = true;
        }
    }
</script>

<Portal target={$SiteContentBind}>
    <sl-drawer
        placement="bottom"
        bind:this={drawer}
        on:sl-hide={handleClose}
        contained
    >
        <div slot="label">
            {$_("text.lyrics")}
        </div>

        <div slot="header-actions">
            <sl-button
                class="follow"
                on:click={() => (follow = true)}
                hidden={!$lyrics.isTimestamped || follow}
            >
                {$_("text.follow")}
            </sl-button>
        </div>

        <div
            class="lyrics-container"
            on:wheel={handleScroll}
            on:touchstart={handleScroll}
            class:disable-scroll={follow}
            class:hasTimestamps={$lyrics.isTimestamped}
        >
            {#if $CurrentMedia?.object_type === "song"}
                {#if $lyrics.lyricsFinal?.length > 0 && !loading}
                    {#each $lyrics.lyricsFinal as line, i}
                        <div
                            class="line"
                            class:current={$lyrics.currentLine === i}
                            on:click={() => {
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

    .current {
        color: var(--color-primary);
        transition: color 0.1s ease-in-out;
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
