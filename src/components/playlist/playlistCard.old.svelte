<script>
    import { Link } from "svelte-routing";

    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/actions.svelte';
    import Menu from '../../components/menu.svelte';
    import PlaylistEdit from '../../components/playlist/playlist_edit.svelte';
    import PlaylistDelete from '../../components/playlist/playlist_delete.svelte';
    import PlaylistArt from '../../components/playlist/playlist_art.svelte';

    import SVGMore from "../../../public/images/more-hori.svg";

    export let playlist = null;

    let showPlaylistEdit = false;
    let showPlaylistMore = false;
    let showPlaylistDelete = false;

    $: playlist = playlist;

    function handleMenu() {
        showPlaylistMore = !showPlaylistMore;
    }

    function handleEdit() {
        showPlaylistEdit = !showPlaylistEdit;
        handleMenu();
    }

    async function handleDelete() {
        showPlaylistDelete = !showPlaylistDelete;
        handleMenu();
    }
</script>

<div class="playlist-card card">
    {#if playlist}
        <div class="image-container">
            <Link to="playlists/{playlist.id}" title="{playlist.name}">
                <PlaylistArt bind:playlist fallback="{playlist.art}" />
            </Link>
        </div>

        <div class="title">
            <Link to="playlists/{playlist.id}" title="{playlist.name}">{playlist.name}</Link>
        </div>

        <div class="owner">
            by {playlist.owner}
        </div>

        <div class="count">
            {playlist.items} {parseInt(playlist.items) === 1 ? 'song' : 'songs'} &bull; {playlist.type[0].toUpperCase() + playlist.type.substring(1)}
        </div>

        <Rating type="playlist" id="{playlist.id}" rating="{playlist.rating}" flag="{playlist.flag}" averageRating="{playlist.averagerating}" />

        <div class="actions">
            <Actions
                type="playlist"
                mode="miniButtons"
                id="{playlist.id}"
                count="{playlist.items}"
            />
        </div>

        <button id="playlistMoreToggle-{playlist.id}" class="icon-button more" on:click|stopPropagation={handleMenu}><SVGMore /></button>

        {#if showPlaylistMore}
            <Menu anchor="bottom-right" toggleElement={document.querySelector('#playlistMoreToggle-' + playlist.id)} bind:isVisible={showPlaylistMore} >
                <div class="panel-content">
                    <ul class="menu-list">
                        <li>
                            <button class="visuallyLink" id="playlistEditToggle-{playlist.id}" on:click={handleEdit}>Edit</button>
                        </li>
                        <li>
                            <button class="visuallyLink" id="playlistDeleteToggle-{playlist.id}" on:click={handleDelete}>Delete</button>
                        </li>
                    </ul>
                </div>
            </Menu>
        {/if}

        {#if showPlaylistEdit}
            <Menu anchor="bottom-center" toggleElement={document.querySelector('#playlistMoreToggle-' + playlist.id)} bind:isVisible={showPlaylistEdit} >
                <PlaylistEdit bind:playlist={playlist} bind:isVisible={showPlaylistEdit} />
            </Menu>
        {/if}

        {#if showPlaylistDelete}
            <Menu anchor="bottom-center" toggleElement={document.querySelector('#playlistMoreToggle-' + playlist.id)} bind:isVisible={showPlaylistDelete} >
                <PlaylistDelete bind:playlist={playlist} bind:isVisible={showPlaylistDelete} />
            </Menu>
        {/if}
    {:else}
        <div class="title">
            Loading
        </div>

        <div class="owner">
            <br>
        </div>

        <div class="count">
            <br>
        </div>

        <Rating />

        <div class="actions">
            <Actions type="playlist" mode="miniButtons" />
        </div>
    {/if}
</div>

<style>
    .image-container {
        font-size: 0;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: var(--spacing-md);
    }

    .title {
        margin-bottom: var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: var(--spacing-lg); /* leave room for the menu button */
    }

    .count {
        margin-bottom: var(--spacing-md);
    }

    .owner {
        margin-bottom: var(--spacing-md);
    }

    .actions {
        margin-top: var(--spacing-md);
    }

    .more {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
    }
</style>