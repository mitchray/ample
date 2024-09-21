<script context="module">
    import { writable } from "svelte/store";

    // shared across component instances
    let recentRating = writable({
        type: null,
        id: null,
        rating: null,
    });

    // shared across component instances
    let recentFlag = writable({
        type: null,
        id: null,
        flag: null,
    });
</script>

<script>
    import { _ } from "svelte-i18n";
    import { API, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { updateQueue } from "~/logic/ui.js";

    export let type = null;
    export let data = {};

    let showAverageRatings = true;
    let ratingErrored = false;
    let flagErrored = false;
    const values = [1, 2, 3, 4, 5];

    $: ({ id, rating, flag, averagerating } = data);

    $: {
        if (
            $recentRating.type === type &&
            $recentRating.id === id &&
            $recentRating.rating !== rating
        ) {
            rating = $recentRating.rating;
            refreshAverageRating();
        }

        if (
            $recentFlag.type === type &&
            $recentFlag.id === id &&
            $recentFlag.flag !== flag
        ) {
            flag = $recentFlag.flag;
        }
    }

    // override for playlist_songs
    $: type = type === "playlist_songs" ? "song" : type;

    function handleRating() {
        ratingErrored = false;
        let parsedRating = parseInt(this.dataset.rating);
        let originalRating = rating;
        let newRating = parsedRating === rating ? 0 : parsedRating; // clear rating if it matches existing

        // update the displayed rating immediately
        rating = newRating;

        $API.rate({ type: type, id: id, rating: newRating }).then((result) => {
            if (result.error) {
                errorHandler("while rating", result.error);
                ratingErrored = true;

                // revert the displayed rating
                rating = originalRating;
            }

            if (!result.error) {
                recentRating.set({
                    type: type,
                    id: id,
                    rating: newRating,
                });

                // now update any items in the queue with the new rating
                let foundItems = $NowPlayingQueue.filter(
                    (item) => item.id === id && item.object_type === type,
                );

                foundItems.forEach((item) => {
                    item.rating = newRating;
                });

                updateQueue();
                refreshAverageRating();
            }
        });
    }

    function handleFlag() {
        flagErrored = false;
        let newFlag = flag ? 0 : 1;

        $API.flag({ type: type, id: id, flag: newFlag }).then((result) => {
            if (result.error) {
                errorHandler("while flagging", result.error);
                flagErrored = true;
                return;
            }

            if (!result.error) {
                flag = newFlag;
                recentFlag.set({
                    type: type,
                    id: id,
                    flag: newFlag,
                });

                // now update any items in the queue with the new fav
                let foundItems = $NowPlayingQueue.filter(
                    (item) => item.id === id && item.object_type === type,
                );

                foundItems.forEach((item) => {
                    item.flag = flag;
                });

                updateQueue();
            }
        });
    }

    function refreshAverageRating() {
        const apiMap = {
            song: () => $API.song({ filter: id }),
            album: () => $API.album({ filter: id }),
            artist: () => $API.artist({ filter: id }),
            playlist: () => $API.playlist({ filter: id }),
            podcast: () => $API.podcast({ filter: id }),
        };

        if (apiMap[type]) {
            apiMap[type]().then((r) => {
                if (!r.error) {
                    averagerating = r.averagerating;
                }
            });
        }
    }
</script>

<div class="c-rating" class:disabled={!id}>
    <div class="stars" class:errored={ratingErrored}>
        {#each values as ratingValue, i}
            <span
                on:click={handleRating}
                data-rating={ratingValue}
                class="star"
                class:filled={ratingValue <= rating}
            >
                <MaterialSymbol name="star" fill={rating > i} />
            </span>
        {/each}
    </div>

    <span
        class="flag"
        class:flagged={flag}
        on:click={handleFlag}
        class:errored={flagErrored}
    >
        <MaterialSymbol fill={flag || false} name="favorite" />
    </span>

    {#if averagerating && showAverageRatings}
        <sl-badge
            class="average"
            title={$_("text.ratingAverage")}
            variant="neutral"
            pill
            on:click={refreshAverageRating}
        >
            {averagerating.toFixed(1)}
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
