<script>
    import { getContext, tick } from 'svelte';
    import Menu from '../../components/menu.svelte';
    import PlaylistDelete from '../../components/playlist/playlist_delete.svelte';
    import SVGDelete from "/src/images/delete.svg";

    export let contextKey;

    const { getID, getData } = getContext(contextKey);

    let menuIsVisible = false;
    let id = getID();
    let data = getData();

    async function handleAction() {
        menuIsVisible = !menuIsVisible;
        await tick();
    }
</script>

<button
    type="button"
    class="danger"
    id="js-action-playlist_delete_{id}"
    on:click={handleAction}
    title="Delete Playlist"
>
    <SVGDelete />
</button>

{#if menuIsVisible}
    <Menu anchor="left" toggleSelector={"#js-action-playlist_delete_" + id} bind:isVisible={menuIsVisible}>
        <PlaylistDelete bind:playlist={data.playlist} bind:isVisible={menuIsVisible} />
    </Menu>
{/if}