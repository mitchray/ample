<script>
    import { _ } from "@rgglez/svelte-i18n";
    import {
        CurrentMedia,
        NowPlayingIndex,
        NowPlayingQueue,
        JukeboxQueue,
    } from "~/stores/state";
    import { Settings } from "~/stores/settings.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { updateQueue } from "~/logic/ui.js";
    import Actions from "~/components/action/actions.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import Art from "~/components/art.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import MiniRating from "~/components/rating/miniRating.svelte";

    let { media = $bindable(), queueType } = $props();

    let matchesRating = $state();

    function retest() {
        matchesRating = !$MediaPlayer.isEligibleToPlay(media);
    }

    async function handlePlayNow(uuid) {
        if (queueType === "user") {
            let index = $NowPlayingQueue.findIndex((item) => item._id === uuid);
            if (index === -1) return;

            $MediaPlayer.playSelected(index);
        }
    }

    async function handlePlayNext(uuid) {
        let index = $JukeboxQueue.findIndex((item) => item._id === uuid);
        if (index === -1) return;

        let [item] = $JukeboxQueue.splice(index, 1);
        $MediaPlayer.playNext([item]);
        await updateQueue();
    }

    async function handlePlayLast(uuid) {
        let index = $JukeboxQueue.findIndex((item) => item._id === uuid);
        if (index === -1) return;

        let [item] = $JukeboxQueue.splice(index, 1);
        $MediaPlayer.playLast([item]);
        await updateQueue();
    }

    async function handleRemoveItem(uuid) {
        if (queueType === "user") {
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
        } else {
            let index = $JukeboxQueue.findIndex((item) => item._id === uuid);
            if (index === -1) return;

            $JukeboxQueue.splice(index, 1);
        }

        await updateQueue();
    }

    $effect(() => {
        (media, retest());
        ($Settings.SkipBelow.enabled, retest());
        ($Settings.SkipBelow.rating, retest());
        ($Settings.SkipBelow.allowZero, retest());
    });
</script>

<div
    class="queue-item"
    class:currentlyPlaying={$CurrentMedia?._id === media._id}
    class:matches-rating-threshold={matchesRating}
    onclick={(e) => {
        handlePlayNow(media._id);
    }}
>
    {#if queueType === "jukebox"}
        <div class="add-options">
            <sl-button
                onclick={(e) => {
                    handlePlayNext(media._id);
                }}
                title={$_("text.playNext")}
            >
                <MaterialSymbol name="skip_next" slot="prefix" />
            </sl-button>
            <sl-button
                onclick={(e) => handlePlayLast(media._id)}
                title={$_("text.playLast")}
            >
                <MaterialSymbol name="add" slot="prefix" />
            </sl-button>
        </div>
    {/if}

    <sl-button
        class="remove"
        onclick={(e) => {
            handleRemoveItem(media._id);
        }}
        variant="text"
    >
        <MaterialSymbol name="close" />
    </sl-button>

    <span class="thumb">
        <Art
            data={media}
            radius="2px"
            size="thumbnail"
            type={media.object_type}
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
        class="more"
        onclick={(e) => {
            e.stopPropagation();
        }}
    >
        <sl-button slot="trigger" variant="text">
            <MaterialSymbol name="more_horiz" />
        </sl-button>

        <Actions
            items={[media]}
            showLinks={true}
            type={media.object_type}
            displayMode="menu"
            showPlayFromHere={false}
        />
    </sl-dropdown>
</div>

<style>
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
        /*cursor: grab;*/
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

    .add-options {
        display: flex;
        justify-content: end;
        align-items: center;
        gap: var(--spacing-md);
        position: absolute;
        inset: 0;
        inset-inline-start: var(--spacing-xl);
        inset-inline-end: var(--spacing-xxxl);
        padding-inline-end: var(--spacing-md);
        z-index: 10;
        opacity: 0;
        pointer-events: none;
    }

    .add-options:after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-color: var(--color-background);
        mask-image: linear-gradient(to right, transparent 30%, black 60%);
        z-index: -1;
    }

    .queue-item:hover .add-options {
        opacity: 1;
        pointer-events: auto;
    }
</style>
