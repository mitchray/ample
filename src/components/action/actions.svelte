<script>
    import { _ } from 'svelte-i18n';
    import { setContext } from 'svelte';
    import { v4 as uuidv4 } from 'uuid';
    import { API } from "../../stores/api";
    import { sampleSize } from "lodash";
    import { addAlert } from "../../logic/alert";
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
    let playLimit = 500;

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
                fetchURL = getSongsFromArtists(sampleSize(data.artists, 100));
                break;
            case 'artistAlpha':
                fetchURL = getSongsFromArtistsStartingWith(data.char);
                break;
            case 'artistGenre':
            case 'genre':
                if (data.name == null) {
                    let genre = await $API.genre({ filter: id });
                    data.name = genre.name;
                }
                fetchURL = getSomeSongsFromArtistsByGenre(data.name);
                break;
            case 'album':
                fetchURL = getSongsFromAlbum({id: id});
                break;
            case 'albums':
                fetchURL = getSongsFromAlbums(sampleSize(data.albums, 100));
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
            case 'smartlist':
                let playlistInfo = await $API.playlist({ filter: id });
                let playlistLimit = (playlistInfo?.items > playLimit) ? playLimit : 0;

                if (playlistLimit > 0) {
                    addAlert({ title: $_("text.limitedItems", { values: { n: playlistLimit } }), style: "info" });
                }

                fetchURL = $API.playlistSongs({ filter: id, limit: playlistLimit });
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
        let songSubset = data.songs;

        if (songSubset?.length > playLimit) {
            addAlert({ title: $_("text.limitedItems", { values: { n: playLimit } }), style: "info" });
            songSubset = sampleSize(data.songs, playLimit);
        }

        let result = data.songs ? songSubset : await determineFetchURL();

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
                <a href="#/artists/{data.artist.id}"><SVGArtist class="inline" />{data.artist.name}</a>
            {/if}

            <!-- add album artist if not already in artists -->
            {#if data.albumArtist?.id && (data.artists?.length > 0 && !data.artists.find(artist => artist.id === data.albumArtist.id))}
                <a href="#/artists/{data.albumArtist.id}"><SVGArtist class="inline" />{data.albumArtist.name}</a>
            {/if}

            {#if data.artists?.length > 0}
                {#each data.artists as artist}
                    <a href="#/artists/{artist.id}"><SVGArtist class="inline" />{artist.name}</a>
                {/each}
            {/if}

            {#if data.album?.id}
                <a href="#/albums/{data.album.id}"><SVGAlbum class="inline" />{data.album.name}</a>
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
                <button id="js-action-menu_{type}{mode}{id}" type="button" class="icon-button" on:click={handleMore} title="{$_('text.more')}"><SVGMore /> </button>
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
        inset-block-start: -2px;
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
        margin-inline-end: var(--spacing-sm);
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
        padding-inline-start: 1em;
        padding-inline-end: 1em;
    }

    .group {
        display: inline-flex;
        flex-wrap: nowrap;
    }
</style>
