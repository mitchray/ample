<script>
    import { onMount } from 'svelte';
    import { Link } from 'svelte-routing';
    import { dndzone } from 'svelte-dnd-action';

    import { NowPlayingQueue, NowPlayingIndex, CurrentSong } from '../../stores/status';
    import { MediaPlayer } from '../../stores/player';

    import { timeSince } from "../../logic/helper";

    import Menu from '../../components/menu.svelte';
    import Actions from '../../components/actions.svelte';

    import SVGClose from "../../../public/images/close.svg";
    import SVGBin from "../../../public/images/delete.svg";
    import SVGPlaylistPlay from "../../../public/images/playlist_play.svg";
    import SVGArtist from "../../../public/images/artist.svg";
    import SVGAlbum from "../../../public/images/album.svg";
    import SVGCurrent from "../../../public/images/play_circle.svg";
    import SVGMore from "../../../public/images/more-hori.svg";

    let queueVisible = false;
    let nextSong;
    let staleTime = Date.now();
    let timeSinceTime = Date.now();
    let staleThreshold = 1000 * 60 * 60 * 3; // 3 hours

    let queueMoreMenuID;
    let queueMoreMenuIsOpen = false;

    $: queueMoreMenuID;
    $: nextSong = $NowPlayingQueue[$NowPlayingIndex + 1];
    $: staleTime = staleTime;
    $: timeSinceTime = timeSinceTime;

    function handleAction(event, index) {
        $MediaPlayer.playSelected(index);

        // clickOutsideHandler doesn't respond so manually turn off menus
        queueMoreMenuIsOpen = false;
    }

    const checkElement = async selector => {
        while ( document.querySelector(selector) === null) {
            await new Promise( resolve =>  requestAnimationFrame(resolve) )
        }
        return document.querySelector(selector);
    };

    function toggleQueue() {
        if ($NowPlayingQueue.length > 0) {
            queueVisible = !queueVisible;
        }

        showCurrentSong({behavior: 'auto'});
    }

    function showCurrentSong({behavior = 'smooth'}) {
        if (queueVisible) {
            checkElement('#c-queue .currentlyPlaying').then((selector) => {
                selector.scrollIntoView({
                    behavior: behavior,
                });
            });
        }
    }

    function handleRemove(index) {
        $NowPlayingQueue.splice(index, 1);

        // If playing song is removed, load new track
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

    function handleSongMenu(index) {
        queueMoreMenuID = index;
        queueMoreMenuIsOpen = !queueMoreMenuIsOpen;
    }

    function handleClearPlayed() {
        let foundIndex = 0;

        // find next item to remove, that isn't the currently playing song
        while (foundIndex !== -1) {
            foundIndex = $NowPlayingQueue.findIndex((item, index) => index !== $NowPlayingIndex && item.lastPlayed);

            if (foundIndex !== -1) {
                handleRemove(foundIndex);
            }
        }
    }

    function handleClearQueue() {
        $MediaPlayer.clearQueue();
        queueVisible = false;
    }

    function handleSort(e) {
        NowPlayingQueue.set([...e.detail.items]);

        let currentIndex = $NowPlayingQueue.findIndex(item => item._id === $CurrentSong._id);

        if (currentIndex !== -1) {
            NowPlayingIndex.set(currentIndex);
        }
    }

    onMount(() => {
        // how often to recalculate the last played times
        const timeSinceTimer = setInterval(() => {
            timeSinceTime = Date.now();
        }, 1000 * 30); // 30 seconds

        // check for stale songs and remove from queue
        const staleTimer = setInterval(() => {
            staleTime = Date.now();

            // remove any stale songs
            let indexes = $NowPlayingQueue.reduce( (a,curr,index) => {
                if (curr.lastPlayed + staleThreshold < staleTime) {
                    a.push(index);
                }

                return a;
            }, []);

            indexes.forEach(function(index) {
                // don't remove an old song being replayed, and preserve the previous 10 songs before current song
                if (index !== $NowPlayingIndex && index < $NowPlayingIndex - 10) {
                    handleRemove(index);
                }
            });
        }, 1000 * 60 * 10); // 10 minutes

        return () => {
            clearInterval(staleTimer);
            clearInterval(timeSinceTimer);
        };
    });
</script>


<div class="container well" id="c-queue">
    {#if $NowPlayingQueue && $NowPlayingQueue.length > 0}
        <div
            class="queue-slideout"
            class:visible={queueVisible}
        >
            <div class="header">
                <h4>Now Playing</h4>

                <button class="clear-played with-icon" on:click={handleClearPlayed}><SVGClose /> Remove played</button>
                <button class="clear-all with-icon danger" on:click={handleClearQueue}><SVGBin /> Clear all</button>
            </div>

            <div
                class="queue-list"
                use:dndzone={{
                    items: $NowPlayingQueue,
                    dropTargetStyle: {}
                }}
                on:consider={handleSort}
                on:finalize={handleSort}
            >
                {#each $NowPlayingQueue as song, i (song._id)}
                    <div
                        on:click={(e) => { handleAction(e, i) }}
                        class="queue-item"
                        class:currentlyPlaying={$NowPlayingIndex === i}
                    >
                        <button class="icon remove" on:click|stopPropagation={handleRemove(i)}><SVGClose /></button>
                        <span class="thumb">
                            <img src="{song.art}&thumb=1" alt="" loading="lazy"/>
                        </span>
                        {#if $NowPlayingIndex === i}
                            <span class="current-icon"><SVGCurrent class="icon" /></span>
                        {/if}
                        <span class="details">
                            <div class="queue-title" title="{song.name}">{song.name}</div>
                            <div class="queue-artist" title="{song.artist.name}"><SVGArtist class="inline"/> {song.artist.name}</div>
                        </span>
                        <button id="queueMoreToggle-{i}" class="icon more" on:click|stopPropagation={handleSongMenu(i)}><SVGMore /></button>
                        {#if song.lastPlayed}
                            {#key timeSinceTime + "" + song._id}
                                <span class="lastPlayed">{timeSince(new Date(song.lastPlayed))} ago</span>
                            {/key}
                        {/if}

                        {#if song.fromAutoPlay}
                            <span class="fromAutoPlay">From AutoPlay</span>
                        {/if}

                        {#if queueMoreMenuIsOpen && queueMoreMenuID === i}
                            <Menu anchor="left-center" toggleElement={document.querySelector('#queueMoreToggle-' + queueMoreMenuID)} bind:isVisible={queueMoreMenuIsOpen}>
                                <Actions
                                    type="song"
                                    mode="subMenu"
                                    id="{song.id}"
                                    count=1
                                    albumID="{song.album.id}"
                                    artistID="{song.artist.id}"
                                />
                            </Menu>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="footer">
                <button class="with-icon" on:click={showCurrentSong}><SVGCurrent /> Go to current song</button>
            </div>
        </div>
    {/if}

    <div class="queueInfo">
        <h4 class="queue-header">Queue</h4>
        {#if $NowPlayingQueue.length > 0}
            <span class="queue-details">{$NowPlayingQueue.length === 0 ? 0 : $NowPlayingIndex + 1} of {$NowPlayingQueue.length}</span>
        {/if}
        {#if $NowPlayingQueue.length < 2}
            <span style="display: block">No upcoming songs</span>
            <br>
        {/if}

        {#if nextSong}
            <div class="title"><span>Next:</span> {nextSong.title}</div>
            <div class="artist"><Link to="artists/{nextSong.artist.id}"><SVGArtist class="inline"/> {nextSong.artist.name}</Link></div>
        {/if}
    </div>

    <button
        class="with-icon queue-toggle"
        on:click={toggleQueue}
        disabled={$NowPlayingQueue.length === 0}
    >
        <SVGPlaylistPlay style="transform: scale(1.3)" />
    </button>
</div>


<style>
    :global(.current-icon) {
        margin-right: var(--spacing-sm);
        color: var(--color-link-active);
        flex-shrink: 0;
    }

    .queue-header {
        display: inline-block;
        margin-bottom: var(--spacing-md);
        color: var(--color-highlight);
    }

    .queue-toggle {
        height: unset; /* fill height */
        width: auto;
        padding: 0;
        flex-shrink: 0;
    }

    .queue-toggle :global(svg) {
        margin-left: 7px;
    }

    .container {
        display: flex;
        justify-content: space-between;
        padding-right: var(--spacing-sm);
        margin-right: var(--spacing-lg);
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        padding-left: var(--spacing-lg);
    }

    .header h4 {
        margin: 0;
        margin-right: auto;
    }

    .queue-slideout {
        background-color: var(--color-background);
        position: fixed;
        bottom: var(--size-webplayer-height);
        right: 0;
        width: 400px;
        border-radius: 10px;
        margin: 0 var(--spacing-lg) var(--spacing-lg) 0;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3),
            0 4px 6px -2px rgba(0,0,0,0.15);
        border: 2px solid var(--color-highlight);
        max-height: calc(100vh - 60px - var(--size-webplayer-height));
        display: flex;
        flex-direction: column;
        transition: opacity ease 300ms, transform ease-out 300ms;
        opacity: 0;
        transform: translateY(50px);
        pointer-events: none;
        z-index: 100;
    }

    @supports (backdrop-filter: blur(0)) {
        .queue-slideout {
            background-color: var(--color-interface);
            backdrop-filter: blur(10px) saturate(180%);
        }
    }

    .visible {
        opacity: 1;
        pointer-events: initial;
        transform: translateY(0);
    }

    .queue-list {
        overflow-y: auto;
    }

    .queue-list:after {
        content: '';
        padding: 1px;
        padding-top: 0;
        display: block;
    }

    .footer {
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
    }

    .queue-title {
        font-weight: 700;
    }

    .queue-title,
    .queue-artist {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .thumb {
        flex-shrink: 0;
        margin-right: var(--spacing-md);
    }

    .thumb img {
        height: 50px;
        width: 50px;
        border-radius: 2px;
    }

    .lastPlayed,
    .fromAutoPlay {
        position: absolute;
        opacity: 0.6;
        font-size: 0.8em;
        right: var(--spacing-sm);
    }

    .lastPlayed {
        top: var(--spacing-sm);
    }

    .fromAutoPlay {
        bottom: var(--spacing-sm);
    }

    .queue-item {
        display: flex;
        padding: var(--spacing-md);
        padding-left: 0;
        line-height: 1;
        align-items: center;
        user-select: none;
        cursor: pointer !important;
        background-color: var(--color-tint-50);
        position: relative;
    }

    .queue-item:hover {
        background-color: var(--color-tint-100);
    }

    .queue-item + .queue-item {
        margin-top: 2px;
    }

    .currentlyPlaying {
        color: var(--color-link-hover);
    }

    .details {
        display: flex;
        flex-direction: column;
        line-height: initial;
        justify-content: center;
        overflow: hidden;
    }

    .queueInfo {
        overflow: hidden;
        margin-right: var(--spacing-md);
    }

    .title {
        font-weight: 700;
    }

    .title span {
        font-weight: normal;
    }

    .title,
    .artist {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .remove {
        margin-left: var(--spacing-sm);
        margin-right: var(--spacing-sm);
    }

    .more {
        margin-left: auto;
    }
</style>