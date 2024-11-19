<script>
    import { _ } from "svelte-i18n";
    import { getContext, onMount, setContext } from "svelte";
    import { v4 as uuidv4 } from "uuid";
    import { API } from "~/stores/state.js";
    import { sampleSize } from "lodash-es";
    import { addAlert } from "~/logic/alert.js";
    import {
        getSomeSongsByGenre,
        getSomeSongsFromAlbumsByGenre,
        getSomeSongsFromArtistsByGenre,
        getSongsByYear,
        getSongsFromAlbums,
        getSongsFromAlbumsStartingWith,
        getSongsFromArtist,
        getSongsFromArtists,
        getSongsFromArtistsStartingWith,
        getSongsFromPlaylist,
        getSongsFromPlaylists,
    } from "~/logic/song.js";
    import { errorHandler, prepareForQueue } from "~/logic/helper.js";
    import { writable } from "svelte/store";
    import Actions from "~/components/action/actions.svelte";
    import ActionPlay from "./items/actionPlay.svelte";
    import ActionPlayNext from "./items/actionPlayNext.svelte";
    import ActionPlayLast from "./items/actionPlayLast.svelte";
    import ActionShuffle from "./items/actionShuffle.svelte";
    import ActionShuffleNext from "./items/actionShuffleNext.svelte";
    import ActionShuffleLast from "./items/actionShuffleLast.svelte";
    import ActionArtistMix from "./items/actionArtistMix.svelte";
    import ActionAddToPlaylist from "./items/actionPlaylistAddTo.svelte";
    import ActionEditPlaylist from "./items/actionPlaylistEdit.svelte";
    import ActionDeletePlaylist from "./items/actionPlaylistDelete.svelte";
    import ActionUpdateFromTags from "./items/actionUpdateFromTags.svelte";
    import ActionUpdateArt from "./items/actionUpdateArt.svelte";
    import ActionDownload from "./items/actionDownload.svelte";
    import ActionFindDuplicates from "./items/actionFindDuplicates.svelte";
    import ActionShareCreate from "./items/actionShareCreate.svelte";
    import ActionShareEdit from "./items/actionShareEdit.svelte";
    import ActionShareDelete from "./items/actionShareDelete.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import Portal from "~/components/portal.svelte";
    import { Settings } from "~/stores/settings.js";

    // interface Props {
    //     item?: any;
    //     type: any; // artist, album, playlist, song etc
    //     displayMode: any; // menu, miniButtons or fullButtons; the UI elements to be rendered
    //     showShuffle?: boolean;
    //     showLinks?: boolean;
    //     hideDefaultActions?: boolean;
    //     data?: any; // any extra data needed, passed as an object key e.g. data.playlists
    // }

    let {
        item = null,
        type,
        displayMode,
        showShuffle = false,
        showLinks = false,
        hideDefaultActions = false,
        data = {},
    } = $props();
    // TODO: need to pass the $props() (previously $$props) to Actions instances

    const contextKey = uuidv4(); // unique key for each instance of actions

    let playLimit = 5000;
    let actionsBind = $state();
    let dialogBind = $state();
    let dropdownBind = $state();

    // underscore prefixed items are accessor aliases of exported params
    let _item = writable(item);
    let _type = writable(type);
    let _displayMode = writable(displayMode);
    let _showShuffle = writable(showShuffle);
    let _data = writable(data);

    setContext(contextKey, {
        _item,
        _type,
        _displayMode,
        _data,
        _showShuffle,
        getSongs: () => doFetch(),
    });

    let filterToArtistID = getContext("filterToArtistID");

    /**
     * Determine which method should be used to get songs
     * @returns function
     */
    async function determineFetchURL() {
        let response = null;
        let final = [];

        switch (type) {
            case "artist":
                final = await getSongsFromArtist(item?.id);
                break;
            case "artists":
                response = await getSongsFromArtists(
                    sampleSize(data.artists, 100),
                );
                final = response.song;
                break;
            case "artistAlpha":
                response = await getSongsFromArtistsStartingWith(data.char);
                final = response.song;
                break;
            case "artistGenre":
            case "genre":
                response = await getSomeSongsFromArtistsByGenre(data.id);
                final = response.song;
                break;
            case "album":
                response = await $API.albumSongs({ filter: item?.id });
                final = response.song;
                break;
            case "albums":
                response = await getSongsFromAlbums(
                    sampleSize(data.albums, 100),
                );
                final = response.song;
                break;
            case "albumGenre":
                response = await getSomeSongsFromAlbumsByGenre(data.id);
                final = response.song;
                break;
            case "albumAlpha":
                response = await getSongsFromAlbumsStartingWith(data.char);
                final = response.song;
                break;
            case "song":
            case "playlist_songs":
                final = await $API.song({ filter: item?.id });
                break;
            case "songGenre":
                response = await getSomeSongsByGenre(data.id);
                final = response.song;
                break;
            case "playlist":
            case "smartlist":
                let playlistInfo = await $API.playlist({ filter: item?.id });
                let playlistLimit =
                    playlistInfo?.items > playLimit ? playLimit : 0;

                if (playlistLimit > 0) {
                    addAlert({
                        title: $_("text.limitedItems", {
                            values: { n: playlistLimit },
                        }),
                        style: "info",
                    });
                }

                response = await $API.playlistSongs({
                    filter: item?.id,
                    limit: playlistLimit,
                });
                final = response.song;
                break;
            case "playlists":
                response = await getSongsFromPlaylists(data.playlists);
                final = response.song;
                break;
            case "year":
                response = await getSongsByYear(data.from, data.to);
                final = response.song;
                break;
            case "artistMix":
                response = await getSongsFromPlaylist({
                    id: item?.id,
                    type: "artist_mix",
                });
                final = response.song;
                break;
            case "live_stream":
                response = await $API.liveStream({ filter: item?.id });
                final = response.live_stream;
                break;
            case "podcast":
                response = await $API.podcastEpisodes({ filter: item?.id });
                final = response.podcast_episode;
                break;
            case "podcast_episode":
                response = await $API.podcastEpisode({ filter: item?.id });
                final = response.podcast_episode;
                break;
            default:
                break;
        }

        return final;
    }

    /**
     * Gets the songs based on action type
     * @returns Promise<array>
     */
    async function doFetch() {
        let songSubset = data.songs;

        if (songSubset?.length > playLimit) {
            addAlert({
                title: $_("text.limitedItems", { values: { n: playLimit } }),
                style: "info",
            });
            songSubset = sampleSize(data.songs, playLimit);
        }

        let result = data.songs ? songSubset : await determineFetchURL();

        if (result.error) {
            errorHandler("determining fetch URL", result.error);
            return [];
        }

        // make sure we are working with an array
        result = Array.isArray(result) ? result : [result];

        // filter out pending podcast episodes...
        result = result.filter(
            (item) => !item.state || item.state === "completed",
        );

        // filter out songs not by artist if that is set, but allow a single item through with the assumption its the only one we want to play
        if (
            result.length > 1 &&
            $Settings.PlaySongsByOtherArtists === "exclude" &&
            filterToArtistID
        ) {
            result = result.filter((item) =>
                item.artists.find((artist) => artist.id === filterToArtistID),
            );
        }

        return prepareForQueue(result);
    }
</script>

<!-- Dynamic context menu -->
{#if displayMode === "menu"}
    <sl-menu>
        {#if showLinks && item}
            <sl-menu-item>
                {$_("text.goTo")}
                <sl-menu slot="submenu">
                    {#if type === "live_stream"}
                        <a href="#/radio-station/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol name="radio" slot="prefix" />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {:else if type === "podcast_episode"}
                        <a href="#/podcast-episode/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol name="podcast" slot="prefix" />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {:else if type === "song"}
                        <a href="#/song/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol
                                    name="music_note"
                                    slot="prefix"
                                />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {:else if type === "album"}
                        <a href="#/album/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol name="album" slot="prefix" />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {:else if type === "playlist"}
                        <a href="#/playlist/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol
                                    name="queue_music"
                                    slot="prefix"
                                />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {:else if type === "artistMix"}
                        <a href="#/mix/artist/{item.id}">
                            <sl-menu-item>
                                <MaterialSymbol
                                    name="queue_music"
                                    slot="prefix"
                                />
                                {item.name}
                            </sl-menu-item>
                        </a>
                    {/if}

                    <!-- PARENT ITEMS -->

                    {#if item.album?.id}
                        <a href="#/album/{item.album.id}">
                            <sl-menu-item>
                                <MaterialSymbol name="album" slot="prefix" />
                                {item.album.name}
                            </sl-menu-item>
                        </a>
                    {/if}

                    {#if item.podcast?.id}
                        <a href="#/podcast/{item.podcast.id}">
                            <sl-menu-item>
                                <MaterialSymbol
                                    name="swap_calls"
                                    slot="prefix"
                                />
                                {item.podcast.name}
                            </sl-menu-item>
                        </a>
                    {/if}

                    {#if item.artists?.length > 0}
                        {#each item.artists as artist}
                            <a href="#/artist/{artist.id}">
                                <sl-menu-item>
                                    <MaterialSymbol
                                        name="person"
                                        slot="prefix"
                                    />
                                    {artist.name}
                                </sl-menu-item>
                            </a>
                        {/each}
                    {/if}

                    <!-- add album artist if not already in artists -->
                    {#if item.albumArtist?.id && item.artists?.length > 0 && !item.artists.find((artist) => artist.id === item.albumArtist.id)}
                        <a href="#/artist/{item.albumArtist.id}">
                            <sl-menu-item>
                                <MaterialSymbol name="person" slot="prefix" />
                                {item.albumArtist.name}
                            </sl-menu-item>
                        </a>
                    {/if}
                </sl-menu>
            </sl-menu-item>
        {/if}

        {#if type === "playlist"}
            <ActionEditPlaylist {contextKey} />
            <ActionDeletePlaylist {contextKey} />
        {/if}

        {#if type === "song"}
            <ActionArtistMix {contextKey} />
        {/if}

        {#if type === "song" || type === "album" || type === "artist" || type === "playlist" || type === "podcast" || type === "podcast_episode" || type === "video"}
            <ActionShareCreate {contextKey} />
        {/if}

        {#if type !== "share"}
            <ActionAddToPlaylist {contextKey} />
            <ActionShuffleNext {contextKey} />
            <ActionShuffleLast {contextKey} />
        {/if}

        {#if type === "artist" || type === "album" || type === "song"}
            <ActionUpdateFromTags {contextKey} />
        {/if}

        {#if type === "artist" || type === "album"}
            <ActionUpdateArt {contextKey} />
        {/if}

        {#if type === "song"}
            <ActionDownload {contextKey} />
        {/if}

        {#if type === "song"}
            <ActionFindDuplicates {item} />
        {/if}
    </sl-menu>
{/if}

<!-- Card/lister actions which are always the same -->
{#if displayMode === "miniButtons" || displayMode === "fullButtons"}
    <div class="c-actions {displayMode}" bind:this={actionsBind}>
        <sl-button-group>
            {#if !hideDefaultActions}<ActionPlay {contextKey} />{/if}
            {#if !hideDefaultActions}<ActionShuffle {contextKey} />{/if}
            {#if !hideDefaultActions}<ActionPlayNext {contextKey} />{/if}
            {#if !hideDefaultActions}<ActionPlayLast {contextKey} />{/if}

            <!-- special actions for Shares -->
            {#if type === "share"}
                <ActionShareEdit {contextKey} />
                <ActionShareDelete {contextKey} />
            {/if}

            {#if type !== "share"}
                <sl-dropdown hoist bind:this={dropdownBind}>
                    <!-- button not shown, only used for positioning the dropdown -->
                    <sl-button
                        slot="trigger"
                        size={displayMode === "miniButtons"
                            ? "small"
                            : "medium"}
                        style="visibility: hidden; pointer-events: none; width: 0;"
                    >
                        &nbsp;
                    </sl-button>
                    <Actions displayMode="menu" />
                </sl-dropdown>

                <sl-button
                    size={displayMode === "miniButtons" ? "small" : "medium"}
                    onclick={(e) => {
                        let tabulator = actionsBind?.closest(".tabulator");
                        if (tabulator?.offsetHeight < 250) {
                            dialogBind?.show();
                        } else {
                            dropdownBind?.show();
                        }
                    }}
                >
                    <MaterialSymbol name="more_horiz" />
                </sl-button>
            {/if}
        </sl-button-group>
    </div>

    <!-- used when Tabulator is too short to show dropdown -->
    <Portal>
        <sl-dialog
            bind:this={dialogBind}
            onclick={() => {
                dialogBind?.hide();
            }}
        >
            <Actions displayMode="menu" />

            <sl-divider></sl-divider>

            <sl-alert open>
                <MaterialSymbol name="help" slot="icon" />
                <strong>Why was this not a dropdown menu?</strong>
                <p>
                    There was not enough room to display the dropdown, due to
                    technical reasons (CSS containing block) nothing can appear
                    outside of the table area.
                </p>

                <p>
                    This is a temporary workaround until the UI library can
                    implement the new Popover API.
                </p>
            </sl-alert>

            <sl-button
                slot="footer"
                variant="primary"
                onclick={() => {
                    dialogBind?.hide();
                }}
            >
                Close
            </sl-button>
        </sl-dialog>
    </Portal>
{/if}

<style>
    /* Hide the label when miniButtons */
    .c-actions.miniButtons :global(.label) {
        display: none;
    }

    sl-button-group::part(base) {
        flex-wrap: wrap;
    }
</style>
