<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { get } from "svelte/store";
    import { parseLyrics, getCurrentLineIndex } from "~/logic/lyrics.js";
    import Portal from "~/components/portal.svelte";
    import { MediaPlayer, SiteContentBind } from "~/stores/elements.js";
    import { API, CurrentMedia, ShowLyrics } from "~/stores/state.js";
    import { throttle } from "lodash-es";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { tick, untrack } from "svelte";

    let lyricsFinal = $state([]);
    let currentLineIndex = $state(null);
    let isTimestamped = $state(false);
    let hasLyrics = $state(false);
    let previousMediaId = $state("");
    let follow = $state(true);
    let drawer = $state();
    let container = $state();
    let currentLineEl = $state();

    function handleClose(event) {
        // ignore bubbled sl-hide events from other components
        if (event.target === drawer) {
            ShowLyrics.set(false);
        }
    }

    const throttledAction = throttle(changeLine, 0.25 * 1000);

    function resetEvents() {
        const ws = $MediaPlayer.getCurrentWavesurfer();
        ws?.un("timeupdate", throttledAction);
        ws?.on("timeupdate", throttledAction);

        if (container) container.scrollTop = 0;

        follow = true; // just force it on, won't impact non-synced lyrics
    }

    function handleScroll() {
        follow = false;
    }

    function scrollToLine() {
        currentLineEl?.scrollIntoView({
            block: "center",
            behavior: "smooth",
        });
    }

    async function changeLine() {
        currentLineIndex = getCurrentLineIndex(
            lyricsFinal,
            isTimestamped,
            $MediaPlayer.getCurrentTime(),
        );
        await tick();
        currentLineEl = container?.querySelector(".current");

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
        const item = $CurrentMedia;
        const id = (item?.id ?? "") + (item?.object_type ?? "");

        if (id !== previousMediaId) {
            previousMediaId = id;
            lyricsFinal = [];
            currentLineIndex = null;
            hasLyrics = false;

            if (item?.object_type === "song") {
                $API.getLyrics({ filter: item.id, plugins: 1 })
                    .then((response) => {
                        const raw = response?.error
                            ? null
                            : (response?.plugin?.database?.text ?? null);
                        const current = get(CurrentMedia);
                        if (
                            current?.id !== item?.id ||
                            current?.object_type !== item?.object_type
                        ) {
                            return;
                        }
                        if (!raw?.length) {
                            return;
                        }
                        const { lines, isTimestamped: ts } = parseLyrics(raw);
                        lyricsFinal = lines;
                        isTimestamped = ts;
                        hasLyrics = true;
                    })
                    .catch(() => {
                        const current = get(CurrentMedia);
                        if (
                            current?.id !== item?.id ||
                            current?.object_type !== item?.object_type
                        ) {
                            return;
                        }
                    });
            }
        }
    });

    $effect(() => {
        if ($CurrentMedia) {
            untrack(() => {
                resetEvents();
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
                    hidden={!isTimestamped || follow}
                    onclick={() => (follow = true)}
                >
                    <MaterialSymbol name="footprint" slot="prefix" />
                    {$_("text.follow")}
                </sl-button>
            </div>

            <div
                class="lyrics-container"
                class:disable-scroll={follow}
                class:hasTimestamps={isTimestamped}
                ontouchstart={handleScroll}
                onwheel={handleScroll}
                bind:this={container}
            >
                {#if $CurrentMedia?.object_type === "song"}
                    {#if hasLyrics}
                        {#each lyricsFinal as line, i}
                            <div
                                class="line"
                                class:current={currentLineIndex === i}
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
