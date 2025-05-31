<script>
    import { _ } from "svelte-i18n";
    import { v4 as uuidv4 } from "uuid";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { User } from "~/stores/state.js";
    import { onDestroy, untrack } from "svelte";

    /** @type {{card: any, type: any, initialData?: any, refresh?: boolean, limit?: any, heading?: any, showOnlyThese?: boolean, dataProvider?: any, viewAllURL?: any, genericOverride?: boolean, autoRefreshInterval?: any, layout: 'grid' | 'scroll'}} */
    let {
        card,
        type,
        initialData = [],
        refresh = false,
        limit = $bindable(null),
        heading = null,
        showOnlyThese = false,
        dataProvider = null,
        viewAllURL = null,
        genericOverride = false,
        autoRefreshInterval = null,
        layout,
    } = $props();

    let data = $state([]);
    let newBatch = $state([]);
    let loadCount = $state(0);
    let loading = $state(true);
    let refreshLoop;

    let containerBind = $state();
    let containerScrollX = $state();
    let observer;

    const unsubscribe = User.subscribe((user) => {
        if (user.isLoggedIn && !refreshLoop) {
            console.log("[User] logged in, starting interval");
            init();

            // recent_songs has its own interval to check for fresh songs
            if (autoRefreshInterval) {
                clearInterval(refreshLoop);
                refreshLoop = window.setInterval(function () {
                    if ($User.isLoggedIn) {
                        getLatestUpdate();
                    }
                }, 1000 * autoRefreshInterval);
            }
        }
    });

    async function init() {
        // if starting off with preloaded data, kick off the loadCount
        if (initialData.length > 0) {
            data.push(...initialData);
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

        if (containerBind) {
            observer.observe(containerBind);
        }
    }

    onDestroy(() => {
        observer?.disconnect();
        clearInterval(refreshLoop);
        unsubscribe();
    });

    async function getLatestUpdate() {
        let latest = await getAPIResponse({
            limit: 1,
            page: 0,
        });

        if (latest.error) {
            errorHandler("getting latest update", latest.error);
        } else {
            if (latest[0]?.id !== data[0]?.id) {
                latest[0]._id = uuidv4(); // ensures unique key
                data = [latest[0], ...data];
            }
        }
    }

    // Append extra data to existing
    async function loadMore() {
        loading = true;

        newBatch = await getAPIResponse({
            limit: limit,
            page: loadCount,
        });

        if (newBatch.error) {
            errorHandler("loading more data", newBatch.error);
            newBatch = [];
        } else {
            loadCount++;
        }

        data.push(...newBatch);
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
        newBatch = await getAPIResponse({ limit: limit });

        if (newBatch.error) {
            errorHandler("loading more data", newBatch.error);
            newBatch = [];
        }

        data.push(...newBatch);
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

    async function getAPIResponse(params) {
        let response = await dataProvider(params);

        let result = [];

        switch (type) {
            case "song":
                result = response.song;
                break;
            case "album":
                result = response.album;
                break;
            case "artist":
                result = response.artist;
                break;
            case "playlist":
                result = response.playlist;
                break;
            case "mix":
                result = response;
                break;
            default:
                break;
        }

        return result;
    }
</script>

<div class="header">
    {#if heading}
        <h2 class="heading">{heading}</h2>
    {/if}

    {#if refresh}
        <sl-button onclick={refreshItems} size="small">
            <MaterialSymbol name="refresh" slot="prefix" />
            {$_("text.refresh")}
        </sl-button>
    {/if}

    {#if viewAllURL}
        <sl-button class="view-all" href={viewAllURL} size="small">
            {$_("text.viewAll")}
        </sl-button>
    {/if}

    {#if layout === "scroll"}
        <div class="scroll-buttons">
            <sl-button
                variant="text"
                size="small"
                onclick={() => {
                    scroll("start");
                }}
                disabled={containerScrollX < 1}
            >
                <MaterialSymbol name="arrow_left" />
            </sl-button>
            <sl-button
                variant="text"
                size="small"
                onclick={() => {
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
    onscroll={parseScroll}
>
    {#if loading && (loadCount < 1 || refresh) && limit}
        {#each Array(parseInt(limit)) as placeholder}
            {@const SvelteComponent = card}
            <li>
                <SvelteComponent {type} />
            </li>
        {/each}
    {:else if data.length > 0}
        {#each data as dataSingle}
            {@const SvelteComponent_1 = card}
            {#key dataSingle}
                <li>
                    <SvelteComponent_1 data={dataSingle} {type} />
                </li>
            {/key}
        {/each}
        {#if !refresh && !showOnlyThese}
            <li>
                <sl-button
                    onclick={loadMoreAndScroll}
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

    /* override specificity */
    :global(.cardlist-scroll.cardlist-scroll) {
        grid-column: full; /* extend beyond content boundary */
    }
</style>
