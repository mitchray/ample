<script>
    import { getContext, tick } from 'svelte';
    import Menu from '../../components/menu.svelte';
    import PlaylistAddTo from '../../components/playlist/playlist_addTo.svelte';
    import SVGPlaylist from "../../../public/images/queue_music.svg";

    export let contextKey;

    const { getType, getMode, getID, getSongs } = getContext(contextKey);

    let loaded = false;
    let menuIsVisible = false;
    let type = getType();
    let mode = getMode();
    let id = getID();
    let songsForPlaylistAdd = [];

    async function handleAction() {
        menuIsVisible = !menuIsVisible;
        await tick();
        
        if (menuIsVisible) {
            songsForPlaylistAdd = await getSongs();
        }
    }
</script>

<button
    type="button"
    id="js-action-playlist_add_{type}{mode}{id}"
    on:click={handleAction}
    title="Add to Playlist"
>
    <SVGPlaylist />
</button>

{#if menuIsVisible}
    <Menu anchor="left-center" toggleElement={document.querySelector("#js-action-playlist_add_" + type + mode + id)} bind:isVisible={menuIsVisible}>
        <PlaylistAddTo bind:songs={songsForPlaylistAdd} bind:isVisible={menuIsVisible} />
    </Menu>
{/if}