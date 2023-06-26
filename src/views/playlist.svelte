<script>
    import { _ } from 'svelte-i18n';
    import { onMount, tick } from "svelte";
    import { API } from "../stores/api";
    import { getSongsFromPlaylist } from "../logic/song";
    import { PageTitle } from "../stores/status";
    import { cleanArtURL } from "../logic/helper";
    import Rating from '../components/rating.svelte';
    import Lister from '../components/lister/lister.svelte';
    import PlaylistArt from '../components/playlist/playlist_art.svelte';
    import PlaylistEdit from '../components/playlist/playlist_edit.svelte';
    import PlaylistDelete from '../components/playlist/playlist_delete.svelte';
    import Menu from '../components/menu.svelte';
    import SVGPlaylist from "/src/images/queue_music.svg";
    import SVGSmartlist from "/src/images/smartlist.svg";
    import SVGRadio from "/src/images/radio.svg";

    export let params = {}

    let playlist;
    let songs = [];
    let loading = true;
    let playlistType = "playlist";
    let playlistEditIsVisible = false;
    let playlistDeleteIsVisible = false;

    $: songs = songs;
    $: playlist = playlist;

    let title = $_('text.playlist');
    $PageTitle = title;

    async function handleEditPlaylist() {
        playlistEditIsVisible = !playlistEditIsVisible;

        await tick();
    }

    async function handleDeletePlaylist() {
        playlistDeleteIsVisible = !playlistDeleteIsVisible;

        await tick();
    }

    onMount(async () => {
        playlist = await $API.playlist({ filter: params.id });

        if (playlist?.id) {
            songs = await getSongsFromPlaylist({ id: params.id, type: "playlist" });

            if (playlist.id.match(/^smart_/)) {
                playlistType = "smartlist";
            }
        } else {
            // artist mix
            playlistType = "mix";
            playlist = await $API.artist({filter: params.id});
            songs = await getSongsFromPlaylist({ id: params.id, type: "artist_mix" });
        }

        loading = false;
    });
</script>

<svelte:head>
    <title>{(loading) ? $_('text.loading') : `${playlist?.name} (${playlistType})`}</title>
</svelte:head>

{#if playlist?.id && !loading}
    <div class="page-wrapper">
        <div class="details-container">
            <div class="details">
                <div class="cover-rating">
                    <div class="art-container">
                        <PlaylistArt bind:songs fallback="{cleanArtURL(playlist.art)}" />
                    </div>

                    {#if playlistType === "playlist"}
                        <div class="rating">
                            <Rating type="playlist" id="{playlist.id}" rating="{playlist.rating}" flag="{playlist.flag}" averageRating="{playlist.averagerating}" />
                        </div>
                    {/if}
                </div>

                <div class="info">
                    <div class="type">
                        {#if playlistType === "smartlist"}
                            <SVGSmartlist class="inline" />&nbsp;{$_('text.smartlist')}
                        {:else if playlistType === "mix"}
                            <SVGRadio class="inline" />&nbsp;{$_('text.mix')}
                        {:else}
                            <SVGPlaylist class="inline" />&nbsp;{$_('text.playlist')}
                        {/if}
                    </div>

                    <h1 class="title">
                        {playlist.name}
                    </h1>

                    {#if playlistType === "playlist"}
                        <div class="playlist-actions">
                            <button class="button button--regular" type="button" id="js-action-playlist_edit_{params.id}" on:click={handleEditPlaylist} title="{$_('text.edit')}">{$_('text.edit')}</button>
                            <button class="button button--danger" type="button" id="js-action-playlist_delete_{params.id}" on:click={handleDeletePlaylist} title="{$_('text.delete')}">{$_('text.delete')}</button>
                        </div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="songs-container">
            <div class="songs page-main">
                <Lister
                    bind:data={songs}
                    type="playlist_songs"
                    showCheckboxes={playlistType === "playlist"}
                    tableOnly={true}
                    showIndex={true}
                    virtualList={true}
                    actionData={{
                        type: "",
                        mode: "fullButtons",
                        showShuffle: songs.length > 1,
                        data: Object.create({songs: songs})
                    }}
                />
            </div>
        </div>
    </div>

    {#if playlistEditIsVisible}
        <Menu anchor="left" toggleSelector={"#js-action-playlist_edit_" + params.id} bind:isVisible={playlistEditIsVisible}>
            <PlaylistEdit bind:playlist={playlist} bind:isVisible={playlistEditIsVisible} />
        </Menu>
    {/if}

    {#if playlistDeleteIsVisible}
        <Menu anchor="left" toggleSelector={"#js-action-playlist_delete_" + params.id} bind:isVisible={playlistDeleteIsVisible}>
            <PlaylistDelete bind:playlist={playlist} bind:isVisible={playlistDeleteIsVisible} />
        </Menu>
    {/if}
{:else}
    <p>{$_('text.loading')}</p>
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
        border-radius: 6px;
        overflow: hidden;
        font-size: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
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
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
        display: flex;
        margin-block-end: var(--spacing-lg);
    }

    .playlist-actions {
        display: flex;
        flex-direction: row;
    }

    .type {
        --roboto-opsz: 32;
        display: flex;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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

    @container site-content-inner (min-width: 1400px) {
        .page-wrapper {
            grid-template-columns: 400px 1fr;
            grid-template-rows: 1fr;
            min-height: 0;
            overflow: hidden;
            position: absolute;
            inset-block-start: 0;
            inset-block-end: 0;
            inset-inline-start: 0;
            inset-inline-end: 0;
            padding: 0;
            grid-column: full;
            gap: 0;
        }

        .details-container,
        .songs-container {
            padding: var(--spacing-xxl);
            overflow: auto;
        }
    }
</style>