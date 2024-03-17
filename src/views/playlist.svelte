<script>
    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { replace } from "svelte-spa-router";
    import { API, PageTitle } from "~/stores/state";
    import { getSongsFromPlaylist } from "~/logic/song";
    import { songsPreset } from "~/components/lister/columns.js";
    import Rating from "~/components/rating/rating.svelte";
    import Lister from "~/components/lister/lister.svelte";
    import Art from "~/components/art.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import Badge from "~/components/badge.svelte";

    export let params = {};

    let playlist;
    let songs = [];
    let loading = true;
    let playlistType = "playlist";
    let drawerEdit, drawerDelete;

    $: songs = songs;
    $: playlist = playlist;
    $: $PageTitle = playlist?.name || $_("text.playlist");

    function handleDelete(e) {
        if (playlist?.id === e.detail.id) {
            replace("#/playlists");
        }
    }

    onMount(async () => {
        playlist = await $API.playlist({ filter: params.id });

        if (playlist?.id) {
            songs = await getSongsFromPlaylist({
                id: params.id,
                type: "playlist",
            });

            if (playlist.id.match(/^smart_/)) {
                playlistType = "smartlist";
            }
        } else {
            // artist mix
            playlistType = "mix";
            playlist = await $API.artist({ filter: params.id });

            if (playlist.error) {
                console.error(
                    "Ample error getting artist for playlist mix:",
                    playlist.error,
                );
                loading = false;
                return;
            }

            songs = await getSongsFromPlaylist({
                id: params.id,
                type: "artist_mix",
            });

            if (songs.error) {
                console.error(
                    "Ample error getting songs from playlist:",
                    songs.error,
                );
                loading = false;
                return;
            }
        }

        loading = false;
    });
</script>

{#if playlist?.id && !loading}
    <div class="page-wrapper">
        <div class="details-container">
            <div class="details">
                <div class="cover-rating">
                    <div class="art-container">
                        <Art
                            size="large"
                            data={playlist}
                            type={playlistType}
                            radius="6px"
                        />
                    </div>

                    {#if playlistType === "playlist"}
                        <div class="rating">
                            <Rating type="playlist" data={playlist} />
                        </div>
                    {/if}
                </div>

                <div class="info">
                    <div class="type">
                        {#if playlistType === "smartlist"}
                            <Badge text={$_("text.smartlist")} />
                        {:else if playlistType === "mix"}
                            <Badge text={$_("text.mix")} />
                        {:else}
                            <Badge text={$_("text.playlist")} />
                        {/if}
                    </div>

                    <h1 class="title">
                        {playlist.name}
                    </h1>

                    {#if playlistType === "playlist"}
                        <div class="playlist-actions">
                            <sl-button
                                variant="primary"
                                on:click={() => drawerEdit.show()}
                                title={$_("text.edit")}
                            >
                                {$_("text.edit")}
                            </sl-button>

                            <sl-button
                                variant="danger"
                                on:click={() => drawerDelete.show()}
                                title={$_("text.delete")}
                            >
                                {$_("text.delete")}
                            </sl-button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="songs-container">
            <div class="songs">
                <Lister
                    id="Playlist"
                    bind:data={songs}
                    columns={songsPreset}
                    type="playlist_songs"
                    virtualList={true}
                    actionData={{
                        type: "songs",
                        displayMode: "fullButtons",
                        showShuffle: songs.length > 1,
                        data: Object.create({ songs: songs }),
                    }}
                />
            </div>
        </div>
    </div>

    <Portal>
        <DrawerEdit bind:this={drawerEdit} bind:playlist />
    </Portal>

    <Portal>
        <DrawerDelete
            bind:this={drawerDelete}
            bind:playlist
            on:playlistDeleted={handleDelete}
        />
    </Portal>
{:else}
    <p>{$_("text.loading")}</p>
{/if}

<style>
    .page-wrapper {
        display: grid;
        gap: var(--spacing-xxl);
    }

    .details-container {
        container-name: playlist-details-wrapper;
        container-type: inline-size;
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        font-size: 0;
        margin-block-end: var(--spacing-lg);
    }

    .info {
        display: flex;
        gap: var(--spacing-sm);
        flex-direction: column;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        font-weight: 300;
        display: flex;
        margin-block-end: var(--spacing-lg);
    }

    .playlist-actions {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-sm);
    }

    .type {
        --roboto-opsz: 32;
        display: flex;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        align-items: center;
    }

    @container playlist-details-wrapper (min-width: 500px) {
        .details {
            display: flex;
            gap: var(--spacing-xl);
            margin-block-end: 0;
            padding: unset;
        }

        .details {
            background-color: unset;
            box-shadow: unset;
        }

        .title {
            justify-content: left;
        }

        .art-container {
            max-width: 180px;
        }

        .type {
            justify-content: start;
        }
    }

    @container playlist-details-wrapper (min-width: 800px) {
        .title {
            font-size: 40px;
        }

        .art-container {
            max-width: 240px;
        }
    }
</style>
