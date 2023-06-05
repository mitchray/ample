<script>
    import { setContext } from 'svelte';
    import { Link } from 'svelte-routing';
    import { v4 as uuidv4 } from 'uuid';
    import { API } from "../../stores/api";
    import {
        getSomeSongsByGenre,
        getSomeSongsFromAlbumsByGenre,
        getSomeSongsFromArtistsByGenre,
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
    import ActionDownload       from './action_download.svelte';

    import SVGMore from "/src/images/more-hori.svg";
    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";

    export let type;               // artist, album, playlist, song etc
    export let mode;               // menu, miniButtons or fullButtons
    export let id          = null; // id of the item passed specified by type
    export let showShuffle = false;
    export let data        = {};   // any extra data needed, passed as an object key e.g. data.playlist

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
                    let genre = await $API.genre({ filter: id });
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
                fetchURL = $API.song({ filter: id });
                break;
            case 'songGenre':
                fetchURL = getSomeSongsByGenre(data.name);
                break;
            case 'playlist':
                fetchURL = $API.playlistSongs({ filter: id });
                break;
            case 'playlists':
                fetchURL = getSongsFromPlaylists(data.playlists);
                break;
            case 'year':
                fetchURL = getSongsByYear(data.from, data.to);
                break;
            case 'artistMix':
                fetchURL = getSongsFromPlaylist({ id: id, type: "artist_mix" });
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
        <div class="overflow-container">
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

            {#if data.artist?.id}
                <Link to="artists/{data.artist.id}"><SVGArtist class="inline" />{data.artist.name}</Link>
            {/if}

            <!-- add album artist if not already in artists -->
            {#if data.albumArtist?.id && (data.artists?.length > 0 && !data.artists.find(artist => artist.id === data.albumArtist.id))}
                <Link to="artists/{data.albumArtist.id}"><SVGArtist class="inline" />{data.albumArtist.name}</Link>
            {/if}

            {#if data.artists?.length > 0}
                {#each data.artists as artist}
                    <Link to="artists/{artist.id}"><SVGArtist class="inline" />{artist.name}</Link>
                {/each}
            {/if}

            {#if data.album?.id}
                <Link to="albums/{data.album.id}"><SVGAlbum class="inline" />{data.album.name}</Link>
            {/if}

            {#if (type === "artist" || type === "album" || type === "song")}
                <ActionUpdateFromTags contextKey={contextKey} />
            {/if}

            {#if (type === "artist" || type === "album")}
                <ActionUpdateArt contextKey={contextKey} />
            {/if}

            {#if (type === "song")}
                <ActionDownload contextKey={contextKey} />
            {/if}
        </div>
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
    <Menu anchor="bottom" toggleSelector={"#js-action-menu_" + type + mode + id} bind:isVisible={moreMenuVisible} >
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
        display: block;
        overflow: hidden;
        max-width: 180px;
        width: 100%;
    }

    .c-actions.menu :global(svg) {
        height: 0.5em; /* half the height so it doesn't affect line height */
        transform: scale(200%); /* double it again to restore original size */
        width: 1em;
        color: var(--color-highlight);
        display: inline-block;
        vertical-align: middle;
        position: relative;
        top: -2px;
    }

    /* resets so buttons and links appear identical */
    .c-actions.menu :global(button),
    .c-actions.menu :global(a) {
        display: inline-block;
        vertical-align: middle;
        line-height: 0;
        border: 0;
        padding: 0.7em 0;
        width: 100%;
        color: var(--color-text-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
