<script context="module">
    import { writable } from 'svelte/store';

    import SVGClear from "../../public/images/remove_circle_outline.svg";
    import SVGStarFull from "../../public/images/star_full.svg";
    import SVGStarOutline from "../../public/images/star_outline.svg";
    import SVGFavoriteFull from "../../public/images/favorite_full.svg";
    import SVGFavoriteOutline from "../../public/images/favorite_outline.svg";

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
    import { setRating, setFlag } from "../logic/library";

    export let id = null;
    export let type = null;
    export let rating = null;
    export let flag = null;
    export let averageRating = null;

    let showAverageRatings = true;

    const values = [1, 2, 3, 4, 5];

    $: {
        if ($recentRating.type === type && $recentRating.id === id && $recentRating.rating !== rating) {
            rating = $recentRating.rating;
        }

        if ($recentFlag.type === type && $recentFlag.id === id && $recentFlag.flag !== flag) {
            flag = $recentFlag.flag;
        }
    }

    let update = Promise.resolve([]);

    function handleRating() {
        let newRating = parseInt(this.dataset.rating);

        update = setRating(type, id, newRating)
            .then((result) => {
                if (!result.error) {
                    rating = newRating;
                    recentRating.set({
                        type: type,
                        id: id,
                        rating: newRating
                    });
                }
            });
    }

    function handleFlag() {
        let newFlag = (flag ? 0 : 1);

        update = setFlag(type, id, newFlag)
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

<div class="c-rating">
    <span class="c-rating__clear" on:click={handleRating} data-rating="0">
        <SVGClear />
    </span>

    <ul class="c-rating__stars">
        {#each values as ratingValue, i}
            <li on:click={handleRating} data-rating="{ratingValue}" class="c-rating__star {rating === ratingValue ? 'current' : ''}">
                {#if rating > i}
                    <SVGStarFull />
                {:else}
                    <SVGStarOutline />
                {/if}
            </li>
        {/each}
    </ul>

    {#if averageRating && showAverageRatings}
        <span class="c-rating__average" title="Average from all users">
            ({averageRating})
        </span>
    {/if}

    <span on:click={handleFlag} class="c-rating__flag {flag ? 'flagged' : ''}">
        {#if flag}
            <SVGFavoriteFull />
        {:else}
            <SVGFavoriteOutline />
        {/if}
    </span>
</div>


<style>
    .c-rating__star,
    .c-rating__flag {
        transition: all 50ms linear;
    }

    .c-rating__star:hover,
    .c-rating__flag:hover {
        transform: scale(1.2);
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
    }
    
    .current,
    .flagged {
        opacity: 1;
    }

    .c-rating:hover .c-rating__stars {
        color: hsl(45, 100%, 60%);
    }

    :global(.theme-is-light) .c-rating:hover .c-rating__stars {
        color: hsl(35, 90%, 30%);
    }

    .c-rating:hover .c-rating__flag {
        color: hsl(0, 80%, 50%);
    }

    :global(.theme-is-light) .c-rating:hover .c-rating__flag {
        color: hsl(0, 80%, 40%);
    }
</style>

