<script>
    // NOTE, before 'direct' is called it is spread into a new array,
    // otherwise it behaves as a copy of NowPlayingQueue

    import { tick } from 'svelte';
    import { Link } from 'svelte-routing';

    import { MediaPlayer } from "../stores/player";

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
    import { shuffleArray } from "../logic/helper";

    import Menu from '../components/menu.svelte';
    import PlaylistAddTo from '../components/playlists/playlist_addTo.svelte';

    import SVGPlay from "../../public/images/play.svg";
    import SVGQueue from "../../public/images/playlist_add.svg";
    import SVGPlayNext from "../../public/images/menu_open.svg";
    import SVGShuffle from "../../public/images/shuffle.svg";
    import SVGMore from "../../public/images/more-hori.svg";
    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";

    export let type;           // artist, album, playlist, song etc
    export let mode;           // menu, miniButtons or fullButtons
    export let id = null;      // id of the item passed specified by type
    export let count = null;   // how many items
    export let direct = null; // play already loaded items instead of doing a new fetch
    export let data = null;    // any additional data to pass
    export let artistID = null;
    export let albumID = null;

    let fetchURL = null;
    let message = "";
    let moreMenuVisible = false;
    let moreToggle;
    let playlistAddToggle;
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

    function determineFetchURL() {
        switch (type) {
            case 'artist':
                fetchURL = getSongsFromArtist(id);
                break;
            case 'artistAlpha':
                fetchURL = getSongsFromArtistsStartingWith(data.char);
                break;
            case 'artistGenre':
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

    function handlePlay(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNow([...direct]);
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playNow(result);
                    endLoad(e.target, originalText);
                });
        }
    }

    function handlePlayNext(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNext([...direct]);
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playNext(result);
                    endLoad(e.target, originalText);
                });
        }
    }

    function handlePlayLast(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playLast([...direct]);
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    $MediaPlayer.playLast(result);
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffle(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNow(shuffleArray([...direct]));
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playNow(result);
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffleNext(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playNext([...direct]);
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playNext(result);
                    endLoad(e.target, originalText);
                });
        }
    }

    function handleShuffleLast(e) {
        let originalText = startLoad(e.target);

        if (direct) {
            $MediaPlayer.playLast([...direct]);
            endLoad(e.target, originalText);
        } else {
            let query = determineFetchURL()
                .then((result) => {
                    result = (Array.isArray(result)) ? result : [result];
                    result = shuffleArray(result);
                    $MediaPlayer.playLast(result);
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
                <button type="button" class="primary" on:click={handlePlay} title="Play"><SVGPlay /> </button>
            </div>
        {/if}

        {#if showShuffle}
            <div class="action">
                <button type="button" class="secondary" on:click={handleShuffle} title="Shuffle"><SVGShuffle style="padding: 0.15em;" /> </button>
            </div>
        {/if}

        {#if showPlayNext}
            <div class="action">
                <button type="button" on:click={handlePlayNext} title="Play next"><SVGPlayNext style="padding: 0.15em;" /> </button>
            </div>
        {/if}

        {#if showPlayLast}
            <div class="action">
                <button type="button" on:click={handlePlayLast} title="Add to queue"><SVGQueue style="padding: 0.15em;" /> </button>
            </div>
        {/if}

        {#if showMore}
            <div class="action">
                <button id="js-action-menu_{type}{mode}{id}" type="button" on:click={handleMore} title="More"><SVGMore /> </button>
            </div>
        {/if}

        {#if moreMenuVisible}
            <Menu anchor="bottom-center" toggleElement={document.querySelector("#js-action-menu_" + type + mode + id)} bind:isVisible={moreMenuVisible} >
                <svelte:self
                    {...$$props}
                    mode="subMenu"
                />
            </Menu>
        {/if}
    </div>
{/if}


<style>
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
        padding: 0.3em 0.6em;
        width: 100%;
        color: var(--color-text-body);
    }

    .c-actions.menu button:hover,
    .c-actions.menu :global(a:hover) {
        color: var(--color-link-hover);
    }

    .c-actions.menu button {
        background-color: unset;
        border-radius: 0;
        box-shadow: none;
    }

    .c-actions.menu :global(a) {

    }

    .c-actions.menu button:after,
    .c-actions.fullButtons button.primary:after,
    .c-actions.fullButtons button.secondary:after {
        content: attr(title);
    }

    .c-actions.menu :global(svg),
    .c-actions.fullButtons button.primary :global(svg),
    .c-actions.fullButtons button.secondary :global(svg) {
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

    .c-actions.fullButtons button {
        padding: 0.3em;
    }

    .c-actions.fullButtons button.primary,
    .c-actions.fullButtons button.secondary {
        padding: 0.3em 0.9em;
    }
</style>