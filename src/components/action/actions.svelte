<script>
    import { setContext } from 'svelte';
    import { Link } from 'svelte-routing';
    import { v4 as uuidv4 } from 'uuid';
    import { getGenre } from "../../logic/genre";
    import {
        getSomeSongsByGenre,
        getSomeSongsFromAlbumsByGenre,
        getSomeSongsFromArtistsByGenre,
        getSong,
        getSongsByYear,
        getSongsFromAlbum,
        getSongsFromAlbums,
        getSongsFromAlbumsStartingWith,
        getSongsFromArtist,
        getSongsFromArtists,
        getSongsFromArtistsStartingWith,
        getSongsFromPlaylist,
        getSongsFromPlaylists
    } from "../../logic/song";
    import { filterBelow } from "../../logic/helper";

    import Menu                 from '../../components/menu.svelte';
    import ActionPlay           from './action_play.svelte';
    import ActionPlayNext       from './action_playNext.svelte';
    import ActionPlayLast       from './action_playLast.svelte';
    import ActionShuffle        from './action_shuffle.svelte';
    import ActionShuffleNext    from './action_shuffleNext.svelte';
    import ActionShuffleLast    from './action_shuffleLast.svelte';
    import ActionArtistMix      from './action_artistMix.svelte';
    import ActionAddToPlaylist  from './action_playlistAddTo.svelte';
    import ActionEditPlaylist   from './action_playlistEdit.svelte';
    import ActionDeletePlaylist from './action_playlistDelete.svelte';
    import ActionUpdateFromTags from './action_updateFromTags.svelte';
    import ActionUpdateArt      from './action_updateArt.svelte';

    import SVGMore from "../../../public/images/more-hori.svg";
    import SVGArtist from "../../../public/images/artist.svg";
    import SVGAlbum from "../../../public/images/album.svg";

    export let type;               // artist, album, playlist, song etc
    export let mode;               // menu, miniButtons or fullButtons
    export let id          = null; // id of the item passed specified by type
    export let showShuffle = false;
    export let data        = {};   // any extra data needed, passed as an object key e.g data.playlist

    const contextKey = uuidv4(); // unique key for each instance of lister

    let moreMenuVisible    = false;

    setContext(contextKey, {
        getType:        () => type,
        getMode:        () => mode,
        getID:          () => id,
        getData:        () => data,
        getShowShuffle: () => showShuffle,
        getSongs:       () => doFetch(),
    });

    /**
     * Determine which method should be used to get songs
     * @returns function
     */
    async function determineFetchURL() {
        let fetchURL = null;

        switch (type) {
            case 'artist':
                fetchURL = getSongsFromArtist(id);
                break;
            case 'artists':
                fetchURL = getSongsFromArtists(data.artists);
                break;
            case 'artistAlpha':
                fetchURL = getSongsFromArtistsStartingWith(data.char);
                break;
            case 'artistGenre':
            case 'genre':
                if (data.name === null) {
                    let genre = await getGenre(id);
                    data.name = genre.name;
                }
                fetchURL = getSomeSongsFromArtistsByGenre(data.name);
                break;
            case 'album':
                fetchURL = getSongsFromAlbum({id: id});
                break;
            case 'albums':
                fetchURL = getSongsFromAlbums(data.albums);
                break;
            case 'albumGenre':
                fetchURL = getSomeSongsFromAlbumsByGenre(data.name);
                break;
            case 'albumAlpha':
                fetchURL = getSongsFromAlbumsStartingWith(data.char);
                break;
            case 'song':
            case 'playlist_songs':
                fetchURL = getSong(id);
                break;
            case 'songGenre':
                fetchURL = getSomeSongsByGenre(data.name);
                break;
            case 'playlist':
                fetchURL = getSongsFromPlaylist({id: id});
                break;
            case 'playlists':
                fetchURL = getSongsFromPlaylists(data.playlists);
                break;
            case 'year':
                fetchURL = getSongsByYear(data.from, data.to);
                break;
            default:
                break;
        }

        return fetchURL;
    }

    /**
     * Gets the songs based on action type
     * @returns array
     */
    async function doFetch() {
        let result = data.songs ? data.songs : await determineFetchURL();

        // make sure results are an array
        result = (Array.isArray(result)) ? result : [result];

        // filter out songs below desired rating
        return filterBelow(result);
    }

    function handleMore() {
        moreMenuVisible = !moreMenuVisible;
    }
</script>

<!-- Dynamic context menu -->
{#if mode === 'menu' || mode === 'subMenu'}
    <div class="c-actions menu">
        {#if mode !== 'subMenu'}
            <ActionPlay contextKey={contextKey} />
            <ActionShuffle contextKey={contextKey} />
            <ActionPlayNext contextKey={contextKey} />
            <ActionPlayLast contextKey={contextKey} />
        {/if}

        {#if type === 'playlist'}
            <ActionEditPlaylist contextKey={contextKey} />
            <ActionDeletePlaylist contextKey={contextKey} />
            <div class="menu-separator"></div>
        {/if}

        <ActionAddToPlaylist contextKey={contextKey} />
        <ActionArtistMix contextKey={contextKey} />
        <ActionShuffleNext contextKey={contextKey} />
        <ActionShuffleLast contextKey={contextKey} />

        {#if data.artistID}
            <Link to="artists/{data.artistID}"><SVGArtist class="inline" /> Go to artist</Link>
        {/if}

        {#if data.albumID}
            <Link to="albums/{data.albumID}"><SVGAlbum class="inline" /> Go to album</Link>
        {/if}

        {#if (type === "artist" || type === "album" || type === "song")}
            <ActionUpdateFromTags contextKey={contextKey} />
        {/if}

        {#if (type === "artist" || type === "album")}
            <ActionUpdateArt contextKey={contextKey} />
        {/if}
    </div>
{/if}

<!-- Card/lister actions which are always the same -->
{#if mode === 'miniButtons' || mode === 'fullButtons'}
    <div class="c-actions {mode}">
        <ActionPlay contextKey={contextKey} />
        <ActionShuffle contextKey={contextKey} />

        <span class="group">
            <ActionPlayNext contextKey={contextKey} />
            <ActionPlayLast contextKey={contextKey} />

            <div class="action">
                <button id="js-action-menu_{type}{mode}{id}" type="button" class="icon-button" on:click={handleMore} title="More"><SVGMore /> </button>
            </div>
        </span>
    </div>
{/if}

{#if moreMenuVisible}
    <Menu anchor="bottom-center" toggleSelector={"#js-action-menu_" + type + mode + id} bind:isVisible={moreMenuVisible} >
        <div class="panel-content">
            <svelte:self
                {...$$props}
                mode="subMenu"
            />
        </div>
    </Menu>
{/if}


<style>
    .c-actions,
    .c-actions > .group {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .c-actions {
        gap: var(--spacing-sm);
    }

    .c-actions :global(button),
    .c-actions :global(a) {
        display: inline-flex;
        align-items: center;
    }

    .c-actions :global(button) {
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
        color: var(--color-highlight);
    }

    /* resets so buttons and links appear identical */
    .c-actions.menu :global(button),
    .c-actions.menu :global(a) {
        line-height: 1;
        border: 0;
        padding: 0.3em 0;
        width: 100%;
        color: var(--color-text-primary);
    }

    .c-actions.menu :global(button) {
        background-color: unset;
        border-radius: 0;
        box-shadow: none;
    }

    .c-actions.menu :global(button):after,
    .c-actions.fullButtons :global(.button--primary):after,
    .c-actions.fullButtons :global(.button--secondary):after {
        content: attr(title);
    }

    .c-actions.menu :global(svg),
    .c-actions.fullButtons :global(.button--primary svg),
    .c-actions.fullButtons :global(.button--secondary svg) {
        margin-right: var(--spacing-sm);
    }

    /*
     * MINI BUTTONS SPECIFIC
     */
    .c-actions.miniButtons :global(button) {
        padding: 0;
    }

    /*
     * FULL BUTTONS SPECIFIC
     */
    .c-actions.fullButtons :global(.button--primary),
    .c-actions.fullButtons :global(.button--secondary) {
        padding-left: 1em;
        padding-right: 1em;
    }

    .group {
        display: inline-flex;
        flex-wrap: nowrap;
    }
</style>
