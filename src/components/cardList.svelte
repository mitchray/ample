<script>
    import { _ } from 'svelte-i18n';
    import { onMount, onDestroy } from 'svelte';
    import { v4 as uuidv4 } from "uuid";
    import SVGAdd from "/src/images/add.svg";
    import SVGRefresh from "/src/images/refresh.svg";
    import SVGLeft from "/src/images/arrow_left.svg";
    import SVGRight from "/src/images/arrow_right.svg";

    export let type;
    export let initialData = [];
    export let dataProvider = null;
    export let refresh = false;
    export let limit;
    export let heading = null;
    export let containerType = "grid";
    export let arg = null;
    export let showOnlyThese = false;
    export let useGenericCard = false;

    let data = [];
    let newBatch = [];
    let loadCount = 0;
    let loading = true;
    let recentSongLoop;

    let card;
    let logic;
    let containerClass;
    let options = {};
    let isScroll = false;
    let containerBind;
    let containerScrollX;
    let observer;

    $: data = [
        ...data,
        ...newBatch
    ];

    $: limit = limit;

    // Load initial data
    onMount(async () => {
        isScroll = (containerType === "scroll");

        switch (type) {
            case 'artist':
                logic = await import("../logic/artist");

                if (useGenericCard) {
                    card = (await import('../components/cardGeneric.svelte')).default;
                    containerClass = "cardlist-grid generic-grid";
                    options.type = type;
                } else {
                    card = (await import('../components/artist/artistCard.svelte')).default;
                    containerClass = (containerType === "grid") ? "cardlist-grid artist-grid" : "cardlist-scroll artist-scroll";
                }
                break;
            case 'album':
                logic = await import("../logic/album");

                if (useGenericCard) {
                    card = (await import('../components/cardGeneric.svelte')).default;
                    containerClass = "cardlist-grid generic-grid";
                    options.type = type;
                } else {
                    card = (await import('../components/album/albumCard.svelte')).default;
                    containerClass = (containerType === "grid") ? "cardlist-grid album-grid" : "cardlist-scroll album-scroll";
                }
                break;
            case 'song':
            case 'recent_songs':
                logic = await import("../logic/song");

                if (useGenericCard) {
                    card = (await import('../components/cardGeneric.svelte')).default;
                    containerClass = "cardlist-grid generic-grid";
                    options.type = type;
                } else {
                    card = (await import('../components/song/songCard.svelte')).default;
                    containerClass = (containerType === "grid") ? "cardlist-grid song-grid" : "cardlist-scroll song-scroll";
                }
                break;
            case 'playlist':
                logic = await import("../logic/playlist");

                if (useGenericCard) {
                    card = (await import('../components/cardGeneric.svelte')).default;
                    containerClass = "cardlist-grid generic-grid";
                    options.type = type;
                } else {
                    card = (await import('../components/playlist/playlistCard.svelte')).default;
                    containerClass = (containerType === "grid") ? "cardlist-grid playlist-grid" : "cardlist-scroll playlist-scroll";
                }
                break;
            case 'smartlist':
                logic = await import("../logic/playlist");

                if (useGenericCard) {
                    card = (await import('../components/cardGeneric.svelte')).default;
                    containerClass = "cardlist-grid generic-grid";
                    options.type = type;
                } else {
                    card = (await import('../components/playlist/playlistCard.svelte')).default;
                    containerClass = (containerType === "grid") ? "cardlist-grid playlist-grid" : "cardlist-scroll playlist-scroll";
                }
                options.isSmartlist = true;
                break;
            case 'artist_mix':
                logic = await import("../logic/playlist");
                card = (await import('../components/playlist/playlistMixCard.svelte')).default;
                containerClass = (containerType === "grid") ? "cardlist-grid mix-grid" : "cardlist-scroll mix-scroll";
                break;
            case 'genre':
                logic = await import("../logic/genre");
                card = (await import('../components/genre/genreCard.svelte')).default;
                containerClass = (containerType === "grid") ? "cardlist-grid genre-grid" : "cardlist-scroll genre-scroll";
                break;
            default:
                break;
        }

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
        observer = new ResizeObserver(entries => {
            parseScroll();
        });

        observer.observe(containerBind);

        // recent_songs has its own interval to check for fresh songs
        if (type === "recent_songs") {
            recentSongLoop = window.setInterval(function () {
                getMostRecentSong();
            }, 1000*5);
        }
    });

    onDestroy(() => {
        if (observer) {
            observer.disconnect();
        }

        clearInterval(recentSongLoop);
    });

    async function getMostRecentSong() {
        let newestSong = await logic[dataProvider]({query: arg, limit: 1, page: 0});

        if (newestSong[0].id !== data[0].id) {
            newestSong[0]._id = uuidv4();
            data = [newestSong[0], ...data];
        }
    }

    // Append extra data to existing
    async function loadMore() {
        loading = true;
        newBatch = await logic[dataProvider]({query: arg, limit: limit, page: loadCount});
        loading = false;
        loadCount++;
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
        newBatch = await logic[dataProvider]({query: arg, limit: limit});
        loading = false;
        parseScroll();
    }

    function scroll(direction) {
        let width = containerBind.clientWidth;
        let value = (direction === "end") ? width : -width;
        containerBind.scrollLeft += value;
    }

    function parseScroll() {
        containerScrollX = containerBind.scrollLeft;
    }
</script>

{#if heading || refresh}
    <h2 class="panel-title">
        {#if heading}
            {heading}
        {/if}

        {#if refresh}
            {#if heading}
                <button on:click={refreshItems} class="refresh-button"><SVGRefresh/></button>
            {:else}
                <button on:click={refreshItems} class="button button--tertiary"><SVGRefresh/> {$_('text.refresh')}</button>
            {/if}
        {/if}

        {#if isScroll}
            <div class="scroll-buttons">
                <button class="icon-button button--mini circle-button" on:click={() => { scroll("start") }} disabled={containerScrollX < 1}><SVGLeft style="transform: scale(130%)"/></button>
                <button class="icon-button button--mini circle-button" on:click={() => { scroll("end") }} disabled={containerScrollX > containerBind?.scrollWidth - containerBind?.clientWidth - 50}><SVGRight style="transform: scale(130%)"/></button>
            </div>
        {/if}
    </h2>
{/if}

<ul class="{containerClass}" bind:this={containerBind} on:scroll={parseScroll}>
    {#if loading && (loadCount < 1 || refresh) && limit}
        {#each Array(parseInt(limit)) as placeholder}
            <li>
                <svelte:component this={card} {...options} />
            </li>
        {/each}
    {:else}
        {#if data.length > 0}
            {#each data as dataSingle}
                {#if dataSingle.name}
                    <li>
                        <svelte:component this={card} data={dataSingle} {...options} />
                    </li>
                {/if}
            {/each}
            {#if !refresh}
                {#if !showOnlyThese}
                    <li>
                        <button on:click={loadMoreAndScroll} hidden={newBatch.length < limit} class="load-more-button icon-button button--regular"><SVGAdd /></button>
                    </li>
                {/if}
            {/if}
        {:else}
            <li><p>{$_('text.noItemsFound')}</p></li>
        {/if}
    {/if}
</ul>

<style>
    h2 {
        display: flex;
        align-items: center;
        font-size: 20px;
    }

    .refresh-button {
        margin-left: var(--spacing-md);
    }

    .load-more-button:not([hidden]) {
        height: 100%;
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
        margin-left: auto;
    }

    :global(.cardlist-grid) {
        display: grid;
        row-gap: var(--spacing-lg); /* default spacing */
        column-gap: var(--spacing-lg); /* default spacing */
    }

    :global(.cardlist-scroll) {
        padding-left: var(--content-padding);
        padding-right: var(--content-padding);
        overflow-x: scroll;
        scrollbar-width: none;
        display: flex;
        gap: var(--spacing-md); /* default spacing */
    }

    /* currently only Firefox supports scrollbar-width */
    :global(.cardlist-scroll::-webkit-scrollbar) {
        display: none;
    }

    :global(.cardlist-grid:not(:last-child), .cardlist-scroll:not(:last-child)) {
        margin-bottom: var(--spacing-xxl);
    }

    /* override specificity */
    :global(.cardlist-scroll.cardlist-scroll) {
        grid-column: full; /* extend beyond content boundary */
    }
</style>