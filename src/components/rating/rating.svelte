<script>
    import { _ } from "@rgglez/svelte-i18n";
    import {
        API,
        NowPlayingQueue,
        recentRating,
        recentFlag,
    } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { debugHelper, errorHandler } from "~/logic/helper.js";
    import { updateQueue } from "~/logic/ui.js";

    let { type = $bindable(null), data = $bindable({}) } = $props();

    // NOTE: 'data' is not reactive as a prop so cannot directly alter a property e.g. data.rating = 3,
    // instead must reassign e.g. data = { ...data, rating: 3 };

    let showAverageRatings = true;
    let ratingErrored = $state(false);
    let flagErrored = $state(false);
    let finalType = $derived(type === "playlist_songs" ? "song" : type); // override for playlist_songs
    const values = [1, 2, 3, 4, 5];

    function handleRating() {
        ratingErrored = false;
        let parsedRating = parseInt(this.dataset.rating);
        let originalRating = data.rating;
        let newRating = parsedRating === data.rating ? 0 : parsedRating; // clear rating if it matches existing

        // update the displayed rating immediately
        data = { ...data, rating: newRating };

        $API.rate({ type: finalType, id: data.id, rating: newRating }).then(
            (result) => {
                if (result.error) {
                    errorHandler("while rating", result.error);
                    ratingErrored = true;

                    // revert the displayed rating
                    data = { ...data, rating: originalRating };
                }

                if (result.success) {
                    recentRating.set({
                        type: finalType,
                        id: data.id,
                        rating: newRating,
                    });

                    // now update any items in the queue with the new rating
                    let foundItems = $NowPlayingQueue.filter(
                        (item) =>
                            item.id === data.id &&
                            item.object_type === finalType,
                    );

                    foundItems.forEach((item) => {
                        item.rating = newRating;
                    });

                    // TODO is this still required
                    updateQueue();
                    refreshAverageRating();
                }
            },
        );
    }

    function handleFlag() {
        flagErrored = false;
        let newFlag = data.flag ? 0 : 1;

        $API.flag({ type: finalType, id: data.id, flag: newFlag }).then(
            (result) => {
                if (result.error) {
                    errorHandler("while flagging", result.error);
                    flagErrored = true;
                    return;
                }

                if (result.success) {
                    data = { ...data, flag: newFlag };

                    recentFlag.set({
                        type: finalType,
                        id: data.id,
                        flag: newFlag,
                    });

                    // now update any items in the queue with the new fav
                    let foundItems = $NowPlayingQueue.filter(
                        (item) =>
                            item.id === data.id &&
                            item.object_type === finalType,
                    );

                    foundItems.forEach((item) => {
                        item.flag = data.flag;
                    });

                    updateQueue();
                }
            },
        );
    }

    function refreshAverageRating() {
        debugHelper("refetch item to get average rating");

        const apiMap = {
            song: () => $API.song({ filter: data.id }),
            album: () => $API.album({ filter: data.id }),
            artist: () => $API.artist({ filter: data.id }),
            playlist: () => $API.playlist({ filter: data.id }),
            podcast: () => $API.podcast({ filter: data.id }),
        };

        if (apiMap[finalType]) {
            apiMap[finalType]().then((r) => {
                if (!r.error) {
                    data = { ...data, averagerating: r.averagerating };
                }
            });
        }
    }

    // monitor global rating/flag stores to update multiple instances
    $effect(() => {
        if (
            $recentRating.type === finalType &&
            $recentRating.id === data.id &&
            $recentRating.rating !== data.rating
        ) {
            data = { ...data, rating: $recentRating.rating };
            refreshAverageRating();
        }
    });

    $effect(() => {
        if (
            $recentFlag.type === finalType &&
            $recentFlag.id === data.id &&
            $recentFlag.flag !== data.flag
        ) {
            data = { ...data, flag: $recentFlag.flag };
        }
    });
</script>

<div class="c-rating" class:disabled={!data.id}>
    <div class="stars" class:errored={ratingErrored}>
        {#each values as ratingValue, i}
            <span
                onclick={handleRating}
                data-rating={ratingValue}
                class="star"
                class:filled={ratingValue <= data.rating}
            >
                <MaterialSymbol name="star" fill={data.rating > i} />
            </span>
        {/each}
    </div>

    <span
        class="flag"
        class:flagged={data.flag}
        onclick={handleFlag}
        class:errored={flagErrored}
    >
        <MaterialSymbol fill={data.flag || false} name="favorite" />
    </span>

    {#if data.averagerating && showAverageRatings}
        <sl-badge
            class="average"
            title={$_("text.ratingAverage")}
            variant="neutral"
            pill
            onclick={refreshAverageRating}
        >
            {data.averagerating.toFixed(1)}
        </sl-badge>
    {/if}
</div>

<style>
    .c-rating {
        display: inline-flex;
        align-items: center;
        line-height: 0;
        user-select: none;
        height: 1em; /* set a height avg rating doesn't misalign ones without it */
    }

    .c-rating.disabled {
        pointer-events: none;
        opacity: 0.6;
    }

    .star,
    .flag {
        transition: all 50ms linear;
    }

    .star.filled {
        color: var(--color-rating);
    }

    .star:not(.filled) {
        opacity: 0.5;
    }

    @media (hover: hover) {
        .star:hover,
        .flag:hover {
            transform: scale(1.2);
        }
    }

    span:not(.average) {
        cursor: pointer;
    }

    .stars {
        display: flex;
        margin: 0;
    }

    .flag {
        padding: 0;
        padding-inline-start: var(--spacing-sm);
        color: var(--color-favorite);
    }

    .average {
        padding-inline-start: var(--spacing-sm);
        overflow: visible !important;
    }

    .average::part(base) {
        font-size: 0.8em;
        border: 0;
        color: var(--color-on-surface-variant);
        background-color: var(--color-surface-variant);
    }

    .errored {
        animation: shake 0.8s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
    }

    @keyframes shake {
        10%,
        90% {
            transform: translate3d(-1px, 0, 0);
        }

        20%,
        80% {
            transform: translate3d(1px, 0, 0);
        }

        30%,
        50%,
        70% {
            transform: translate3d(-1px, 0, 0);
        }

        40%,
        60% {
            transform: translate3d(1px, 0, 0);
        }
    }
</style>
