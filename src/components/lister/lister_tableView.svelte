<script>
    import { onMount, getContext, onDestroy, tick } from "svelte";

    import Columns from "./lister_columns.svelte";
    import TableRow from "./lister_tableRow.svelte";
    import Virtual from "./lister_virtual.svelte";
    import { ShowSongsByOtherArtists } from "~/stores/settings.js";

    export let contextKey;

    const {
        dataDisplay,
        dataFinal,
        offsetY,
        listerObject,
        listerScroller,
        listerHeader,
        listerContainer,
        pseudoHeight,
    } = getContext(contextKey);
    let bindForName;
    let observerName;

    onMount(async () => {
        // initialise syncscroll
        syncscroll.reset();

        const container = $listerContainer;

        await tick();

        let headerName = $listerContainer?.querySelector(".header .name");
        let marginName = "0px 0px 0px 0px";

        // needs separate IntersectionObservers otherwise only one works at a time

        // apply shadow when .name becomes sticky
        observerName = new IntersectionObserver(
            ([e]) =>
                container.classList.toggle(
                    "scroll-start",
                    e.intersectionRatio < 1,
                ),
            { root: bindForName, rootMargin: marginName, threshold: 1 },
        );

        if (headerName) {
            observerName.observe(headerName);
        }
    });

    onDestroy(() => {
        if (observerName) {
            observerName.disconnect();
        }
    });
</script>

<Virtual {contextKey} />

<div
    class="header-flex syncscroll"
    name="listerhack-{contextKey}"
    bind:this={bindForName}
>
    <div class="header">
        <Columns bind:this={$listerHeader} {contextKey} />
    </div>
</div>

<div
    class="lister-flex syncscroll"
    name="listerhack-{contextKey}"
    bind:this={$listerScroller}
>
    <div
        class="lister"
        bind:this={$listerObject}
        style="height: {$pseudoHeight};"
    >
        {#each $dataFinal as row, i (row)}
            <div
                class="row"
                style="top: {$offsetY}"
                class:not-by-artist={row.notByArtist}
                class:hide={$ShowSongsByOtherArtists === "hide"}
                class:highlight={$ShowSongsByOtherArtists === "highlight"}
            >
                {#if !row.isDeleted}
                    <TableRow item={row} {contextKey} />
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .header-flex {
        display: flex;
        flex-shrink: 0;
        flex-grow: 0;
        position: sticky;
        inset-block-start: calc(var(--spacing-xxl) * -1);
        z-index: 5;
        overflow: hidden auto;
    }

    .lister-flex {
        display: flex;
        flex: 1;
        overflow: auto;
    }

    .header :global(.actions) {
        inset-inline-end: 0;
    }

    .header > :global(div) {
        text-align: start;
        background-color: var(--color-background);
        border-block-end: 2px solid var(--color-outline-variant);
        position: relative;
    }

    .row > :global(div) {
        background-color: var(--color-background);
        border-block-end: 1.4px solid var(--color-outline-variant); /* thicker line to alleviate transform rounding */
    }

    /* show full lister if not enough room to have name and action columns always present */
    @container lister-wrapper (min-width: 600px) {
        .header :global(.name) {
            position: sticky;
            inset-block-start: 0;
            z-index: 3;
        }

        .lister :global(.name) {
            position: sticky;
            z-index: 1;
        }

        .header :global(.name),
        .lister :global(.name) {
            inset-inline-start: -1px;
        }
    }

    .header :global(> div),
    .row :global(> div) {
        padding: var(--spacing-md) var(--spacing-lg);
    }

    /* can't use transform/translate anymore otherwise dropdowns are cut off */
    .row {
        display: flex;
        position: relative; /* needed for top: offsetY */
    }

    .header,
    .lister {
        display: flex;
    }

    .lister {
        flex-direction: column;
    }

    :global(.lister-container.being-resized) {
        user-select: none;
    }

    .row :global(a),
    .row :global(ul),
    .row :global(span) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .header :global(.cell),
    .row :global(.cell) {
        display: flex;
        align-items: center;
    }
</style>
