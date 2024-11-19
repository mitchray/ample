<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { data = {} } = $props();
</script>

<span class="c-mini-rating container">
    {#each Array(data.rating || 0) as star}
        <span class="item star filled"><MaterialSymbol name="circle" /></span>
    {/each}

    {#each Array(5 - data.rating || 0) as star}
        <span class="item star empty"><MaterialSymbol name="circle" /></span>
    {/each}

    {#if data.flag}
        <span class="item fav">
            <MaterialSymbol name="favorite" />
        </span>
    {/if}
</span>

<style>
    .container {
        display: flex;
        pointer-events: none;
        gap: 2px;
        /*background-color: blue;*/
        font-size: 5px;
        line-height: 0;
        align-items: center;
    }

    .star {
        width: 1em;
        height: 1em;
        border-radius: 50%;
    }

    .star.filled {
        color: var(--color-rating);
    }

    .star.empty {
        opacity: 0.3;
        transform: scale(0.8);
    }

    .fav {
        color: var(--color-favorite);
        transform: scale(1.1);
        padding-inline-start: 2px;
    }
</style>
