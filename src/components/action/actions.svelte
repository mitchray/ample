<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
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
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import ActionPlay from "./items/actionPlay.svelte";
    import ActionPlayNext from "./items/actionPlayNext.svelte";
    import ActionPlayLast from "./items/actionPlayLast.svelte";
    import ActionPlayFromHere from "./items/actionPlayFromHere.svelte";
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
    import { Settings } from "~/stores/settings.js";

    let {
        items: itemsProp = null,
        type,
        displayMode,
        showShuffle = false,
        showLinks = false,
        hideDefaultActions = false,
        showPlayFromHere = true,
        hoist = false,
        data = {},
    } = $props();

    let items = $derived(Array.isArray(itemsProp) ? itemsProp : []);

    let firstItem = $derived(items[0] ?? null);

    /** Map fetch type to Ampache API type (singular) */
    function toApiType(t) {
        if (!t) return null;
        const map = {
            artistGenre: "artist",
            albumGenre: "album",
            songGenre: "song",
            artistAlpha: "artist",
            albumAlpha: "album",
        };
        return map[t] ?? (t.replace(/s$/, "") || t);
    }

    let apiType = $derived(toApiType(type));

    let playLimit = 5000;
    let actionsBind = $state();
    let moreButtonActivated = $state(false);

    // Merge playlist into data when type is playlist (for edit/delete)
    let resolvedData = $derived(
        type === "playlist" && firstItem
            ? { ...data, playlist: firstItem }
            : data,
    );

    const actionContext = $derived({
        items,
        apiType,
        type,
        data: resolvedData,
        displayMode,
        showShuffle,
        getSongs: () => doFetch(),
    });

    let filterToArtistID = getContext("filterToArtistID");

    /**
     * Determine which method should be used to get songs
     * @returns Promise<array>
     */
    async function determineFetchURL() {
        let response = null;
        let final = [];

        switch (type) {
            case "artist":
                final = await getSongsFromArtist(firstItem?.id);
                break;
            case "artists":
                response = await getSongsFromArtists(data.getArtists());
                final = response?.song ?? [];
                break;
            case "artistAlpha":
                response = await getSongsFromArtistsStartingWith(data.char);
                final = response?.song ?? [];
                break;
            case "artistGenre":
            case "genre":
                response = await getSomeSongsFromArtistsByGenre(data.id);
                final = response?.song ?? [];
                break;
            case "album":
                response = await $API.albumSongs({ filter: firstItem?.id });
                final = response?.song ?? [];
                break;
            case "albums":
                response = await getSongsFromAlbums(data.getAlbums());
                final = Array.isArray(response)
                    ? response
                    : (response?.song ?? []);
                break;
            case "albumGenre":
                response = await getSomeSongsFromAlbumsByGenre(data.id);
                final = response?.song ?? [];
                break;
            case "albumAlpha":
                response = await getSongsFromAlbumsStartingWith(data.char);
                final = response?.song ?? [];
                break;
            case "song":
                final = await $API.song({ filter: firstItem?.id });
                final = final ? [final] : [];
                break;
            case "songGenre":
                response = await getSomeSongsByGenre(data.id);
                final = response?.song ?? [];
                break;
            case "songs":
            case "playlist_songs":
                final = data.getSongs?.() ?? data.songs ?? [];
                final = Array.isArray(final) ? final : [];
                break;
            case "playlist":
            case "smartlist":
                let playlistInfo = await $API.playlist({
                    filter: firstItem?.id,
                });
                let playlistLimit =
                    playlistInfo?.items > playLimit ? playLimit : 0;

                if (playlistLimit > 0) {
                    addAlert({
                        title: $_("text.limitedItems", {
                            values: { n: playLimit },
                        }),
                        style: "info",
                    });
                }

                response = await $API.playlistSongs({
                    filter: firstItem?.id,
                    limit: playlistLimit,
                });
                final = response?.song ?? [];
                break;
            case "playlists":
                response = await getSongsFromPlaylists(data.getPlaylists());
                final = Array.isArray(response)
                    ? response
                    : (response?.song ?? []);
                break;
            case "year":
                response = await getSongsByYear(data.from, data.to);
                final = response?.song ?? [];
                break;
            case "artistMix":
                response = await getSongsFromPlaylist({
                    id: firstItem?.id,
                    type: "artist_mix",
                });
                final = response?.song ?? [];
                break;
            case "live_stream":
                response = await $API.liveStream({ filter: firstItem?.id });
                final = response?.live_stream ? [response.live_stream] : [];
                break;
            case "podcast":
                response = await $API.podcastEpisodes({
                    filter: firstItem?.id,
                });
                final = response?.podcast_episode ?? [];
                break;
            case "podcast_episode":
                response = await $API.podcastEpisode({ filter: firstItem?.id });
                final = response?.podcast_episode
                    ? [response.podcast_episode]
                    : [];
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
        let result = await determineFetchURL();

        if (result?.error) {
            errorHandler("determining fetch URL", result.error);
            return [];
        }

        result = Array.isArray(result) ? result : [result];

        result = result.filter((it) => !it.state || it.state === "completed");

        if (
            result.length > 1 &&
            $Settings.PlaySongsByOtherArtists === "exclude" &&
            filterToArtistID
        ) {
            result = result.filter((it) =>
                it.artists?.find((artist) => artist.id === filterToArtistID),
            );
        }

        return result;
    }
</script>

<!-- Dynamic context menu -->
{#if displayMode === "menu"}
    <sl-menu>
        {#if showLinks && firstItem}
            {#if type === "live_stream"}
                <a href="#/radio-station/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="radio" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {:else if type === "podcast_episode"}
                <a href="#/podcast-episode/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="podcast" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {:else if type === "song"}
                <a href="#/song/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="music_note" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {:else if type === "album"}
                <a href="#/album/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="album" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {:else if type === "playlist"}
                <a href="#/playlist/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="queue_music" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {:else if type === "artistMix"}
                <a href="#/mix/artist/{firstItem.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="queue_music" slot="prefix" />
                        {firstItem.name}
                    </sl-menu-item>
                </a>
            {/if}

            <!-- PARENT ITEMS -->

            {#if firstItem.album?.id}
                <a href="#/album/{firstItem.album.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="album" slot="prefix" />
                        {firstItem.album.name}
                    </sl-menu-item>
                </a>
            {/if}

            {#if firstItem.podcast?.id}
                <a href="#/podcast/{firstItem.podcast.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="swap_calls" slot="prefix" />
                        {firstItem.podcast.name}
                    </sl-menu-item>
                </a>
            {/if}

            {#if firstItem.artists?.length > 0}
                {#each firstItem.artists as artist}
                    <a href="#/artist/{artist.id}">
                        <sl-menu-item>
                            <MaterialSymbol name="person" slot="prefix" />
                            {artist.name}
                        </sl-menu-item>
                    </a>
                {/each}
            {/if}

            <!-- add album artist if not already in artists -->
            {#if firstItem.albumArtist?.id && firstItem.artists?.length > 0 && !firstItem.artists.find((artist) => artist.id === firstItem.albumArtist.id)}
                <a href="#/artist/{firstItem.albumArtist.id}">
                    <sl-menu-item>
                        <MaterialSymbol name="person" slot="prefix" />
                        {firstItem.albumArtist.name}
                    </sl-menu-item>
                </a>
            {/if}

            <sl-divider></sl-divider>
        {/if}

        {#if apiType === "playlist" && items.length > 0}
            <ActionEditPlaylist {actionContext} />
            <ActionDeletePlaylist {actionContext} />
        {/if}

        {#if showPlayFromHere && apiType === "song" && items.length === 1}
            <ActionPlayFromHere {actionContext} />
        {/if}

        {#if items.length === 1 && (apiType === "song" || apiType === "artist" || apiType === "album" || type === "playlist_songs")}
            <ActionArtistMix {actionContext} />
        {/if}

        {#if items.length === 1 && ["song", "album", "artist", "playlist", "podcast", "podcast_episode", "video"].includes(apiType)}
            <ActionShareCreate {actionContext} />
        {/if}

        {#if type !== "share"}
            <ActionAddToPlaylist {actionContext} />
            <ActionShuffleNext {actionContext} />
            <ActionShuffleLast {actionContext} />
        {/if}

        {#if items.length > 0 && ["artist", "album", "song"].includes(apiType)}
            <ActionUpdateFromTags {actionContext} />
        {/if}

        {#if items.length > 0 && ["artist", "album"].includes(apiType)}
            <ActionUpdateArt {actionContext} />
        {/if}

        {#if items.length > 0 && apiType === "song"}
            <ActionDownload {actionContext} />
        {/if}

        {#if apiType === "song" && firstItem && items.length === 1}
            <ActionFindDuplicates item={firstItem} />
        {/if}
    </sl-menu>
{/if}

<!-- Card/lister actions which are always the same -->
{#if displayMode === "miniButtons" || displayMode === "fullButtons"}
    <div class="c-actions {displayMode}" bind:this={actionsBind}>
        <sl-button-group>
            {#if !hideDefaultActions}<ActionPlay {actionContext} />{/if}
            {#if !hideDefaultActions}<ActionShuffle {actionContext} />{/if}
            {#if !hideDefaultActions}<ActionPlayNext {actionContext} />{/if}
            {#if !hideDefaultActions}<ActionPlayLast {actionContext} />{/if}

            <!-- special actions for Shares -->
            {#if type === "share"}
                <ActionShareEdit {actionContext} />
                <ActionShareDelete {actionContext} />
            {/if}

            {#if type !== "share"}
                {#if !moreButtonActivated}
                    <sl-button
                        size={displayMode === "miniButtons"
                            ? "small"
                            : "medium"}
                        onclick={(e) => {
                            moreButtonActivated = true;
                        }}
                    >
                        <MaterialSymbol name="more_horiz" />
                    </sl-button>
                {/if}

                {#if moreButtonActivated}
                    {@render createDropdown()}
                {/if}
            {/if}
        </sl-button-group>
    </div>
{/if}

{#snippet createDropdown()}
    <sl-dropdown open {hoist}>
        <sl-button
            slot="trigger"
            size={displayMode === "miniButtons" ? "small" : "medium"}
        >
            <MaterialSymbol name="more_horiz" />
        </sl-button>
        <Actions
            displayMode="menu"
            {items}
            {type}
            {showShuffle}
            {showLinks}
            {hideDefaultActions}
            {showPlayFromHere}
            {data}
        />
    </sl-dropdown>
{/snippet}

<style>
    /* Hide the label when miniButtons */
    .c-actions.miniButtons :global(.label) {
        display: none;
    }

    sl-button-group::part(base) {
        flex-wrap: wrap;
    }

    sl-menu-item {
        max-width: 250px;
    }
</style>
