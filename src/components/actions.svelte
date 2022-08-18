<script>
    // NOTE, before 'direct' is called it is spread into a new array,
    // otherwise it behaves as a copy of NowPlayingQueue

    import { tick } from 'svelte';
    import { Link } from 'svelte-routing';

    import { MediaPlayer } from "../stores/player";
    import { SkipBelow, SkipBelowRating } from "../stores/status";

    import {
        getSongsFromAlbum,
        getSongsFromArtist,
        getSongsFromPlaylist,
        getSong,
        getSongsByYear,
        getSongsFromAlbumsStartingWith,
        getSongsFromArtistsStartingWith,
        getSomeSongsFromArtistsByGenre,
        getSomeSongsFromAlbumsByGenre,
        getSomeSongsByGenre
    } from "../logic/song";
    import { getGenre } from "../logic/genre";
    import { shuffleArray } from "../logic/helper";
    import { updateFromTags, updateArt } from "../logic/library";

    import Menu from '../components/menu.svelte';
    import PlaylistAddTo from '../components/playlist/playlist_addTo.svelte';

    import SVGPlay from "../../public/images/play.svg";
    import SVGQueue from "../../public/images/playlist_add.svg";
    import SVGPlayNext from "../../public/images/menu_open.svg";
    import SVGShuffle from "../../public/images/shuffle.svg";
    import SVGMore from "../../public/images/more-hori.svg";
    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";

    export let type;          // artist, album, playlist, song etc
    export let mode;          // menu, miniButtons or fullButtons
    export let id = null;     // id of the item passed specified by type
    export let count = null;  // how many items
    export let direct = null; // play already loaded items instead of doing a new fetch
    export let data = null;   // any additional data to pass
    export let artistID = null;
    export let albumID = null;

    let fetchURL = null;
    let moreMenuVisible = false;
    let playlistAddIsVisible = false;
    let songsForPlaylistAdd = [];
    let container;

    let showPlay        = (count > 0 || count === null);
    let showPlayNext    = (count > 0 || count === null);
    let showPlayLast    = (count > 0 || count === null);
    let showShuffle     = (count > 1 || count === null);
    let showShuffleNext = (count > 1 || count === null);
    let showShuffleLast = (count > 1 || count === null);
    let showPlaylistAdd = true;
    let showGoToArtist  = artistID;
    let showGoToAlbum   = albumID;
    let showMore        = true;
    let showSkipBelow   = (type !== 'song');
    let showUpdateFromTags = (type === "artist" || type === "album" || type === "song");
    let showUpdateArt   = (type === "artist" || type === "album");

    async function determineFetchURL() {
        switch (type) {
            case 'artist':
                fetchURL = getSongsFromArtist(id);
                break;
            case 'artistAlpha':
                fetchURL = getSongsFromArtistsStartingWith(data.char);
                break;
            case 'artistGenre':
            case 'genre':
                if (data === null) {
                    let genre = await getGenre(id);
                    data = genre.name;
                }
                fetchURL = getSomeSongsFromArtistsByGenre(data);
                break;
            case 'album':
                fetchURL = getSongsFromAlbum(id);
                break;
            case 'albumGenre':
                fetchURL = getSomeSongsFromAlbumsByGenre(data);
                break;
            case 'albumAlpha':
                fetchURL = getSongsFromAlbumsStartingWith(data.char);
                break;
            case 'song':
                fetchURL = getSong(id);
                break;
            case 'songGenre':
                fetchURL = getSomeSongsByGenre(data);
                break;
            case 'playlist':
                fetchURL = getSongsFromPlaylist(id);
                break;
            case 'year':
                fetchURL = getSongsByYear(data.from, data.to);
                break;
            default:
                break;
        }

        return fetchURL;
    }

    async function handleSkipBelow() {
        await tick();
        localStorage.setItem('SkipBelow', JSON.stringify($SkipBelow));
        SkipBelow.set($SkipBelow);
    }

    async function handleSkipBelowRating() {
        await tick();
        let newValue = $SkipBelowRating;
        localStorage.setItem('SkipBelowRating', JSON.stringify(newValue));
        SkipBelowRating.set(newValue);
    }

    /**
     * Filter out songs below a specified rating
     * @param arr
     * @returns array
     */
    function filterBelow(arr) {
        // if length is 1 let's assume we want to play that item regardless of rating
        if (arr.length > 1 && $SkipBelow) {
            arr = arr.filter(item => item.rating >= $SkipBelowRating);
        }

        return arr;
    }

    function handlePlay(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNow(filterBelow([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playNow(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    function handlePlayNext(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNext(filterBelow([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playNext(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    function handlePlayLast(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playLast(filterBelow([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playLast(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffle(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNow(shuffleArray(filterBelow([...direct])));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playNow(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffleNext(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNext(filterBelow([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playNext(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffleLast(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playLast(filterBelow([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playLast(filterBelow(result));
                    endLoad(e.target, originalText);
                });
        }
    }

    // songsForPlaylistAdd is a bind
    async function handleAddToPlaylist() {
        playlistAddIsVisible = !playlistAddIsVisible;

        await tick();

        if (playlistAddIsVisible) {
            if (direct) {
                songsForPlaylistAdd = [...direct];
            } else {
                let query = determineFetchURL()
                    .then((result) => {
                        result = (Array.isArray(result)) ? result : [result];
                        songsForPlaylistAdd = result;
                    });
            }
        }
    }

    async function handleUpdateFromTags(e) {
        let originalText = startLoad(e.target);
        let result = await updateFromTags(type, id);

        if (result) {
            endLoad(e.target, originalText);
        }
    }

    async function handleUpdateArt(e) {
        let originalText = startLoad(e.target);
        let result = await updateArt(type, id);

        if (result) {
            endLoad(e.target, originalText);
        }
    }

    function handleMore() {
        moreMenuVisible = !moreMenuVisible;
    }

    function startLoad(el) {
        let dimensions = el.getBoundingClientRect();
        let original = el.innerHTML;
        el.style.width = dimensions.right - dimensions.left + 'px';
        el.style.height = dimensions.bottom - dimensions.top + 'px';
        el.classList.add('loading');
        el.innerHTML = '';

        return original;
    }

    function endLoad(el, text) {
        el.innerHTML = text;
        el.classList.remove('loading');
        el.style = null;
    }
</script>


{#if mode === 'menu' || mode === 'subMenu'}
    <div class="c-actions menu" bind:this={container}>
        {#if mode !== 'subMenu'}
            {#if showPlay}
                <div class="action">
                    <button type="button" class="primary" on:click={handlePlay} title="Play"><SVGPlay class="inline" /> </button>
                </div>
            {/if}

            {#if showShuffle}
                <div class="action">
                    <button type="button" class="secondary" on:click={handleShuffle} title="Shuffle" ><SVGShuffle class="inline" /> </button>
                </div>
            {/if}

            {#if showPlayNext}
                <div class="action">
                    <button type="button" on:click={handlePlayNext} title="Play next"><SVGPlayNext class="inline" /> </button>
                </div>
            {/if}

            {#if showPlayLast}
                <div class="action">
                    <button type="button" on:click={handlePlayLast} title="Add to queue"><SVGQueue class="inline" /> </button>
                </div>
            {/if}
        {/if}

        {#if showShuffleNext}
            <div class="action">
                <button type="button" on:click={handleShuffleNext} title="Shuffle next"><SVGShuffle class="inline" /> </button>
            </div>
        {/if}

        {#if showShuffleLast}
            <div class="action">
                <button type="button" on:click={handleShuffleLast} title="Shuffle last"><SVGShuffle class="inline" /> </button>
            </div>
        {/if}

        {#if showPlaylistAdd}
            <div class="action">
                <button type="button" id="js-action-playlist_{type}{mode}{id}" on:click={handleAddToPlaylist} title="Add to playlist"></button>
            </div>
        {/if}

        {#if showGoToArtist}
            <div class="action">
                <Link to="artists/{artistID}"><SVGArtist class="inline" /> Go to artist</Link>
            </div>
        {/if}

        {#if showGoToAlbum}
            <div class="action">
                <Link to="albums/{albumID}"><SVGAlbum class="inline" /> Go to album</Link>
            </div>
        {/if}

        {#if showUpdateFromTags}
            <div class="action">
                <button type="button" on:click={e => handleUpdateFromTags(e)} title="Update from tags"></button>
            </div>
        {/if}

        {#if showUpdateArt}
            <div class="action">
                <button type="button" on:click={e => handleUpdateArt(e)} title="Update {type === 'artist' ? 'artist image' : 'album art'}"></button>
            </div>
        {/if}

        {#if showSkipBelow}
            <div class="menu-separator"></div>

            <div class="filter-below">
                <label>
                    <input type="checkbox" bind:checked={$SkipBelow} on:change={handleSkipBelow} />
                    Skip songs below
                </label>

                <select bind:value={$SkipBelowRating} on:change={handleSkipBelowRating}>
                    <option value="1" selected={$SkipBelowRating === 1}>1 star</option>
                    <option value="2" selected={$SkipBelowRating === 2}>2 stars</option>
                    <option value="3" selected={$SkipBelowRating === 3}>3 stars</option>
                    <option value="4" selected={$SkipBelowRating === 4}>4 stars</option>
                    <option value="5" selected={$SkipBelowRating === 5}>5 stars</option>
                </select>
            </div>
        {/if}
    </div>
{/if}

{#if playlistAddIsVisible}
    <Menu anchor="left-center" toggleElement={document.querySelector("#js-action-playlist_" + type + mode + id)} bind:isVisible={playlistAddIsVisible}>
        <PlaylistAddTo bind:songs={songsForPlaylistAdd} bind:isVisible={playlistAddIsVisible} />
    </Menu>
{/if}

{#if mode === 'miniButtons' || mode === 'fullButtons'}
    <div class="c-actions {mode}" bind:this={container}>
        {#if showPlay}
            <div class="action">
                <button type="button" class="primary icon-button button--primary" on:click={handlePlay} title="Play"><SVGPlay /> </button>
            </div>
        {/if}

        {#if showShuffle}
            <div class="action">
                <button type="button" class="secondary icon-button button--secondary" on:click={handleShuffle} title="Shuffle"><SVGShuffle style="transform: scale(0.85);" /> </button>
            </div>
        {/if}

        <span class="group">
            {#if showPlayNext}
                <div class="action">
                    <button type="button" class="icon-button" on:click={handlePlayNext} title="Play next"><SVGPlayNext style="transform: scale(0.85);" /> </button>
                </div>
            {/if}

            {#if showPlayLast}
                <div class="action">
                    <button type="button" class="icon-button" on:click={handlePlayLast} title="Add to queue"><SVGQueue style="transform: scale(0.85);" /> </button>
                </div>
            {/if}

            {#if showMore}
                <div class="action" class:notification-badge={$SkipBelow} data-badge="{$SkipBelowRating}">
                    <button id="js-action-menu_{type}{mode}{id}" type="button" class="icon-button" on:click={handleMore} title="More"><SVGMore /> </button>
                </div>
            {/if}
        </span>

        {#if moreMenuVisible}
            <Menu anchor="bottom-center" toggleElement={document.querySelector("#js-action-menu_" + type + mode + id)} bind:isVisible={moreMenuVisible} >
                <div class="panel-content">
                    <svelte:self
                        {...$$props}
                        mode="subMenu"
                    />
                </div>
            </Menu>
        {/if}
    </div>
{/if}


<style>
    .filter-below label {
        display: block;
        margin-bottom: var(--spacing-sm);
    }

    .c-actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
    }

    .c-actions button,
    .c-actions :global(a) {
        display: inline-flex;
        align-items: center;
    }

    .c-actions button {
        margin: 0;
    }

    .c-actions :global(button.loading):after {
        display: none;
    }

    /*
     * MENU SPECIFIC
     */
    .c-actions.menu {
        flex-direction: column;
    }

    .c-actions.menu :global(svg) {
        height: 1em;
        width: auto;
    }

    /* resets so buttons and links appear identical */
    .c-actions.menu button,
    .c-actions.menu :global(a) {
        line-height: 1;
        border: 0;
        padding: 0.3em 0;
        width: 100%;
        color: var(--color-text-primary);
    }

    .c-actions.menu button {
        background-color: unset;
        border-radius: 0;
        box-shadow: none;
    }

    .c-actions.menu :global(a) {

    }

    .c-actions.menu button:after,
    .c-actions.fullButtons :global(.button--primary:after),
    .c-actions.fullButtons :global(.button--secondary:after) {
        content: attr(title);
    }

    .c-actions.menu :global(svg),
    .c-actions.fullButtons .button--primary :global(svg),
    .c-actions.fullButtons .button--secondary :global(svg) {
        margin-right: var(--spacing-sm);
    }

    /*
     * MINI BUTTONS SPECIFIC
     */
    .c-actions.miniButtons button {
        padding: 0;
    }

    /*
     * FULL BUTTONS SPECIFIC
     */
    .c-actions.fullButtons {
        margin-top: var(--spacing-lg);
        margin-bottom: var(--spacing-lg);
    }

    .c-actions.fullButtons .button--primary,
    .c-actions.fullButtons .button--secondary {
        padding-left: 1em;
        padding-right: 1em;
    }

    .group {
        display: inline-flex;
        flex-wrap: nowrap;
    }
</style>