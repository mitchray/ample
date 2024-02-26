<script>
    import {
        CurrentMedia,
        NowPlayingQueue,
        NowPlayingIndex,
    } from "~/stores/state";
    import {
        SkipBelow,
        SkipBelowAllowZero,
        SkipBelowRating,
    } from "~/stores/settings.js";
    import { ticks } from "~/logic/ui.js";
    import Actions from "~/components/action/actions.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import Art from "~/components/art.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import MiniRating from "~/components/rating/miniRating.svelte";
    import { MediaPlayer } from "~/stores/elements.js";

    export let media;
    export let dragDisabled;

    let matchesRating;

    $: {
        media, retest();
        $SkipBelow, retest();
        $SkipBelowRating, retest();
        $SkipBelowAllowZero, retest();
    }

    function retest() {
        matchesRating = !$MediaPlayer.isEligibleToPlay(media);
    }

    function startDrag(e) {
        // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
        e.preventDefault();
        dragDisabled = false;
    }

    function handleRemoveItem(uuid) {
        let index = $NowPlayingQueue.findIndex((item) => item._id === uuid);

        if (index === -1) return;

        $NowPlayingQueue.splice(index, 1);

        // If playing media is removed, load new media
        if ($NowPlayingIndex === index) {
            $MediaPlayer.stop();
            $MediaPlayer.start();
        }

        // account for removal of previous items affected NowPlayingIndex
        if ($NowPlayingIndex > index) {
            NowPlayingIndex.set($NowPlayingIndex - 1);
        }

        $NowPlayingQueue = $NowPlayingQueue;
    }
</script>

<div
    class="queue-item"
    class:currentlyPlaying={$CurrentMedia?._id === media._id}
    class:errored={media.errored}
    class:matches-rating-threshold={matchesRating}
>
    <sl-button
        class="remove"
        on:click|stopPropagation={handleRemoveItem(media._id)}
        variant="text"
    >
        <MaterialSymbol name="close" />
    </sl-button>

    <span class="thumb" on:mousedown={startDrag} on:touchstart={startDrag}>
        <Art
            size="thumbnail"
            data={media}
            type={media.object_type}
            radius="2px"
        />
    </span>

    {#if $CurrentMedia?._id === media._id}
        <span class="current-icon">
            <MaterialSymbol name="play_circle" />
        </span>
    {/if}

    <span class="details">
        <div class="title truncate" title={media.name}>
            {media.name}
        </div>

        {#if media.artists?.length > 0}
            <div class="secondary-info truncate">
                <ArtistList data={media} disabled={true} />
            </div>
        {/if}

        {#if media.object_type === "live_stream"}
            <div class="secondary-info truncate">
                {media.site_url}
            </div>
        {/if}

        {#if media.object_type === "podcast_episode"}
            <div class="secondary-info truncate">
                {media.podcast?.name}
            </div>
        {/if}

        {#if media.object_type !== "live_stream"}
            <div class="mini-rating">
                <MiniRating data={media} />
            </div>
        {/if}
    </span>

    <sl-dropdown
        on:click|stopPropagation
        class="more"
        on:sl-show={async () => {
            media.isActionsLoaded = true;
            await ticks(2);
        }}
    >
        <sl-button slot="trigger" variant="text">
            <MaterialSymbol name="more_horiz" />
        </sl-button>

        {#if media.isActionsLoaded}
            <Actions
                item={media}
                showLinks={true}
                type={media.object_type}
                displayMode="menu"
            />
        {/if}
    </sl-dropdown>

    <div class="test">
        <sl-rating value={media.rating}></sl-rating>
    </div>
</div>

<style>
    .test {
        position: absolute;
        pointer-events: none;
        display: flex;
        width: 100%;
        justify-content: center;
        /*background-color: red;*/
        filter: grayscale(100%);
        opacity: 0;
    }

    .mini-rating {
        /*line-height: 3px;*/
        margin-block-start: 3px;
    }

    .thumb {
        flex-shrink: 0;
        margin-inline-end: var(--spacing-md);
        line-height: 0;
        height: 38px;
        width: 38px;
        cursor: grab;
    }

    :global(.queue-dragging) .thumb {
        cursor: grabbing;
    }

    .queue-item {
        display: flex;
        padding: var(--spacing-sm) var(--spacing-md);
        padding-inline-start: 0;
        line-height: 1;
        align-items: center;
        user-select: none;
        cursor: pointer;
        position: relative;
    }

    .errored {
        opacity: 0.6;
    }

    .current-icon {
        margin-inline-end: var(--spacing-sm);
    }

    .queue-item.currentlyPlaying {
        background-color: var(--color-tertiary-container-variant);
        color: var(--color-on-tertiary-container);
    }

    .queue-item.currentlyPlaying .secondary-info {
        color: var(--color-on-tertiary-container-variant);
    }

    .details {
        display: flex;
        flex-direction: column;
        line-height: initial;
        justify-content: center;
        overflow: hidden;
    }

    .remove {
        margin-inline-start: var(--spacing-md);
        margin-inline-end: var(--spacing-md);
        width: 20px;
    }

    .queue-item .more {
        margin-inline-start: auto;
    }

    :global(.queue-dragging) .queue-item {
        cursor: grabbing;
    }

    .queue-item + .queue-item {
        margin-block-start: 2px;
    }

    .matches-rating-threshold:after {
        content: "";
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 0;
        background-color: var(--color-on-surface);
        mask-image: url("/src/assets/stripe.svg");
        z-index: 1;
        opacity: 0.4;
        pointer-events: none;
    }
</style>
