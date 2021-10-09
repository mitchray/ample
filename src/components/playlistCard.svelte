<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';
    import Menu from '../components/menu.svelte';
    import PlaylistEdit from './playlists/playlist_edit.svelte';
    import PlaylistDelete from './playlists/playlist_delete.svelte';

    import SVGMore from "../../public/images/more-hori.svg";

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

<div class="playlist-card">
    {#if playlist}
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

        <button id="playlistMoreToggle-{playlist.id}" class="icon more" on:click|stopPropagation={handleMenu}><SVGMore /></button>

        {#if showPlaylistMore}
            <Menu anchor="bottom-right" toggleElement={document.querySelector('#playlistMoreToggle-' + playlist.id)} bind:isVisible={showPlaylistMore} >
                <ul class="menu-list">
                    <li>
                        <button class="visuallyLink" id="playlistEditToggle-{playlist.id}" on:click={handleEdit}>Edit</button>
                    </li>
                    <li>
                        <button class="visuallyLink" id="playlistDeleteToggle-{playlist.id}" on:click={handleDelete}>Delete</button>
                    </li>
                </ul>
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
    /* Playlist grids should have this on the containing element */
    :global(.playlist-grid) {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    :global(.playlist-scroll) {
        gap: 20px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.playlist-scroll) .playlist-card {
        width: 220px;
    }

    :global(.playlist-card) {
        border: 2px solid var(--color-card-background);
        padding: var(--spacing-lg);
        padding-bottom: var(--spacing-sm);
        border-radius: 10px;
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        position: relative;
    }

    :global(.playlist-card:hover) {
        border-color: transparent;
        background-color: var(--color-card-background);
    }

    :global(.highlight .playlist-card) {
        border: 2px solid var(--color-highlight);
    }

    .title {
        font-weight: 700;
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