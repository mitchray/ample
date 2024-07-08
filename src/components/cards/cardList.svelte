<script>
    import { _ } from "svelte-i18n";
    import { onDestroy, onMount } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    export let card; /* the card component to render */
    export let type;
    export let initialData = [];
    export let refresh = false;
    export let limit = null;
    export let heading = null;
    export let showOnlyThese = false;
    export let dataProvider = null; /* the API call to make, if any */
    export let viewAllURL = null; /* link to see all items */
    export let genericOverride = false; /* should be true when using generic cards */
    export let autoRefreshInterval = null; /* auto-refresh every X seconds */

    /** @type {'grid' | 'scroll'} */
    export let layout; /* layout to use for the card container */

    let data = [];
    let newBatch = [];
    let loadCount = 0;
    let loading = true;
    let refreshLoop;

    let isScroll = false;
    let containerBind;
    let containerScrollX;
    let observer;

    $: data = [...data, ...newBatch];

    $: limit = limit;

    // Load initial data
    onMount(async () => {
        isScroll = layout === "scroll";

        // if starting off with preloaded data, kick off the loadCount
        if (initialData.length > 0) {
            newBatch = initialData;
            loading = false;
            loadCount++;
        } else {
            await loadMore();
        }

        // initial parse (then onScroll event takes over)
        parseScroll();

        // also reparse on resize as a failsafe
        observer = new ResizeObserver(() => {
            parseScroll();
        });

        observer.observe(containerBind);

        // recent_songs has its own interval to check for fresh songs
        if (autoRefreshInterval) {
            refreshLoop = window.setInterval(function () {
                getLatestUpdate();
            }, 1000 * autoRefreshInterval);
        }
    });

    onDestroy(() => {
        if (observer) {
            observer.disconnect();
        }

        clearInterval(refreshLoop);
    });

    async function getLatestUpdate() {
        let latest = await dataProvider({
            limit: 1,
            page: 0,
        });

        if (latest.error) {
            errorHandler("getting latest update", latest.error);
        } else {
            if (latest[0].id !== data[0].id) {
                latest[0]._id = uuidv4(); // ensures unique key
                data = [latest[0], ...data];
            }
        }
    }

    // Append extra data to existing
    async function loadMore() {
        loading = true;

        newBatch = await dataProvider({
            limit: limit,
            page: loadCount,
        });

        if (newBatch.error) {
            errorHandler("loading more data", newBatch.error);
            newBatch = [];
        } else {
            loadCount++;
        }

        loading = false;
    }

    async function loadMoreAndScroll() {
        await loadMore();

        if (loadCount > 0) {
            scroll("end");
        }
    }

    // Replace existing data with new
    async function refreshItems() {
        loading = true;
        data = [];
        newBatch = [];
        newBatch = await dataProvider({ limit: limit });
        loading = false;
        parseScroll();
    }

    function scroll(direction) {
        if (!containerBind) return;
        let width = containerBind.clientWidth;
        let value = direction === "end" ? width : -width;
        containerBind.scrollLeft += value;
    }

    function parseScroll() {
        if (!containerBind) return;
        containerScrollX = containerBind.scrollLeft;
    }
</script>

<div class="header">
    {#if heading}
        <h2 class="heading">{heading}</h2>
    {/if}

    {#if refresh}
        <sl-button on:click={refreshItems} size="small">
            <MaterialSymbol name="refresh" slot="prefix" />
            Refresh
        </sl-button>
    {/if}

    {#if viewAllURL}
        <sl-button class="view-all" href={viewAllURL} size="small">
            View all
        </sl-button>
    {/if}

    {#if isScroll}
        <div class="scroll-buttons">
            <sl-button
                variant="text"
                size="small"
                on:click={() => {
                    scroll("start");
                }}
                disabled={containerScrollX < 1}
            >
                <MaterialSymbol name="arrow_left" />
            </sl-button>
            <sl-button
                variant="text"
                size="small"
                on:click={() => {
                    scroll("end");
                }}
                disabled={containerScrollX >
                    containerBind?.scrollWidth -
                        containerBind?.clientWidth -
                        50}
            >
                <MaterialSymbol name="arrow_right" />
            </sl-button>
        </div>
    {/if}
</div>

<ul
    bind:this={containerBind}
    class="cardlist-{layout} {genericOverride ? 'generic' : type}-{layout}"
    on:scroll={parseScroll}
>
    {#if loading && (loadCount < 1 || refresh) && limit}
        {#each Array(parseInt(limit)) as placeholder}
            <li>
                <svelte:component this={card} {type} />
            </li>
        {/each}
    {:else if data.length > 0}
        {#each data as dataSingle}
            {#key dataSingle}
                <li>
                    <svelte:component this={card} data={dataSingle} {type} />
                </li>
            {/key}
        {/each}
        {#if !refresh && !showOnlyThese}
            <li>
                <sl-button
                    on:click={loadMoreAndScroll}
                    hidden={newBatch.length < limit}
                    class="load-more-button"
                >
                    <MaterialSymbol name="add" />
                </sl-button>
            </li>
        {/if}
    {:else}
        <li><p>{$_("text.noItemsFound")}</p></li>
    {/if}
</ul>

<style>
    .header {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
    }

    .heading {
        font-size: 20px;
    }

    ul {
        margin: var(--spacing-md) 0 0;
        scroll-behavior: smooth;
        scroll-padding-inline-start: var(--content-padding);
        scroll-snap-type: x;
    }

    ul:not(:last-of-type) {
        margin-block-end: var(--spacing-xxxl);
    }

    li {
        scroll-snap-align: start;
    }

    li:last-of-type {
        scroll-snap-align: end;
    }

    .scroll-buttons {
        margin-inline-start: auto;
    }

    .scroll-buttons sl-button::part(base) {
        font-size: 20px;
    }

    :global(.cardlist-grid) {
        display: grid;
        row-gap: var(--spacing-lg); /* default spacing */
        column-gap: var(--spacing-lg); /* default spacing */
    }

    :global(.cardlist-scroll) {
        padding-inline-start: var(--content-padding);
        padding-inline-end: var(--content-padding);
        overflow-x: scroll;
        scrollbar-width: none;
        display: flex;
        gap: var(--spacing-lg); /* default spacing */
    }

    /* currently only Firefox supports scrollbar-width */
    :global(.cardlist-scroll::-webkit-scrollbar) {
        display: none;
    }

    :global(
            .cardlist-grid:not(:last-child),
            .cardlist-scroll:not(:last-child)
        ) {
        margin-block-end: var(--spacing-xxl);
    }

    /* override specificity */
    :global(.cardlist-scroll.cardlist-scroll) {
        grid-column: full; /* extend beyond content boundary */
    }
</style>
