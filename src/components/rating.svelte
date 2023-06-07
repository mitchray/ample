<script context="module">
    import { writable } from 'svelte/store';

    import SVGStarFull from "/src/images/star_full.svg";
    import SVGStarOutline from "/src/images/star_outline.svg";
    import SVGFavoriteFull from "/src/images/favorite_full.svg";
    import SVGFavoriteOutline from "/src/images/favorite_outline.svg";

    // shared across component instances
    let recentRating = writable({
        type: null,
        id: null,
        rating: null
    });

    // shared across component instances
    let recentFlag = writable({
        type: null,
        id: null,
        flag: null
    });
</script>

<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../stores/api";

    export let id = null;
    export let type = null;
    export let rating = null;
    export let flag = null;
    export let averageRating = null;

    let showAverageRatings = true;
    let pendingRating = null;
    let loading = false;

    const values = [1, 2, 3, 4, 5];

    $: {
        if ($recentRating.type === type && $recentRating.id === id && $recentRating.rating !== rating) {
            rating = $recentRating.rating;
        }

        if ($recentFlag.type === type && $recentFlag.id === id && $recentFlag.flag !== flag) {
            flag = $recentFlag.flag;
        }
    }

    function handleRating() {
        loading = true;

        let parsedRating = parseInt(this.dataset.rating);

        // clear rating if it matches existing
        let newRating = (parsedRating === rating) ? 0 : parsedRating;

        pendingRating = newRating;

        $API.rate({ type: type, id: id, rating: newRating })
            .then((result) => {
                if (!result.error) {
                    rating = newRating;
                    recentRating.set({
                        type: type,
                        id: id,
                        rating: newRating
                    });

                    loading = false;
                }
            });
    }

    function handleFlag() {
        let newFlag = (flag ? 0 : 1);

        $API.flag({ type: type, id: id, flag: newFlag })
            .then((result) => {
                if (!result.error) {
                    flag = newFlag;
                    recentFlag.set({
                        type: type,
                        id: id,
                        flag: newFlag
                    });
                }
            });
    }
</script>

<div class="c-rating" class:disabled={!id}>
    <ul class="c-rating__stars">
        {#each values as ratingValue, i}
            <li on:click={handleRating} data-rating="{ratingValue}" class="c-rating__star" class:current={rating === ratingValue} class:new={loading && pendingRating === ratingValue}>
                {#if rating > i}
                    <SVGStarFull />
                {:else}
                    <SVGStarOutline />
                {/if}
            </li>
        {/each}
    </ul>

    <span on:click={handleFlag} class="c-rating__flag" class:flagged={flag}>
        {#if flag}
            <SVGFavoriteFull />
        {:else}
            <SVGFavoriteOutline />
        {/if}
    </span>

    {#if averageRating && showAverageRatings}
        <span class="c-rating__average" title="{$_('text.ratingAverage')}">
            ({averageRating})
        </span>
    {/if}
</div>


<style>
    .c-rating__star,
    .c-rating__flag {
        transition: all 50ms linear;
    }

    @media (hover: hover) {
        .c-rating__star:hover,
        .c-rating__flag:hover {
            transform: scale(1.2);
        }
    }

    ul {
        margin: 0;
    }

    li {
        cursor: pointer;
        display: inline-block;
        opacity: 0.6;
    }

    span {
        cursor: pointer;
    }
    
    .c-rating {
        display: inline-flex;
        align-items: center;
        line-height: 0;
    }

    .c-rating.disabled {
        pointer-events: none;
        opacity: 0.7;
    }

    .c-rating__stars {
        display: flex;
    }

    .c-rating__flag {
        padding: 0;
        padding-left: var(--spacing-sm);
        opacity: 0.6;
    }

    .c-rating__average {
        cursor: default;
        padding-left: var(--spacing-sm);
    }
    
    .current,
    .flagged {
        opacity: 1;
    }

    .new {
        animation-name: spin;
        animation-duration: 1s;
        animation-delay: 0.1s;
        animation-timing-function: ease-in;
    }

    @keyframes spin {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (hover: hover) {
        .c-rating:hover .c-rating__stars {
            color: var(--color-rating);
        }

        .c-rating:hover .c-rating__flag {
            color: var(--color-favorite);
        }
    }
</style>

